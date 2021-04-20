import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './messenger';
import { NormalEvent } from './normal-event';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  public static readonly USER_STORAGE_KEY = "user";
  private _user: User | null = null;
  public userSet: NormalEvent<User> = new NormalEvent<User>();
  public get storedUserAvailable(): boolean {
    return sessionStorage.getItem(MessengerService.USER_STORAGE_KEY) != null;
  }

  constructor(private router: Router) {
    if (this.storedUserAvailable) {
      this._user = this.getUser();
    }
    console.log(this._user);
  }

  public setUserPfpFromFile(file: File): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (this._user == null) { return; }
      this._user.pfpDataURL = <string>reader.result;
      this.pushUser();
    }; // cast result to string (because it is a data url) and set pfpDataURL
    reader.readAsDataURL(file); // read the image as a data url
  }

  register(username: string) {
    this._user = new User(username);
    this.pushUser();
  }

  login() {

  }

  private pullUser(): void {
    this._user = this.getUser();
  }

  private pushUser(): void {
    if (this._user == null) { return; }
    this.setUser(this._user);
  }

  getUser(): User {
    const data = sessionStorage.getItem(MessengerService.USER_STORAGE_KEY); // pull user from storage as a JSON string
    if (data == null) { throw Error("No user at " + MessengerService.USER_STORAGE_KEY + "."); } // throw error if stored data is null
    const user = User.loadFromJSON(data); // otherwise convert the JSON string to an instance of User
    return user;
  }

  setUser(user: User) {
    sessionStorage.setItem(MessengerService.USER_STORAGE_KEY, JSON.stringify(user)); // set user in session storage
    this.userSet.dispatch(user); // dispatch event
  }
}
