import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User, Message } from './messenger';
import { NormalEvent } from './normal-event';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  public static readonly USER_STORAGE_KEY: string = "user";
  public static readonly MESSAGES_STORAGE_KEY: string = "messages";
  public static readonly USERS_STORAGE_KEY: string = "users";
  public static readonly REGISTER_ROUTE: string = "register";
  public static readonly APP_ROUTE: string = "app";
  private _user: User | null = null;
  public userSet: NormalEvent<User> = new NormalEvent<User>();

  public get storedUserAvailable(): boolean {
    return sessionStorage.getItem(MessengerService.USER_STORAGE_KEY) != null;
  }

  public get loggedIn() {
    return this._user !== null;
  }

  constructor(private router: Router) {
    this.pullUser(); // pull user from session storage if available
  }

  public requireLoggedIn(): void {
    if (!this.loggedIn) { // if not logged in
      this.router.navigate([MessengerService.REGISTER_ROUTE]); // navigate to register page
    }
  }

  public requireUser(): User {
    // raise error if user is not logged in
    if (!this.loggedIn) {
      throw Error("User is not logged in.");
    }

    return <User>this._user; // cast user to User and return
  }

  public getMessages(): Message[] {
    return this.requireUser().messages;
  }

  public setUserPfpFromFile(file: File): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.requireUser().pfpDataURL = <string>reader.result; // cast result to string (because it is a data url) and set pfpDataURL
      this.pushUser(); // push updated user to session storage
    };
    reader.readAsDataURL(file); // read the image as a data url
  }

  public register(username: string) {
    this._user = new User(username); // create a new user with the given username
    this.pushUser(); // 
    this.router.navigate([MessengerService.APP_ROUTE]);
  }
  
  public login() {
    
  }

  private pullUser(): void {
    this._user = this.getUser();
  }

  private pushUser(): void {
    this.setUser(this.requireUser());
  }

  private getUser(): User | null {
    const data = sessionStorage.getItem(MessengerService.USER_STORAGE_KEY); // pull user from storage as a JSON string
    if (data == null) { return null; } // return null if stored data is null
    const user = User.fromJSON(data); // otherwise convert the JSON string to an instance of User
    return user;
  }

  private setUser(user: User) {
    sessionStorage.setItem(MessengerService.USER_STORAGE_KEY, JSON.stringify(user)); // set user in session storage
    this.userSet.dispatch(user); // dispatch event
  }
}
