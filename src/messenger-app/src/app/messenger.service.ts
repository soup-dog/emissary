import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User, Message, UserKey } from './messenger';
import { NormalEvent } from './normal-event';

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
  private _userKey: UserKey | null = null;
  public userSet: NormalEvent<User> = new NormalEvent<User>();

  public get sessionAvailable(): boolean {
    return sessionStorage.getItem(MessengerService.USER_SESSION_STORAGE_KEY) != null;
  }

  public get loggedIn() {
    return this._session !== null;
  }

  constructor(private router: Router) {
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

  /**
   * 
   * @returns the messages of the logged in user.
   */
  public getMessages(): Message[] {
    return this.requireSession().messages;
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
    this.pushSession(); // push user to session storage
    this._userKey = await UserKey.generate(); // generate new UserKey and store it in _userKey
    return this._userKey.toJSON(); // return exported userKey
  }
  
  public login(username: string, keyFile: File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      UserKey.fromJSON(<string>reader.result) // load key from file contents
        .then((userKey) => this._userKey = userKey); // set _userKey to result
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
    // cast _userKey to UserKey because _userKey should be set if requireUser() passed and encrypt user
    (<UserKey>this._userKey).encrypt(this.requireSession())
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
      .forEach(([key, value]) => { this._users.set(key, <ArrayBuffer>value) }) // for each pair set pair in map
  }

  /**
   * Pushes users map to local storage.
   */
  private pushUsers(): void {
    const dictionary: any = {}; // create new empty object
    this._users.forEach((value, key) => { dictionary[key] = value; }); // for each value key pair in _users set the corresponding pair in the dictionary
    localStorage.setItem(MessengerService.USERS_STORAGE_KEY, JSON.stringify(dictionary));
  }

  private getSession(): User | null {
    const data = sessionStorage.getItem(MessengerService.USER_SESSION_STORAGE_KEY); // pull user from storage as a JSON string
    if (data == null) { return null; } // return null if stored data is null
    const user = User.fromJSON(data); // otherwise convert the JSON string to an instance of User
    return user;
  }

  private setSession(user: User) {
    sessionStorage.setItem(MessengerService.USER_SESSION_STORAGE_KEY, JSON.stringify(user)); // set user in session storage
    this.userSet.dispatch(user); // dispatch event
  }
}
