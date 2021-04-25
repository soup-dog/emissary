import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User, Message, AESCBCKey, Route, UserInfo } from './messenger';
import { NormalEvent } from './normal-event';

const defaultPfp = require('!!raw-loader?!../assets/defaultPfp.txt').default;

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  public static readonly USER_SESSION_STORAGE_KEY: string = 'user';
  public static readonly MESSAGES_STORAGE_KEY: string = 'messages';
  public static readonly USERS_STORAGE_KEY: string = 'users';
  public static readonly REGISTER_ROUTE: string = 'register';
  public static readonly APP_ROUTE: string = 'app';
  private _session: User | null = null;
  private _users: Map<string, ArrayBuffer> = new Map<string, ArrayBuffer>();
  private _userKey: AESCBCKey | null = null;
  public userSet: NormalEvent<User> = new NormalEvent<User>();

  public get sessionAvailable(): boolean {
    return sessionStorage.getItem(MessengerService.USER_SESSION_STORAGE_KEY) != null;
  }

  public get loggedIn() {
    return this._session !== null;
  }

  constructor(private router: Router) {
    this.pullUsers(); // pull users from local storage
    this.pullSession(); // pull session from session storage if available
  }

  public requireLoggedIn(): void {
    if (!this.loggedIn) { // if not logged in
      this.router.navigate([MessengerService.REGISTER_ROUTE]); // navigate to register page
    }
  }

  public requireSession(): User {
    // raise error if user is not logged in
    if (!this.loggedIn) {
      throw Error('User is not logged in.');
    }

    return <User>this._session; // cast user to User and return
  }

  public requireUserInfo(): UserInfo {
    return this.requireSession().toUserInfo();
  }

  /**
   * 
   * @returns the messages of the logged in user.
   */
  public getMessages(): Message[] {
    return this.requireSession().messages;
  }

  public getRoutes(): Route[] {
    return this.requireSession().routes;
  }

  public setUserPfpFromFile(file: File): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.requireSession().pfpDataURL = <string>reader.result; // cast result to string (because it is a data url) and set pfpDataURL
      this.pushSession(); // push updated user to session storage
    };
    reader.readAsDataURL(file); // read the image as a data url
  }

  public async register(username: string): Promise<string> {
    this._session = new User(username); // create a new user with the given username and store it in session
    this._session.pfpDataURL = defaultPfp; // set pfp to default pfp
    this._userKey = await AESCBCKey.generate(); // generate new UserKey and store it in _userKey
    this.pushSession(); // push user session to storage
    return await this._userKey.toDataURL(); // return key as a data url
  }
  
  public login(username: string, keyFile: File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      AESCBCKey.fromJSON(JSON.parse(<string>reader.result)) // load key from file contents
        .then(userKey => {
          this._userKey = userKey; // set _userKey to result
          const ciphertext = this._users.get(username); // get ciphertext from users
          return userKey.decrypt(<ArrayBuffer>ciphertext); // cast to arraybuffer and decrypt
        })
        .then(buffer => {
          this._session = User.fromJSON(JSON.parse(new TextDecoder().decode(buffer)));
          this.pushSession();
          this.router.navigate([MessengerService.APP_ROUTE]);
        });
    }
    reader.readAsText(keyFile);
  }

  /**
   * Pulls the session from session storage.
   */
  private pullSession(): void {
    this._session = this.getSession();
  }

  /**
   * Pushes the current user to the users map and to session storage.
   */
  private pushSession(): void {
    this.setSession(this.requireSession());
    // cast _userKey to AESCBCKey because _userKey should be set if requireUser() passed and encrypt user
    (<AESCBCKey>this._userKey).encrypt(new TextEncoder().encode(JSON.stringify(this.requireSession())))
      .then((ciphertext) => {
        this._users.set(this.requireSession().username, ciphertext); // update users with ciphertext
        this.pushUsers(); // push users to local storage
      });
  }

  /**
   * Pulls users map from local storage.
   * @returns 
   */
  private pullUsers(): void {
    const data = localStorage.getItem(MessengerService.USERS_STORAGE_KEY); // pull users json string from storage
    this._users = new Map<string, ArrayBuffer>(); // create new map
    if (data == null) { // no map exists
      return;
    }

    const jsonObject = JSON.parse(data); // parse the data into an object

    Object.entries(jsonObject) // get key value pairs
      .forEach(([key, value]) => { this._users.set(key, new Uint8Array(<any>value).buffer) }) // for each pair set pair in map 
  }

  /**
   * Pushes users map to local storage.
   */
  private pushUsers(): void {
    const dictionary: any = {}; // create new empty object
    const decoder = new TextDecoder();
    this._users.forEach((value, key) => { dictionary[key] = Array.from(new Uint8Array(value)) }); // for each value key pair in _users set the corresponding pair in the dictionary and convert the value to a uint8array so that it can be converted to json
    localStorage.setItem(MessengerService.USERS_STORAGE_KEY, JSON.stringify(dictionary));
  }

  private getSession(): User | null {
    const data = sessionStorage.getItem(MessengerService.USER_SESSION_STORAGE_KEY); // pull user from storage as a JSON string
    if (data == null) { return null; } // return null if stored data is null
    const user = User.fromJSON(JSON.parse(data)); // otherwise convert the JSON string to an instance of User
    return user;
  }

  private setSession(user: User) {
    sessionStorage.setItem(MessengerService.USER_SESSION_STORAGE_KEY, JSON.stringify(user)); // set user in session storage
    this.userSet.dispatch(user); // dispatch event
  }
}
