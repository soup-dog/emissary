import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User, Message, AESCBCKey, Route, UserInfo, Session } from './messenger';

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
  public static readonly LANDING_HOME_URL: string = 'home';
  private _session: Session | null = null;
  private _users: Map<string, ArrayBuffer> = new Map<string, ArrayBuffer>();
  public ready: boolean = false;

  public get sessionAvailable(): boolean {
    return sessionStorage.getItem(MessengerService.USER_SESSION_STORAGE_KEY) != null;
  }

  public get loggedIn() {
    return this._session !== null;
  }

  constructor(private router: Router) {
    this.pullSession().then(() => {// pull session from session storage if available
      this.ready = true;
    });
    this.pullUsers(); // pull users from local storage
  }

  public requireLoggedIn(): void {
    if (!this.loggedIn) { // if not logged in
      this.router.navigate([MessengerService.REGISTER_ROUTE]); // navigate to register page
    }
  }

  public requireSession(): Session {
    // raise error if user is not logged in
    if (!this.loggedIn) {
      throw Error('User is not logged in.');
    }

    return <Session>this._session; // cast user to User and return
  }

  public requireUserInfo(): UserInfo {
    return this.requireSession().user.toUserInfo();
  }

  /**
   * 
   * @returns the messages of the logged in user.
   */
  public getMessages(): Message[] {
    return this.requireSession().user.messages;
  }

  public getRoutes(): Route[] {
    return this.requireSession().user.routes;
  }

  public setUserPfpFromFile(file: File): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.requireSession().user.pfpDataURL = <string>reader.result; // cast result to string (because it is a data url) and set pfpDataURL
      this.pushSession(); // push updated user to session storage
    };
    reader.readAsDataURL(file); // read the image as a data url
  }

  public async generateRoute(): Promise<Route> {
    const route = await Route.generate(); // generate new route
    this.requireSession().user.routes.push(route); // add it to the user's routes
    this.pushSession(); // push the user session to storage
    return route;
  }

  public async register(username: string): Promise<string> {
    const user = new User(username); // create a new user with the given username
    user.pfpDataURL = defaultPfp; // set pfp to default pfp
    const key = await AESCBCKey.generate(); // generate new UserKey
    this._session = new Session(user, key); // create session from new user and key
    this.pushSession(); // push session to storage
    console.log('registering');
    console.log(await key.toDataURL());
    return await key.toDataURL(); // return key as a data url
  }
  
  public login(username: string, keyFile: File) {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const key = await AESCBCKey.fromJSON(JSON.parse(<string>reader.result)) // load key from file contents
      const ciphertext = this._users.get(username); // get ciphertext from users
      const plaintext = await key.decrypt(<ArrayBuffer>ciphertext); // cast to arraybuffer and decrypt
      console.log('key:', key);
      console.log('plaintext:', plaintext, new TextDecoder().decode(plaintext));
      console.log('ciphertext:', ciphertext);
      const user = User.fromJSON(JSON.parse(new TextDecoder().decode(plaintext))); // load user from JSON string
      this._session = new Session(user, key); // create session from user and key
      this.pushSession();
      this.router.navigate([MessengerService.APP_ROUTE]); // navigate to main page
    }
    reader.readAsText(keyFile);
  }

  public logout() {
    this.pushSession() // push session to storage
    .then(() => { // wait for session push completion
      this._session = null; // set session to null
      sessionStorage.removeItem(MessengerService.USER_SESSION_STORAGE_KEY); // clear user session from session storage
      window.location.pathname = MessengerService.LANDING_HOME_URL; // navigate out of app to home url
    });
  }

  /**
   * Pulls the session from session storage.
   */
  private async pullSession(): Promise<void> {
    this._session = await this.getSession();
  }

  /**
   * Pushes the current user to the users map and to session storage.
   */
  private async pushSession(): Promise<void> {
    await this.setSession(this.requireSession());
    // encrypt session
    const ciphertext = await this.requireSession().key.encrypt(new TextEncoder().encode(JSON.stringify(this.requireSession().user)));
    this._users.set(this.requireSession().user.username, ciphertext); // update users with ciphertext
    this.pushUsers(); // push users to local storage
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
    this._users.forEach((value, key) => { dictionary[key] = Array.from(new Uint8Array(value)) }); // for each value key pair in _users set the corresponding pair in the dictionary and convert the value to a uint8array so that it can be converted to json
    localStorage.setItem(MessengerService.USERS_STORAGE_KEY, JSON.stringify(dictionary));
  }

  private async getSession(): Promise<Session | null> {
    const data = sessionStorage.getItem(MessengerService.USER_SESSION_STORAGE_KEY); // pull session from storage as a JSON string
    if (data == null) { return null; } // return null if stored data is null
    const session = await Session.fromJSON(JSON.parse(data)); // otherwise convert the JSON string to an instance of Session
    return session;
  }

  private async setSession(session: Session) {
    console.log('setting session')
    console.log(session);
    console.log(await session.toJSON())
    sessionStorage.setItem(MessengerService.USER_SESSION_STORAGE_KEY, JSON.stringify(await session.toJSON())); // set user in session storage
  }
}
