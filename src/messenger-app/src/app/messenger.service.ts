import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './messenger';
import { NormalEvent } from './normal-event';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  public static readonly USER_STORAGE_KEY = "user";
  private _user: User | null;
  public userSet: NormalEvent<User> = new NormalEvent<User>();

  constructor() {
    this._user = this.getUser();
  }

  public setUserPfp(profilePicture: ArrayBuffer): void {
    if (this._user == null) { return; }
    this._user.profilePicture = profilePicture;
    this.pushUser();
  }

  register(username: string) {
    this._user = new User(username);
  }

  private pullUser(): void {
    this._user = this.getUser();
  }

  private pushUser(): void {
    if (this._user == null) { return; }
    this.setUser(this._user);
  }

  getUser(): User | null {
    const data = sessionStorage.getItem(MessengerService.USER_STORAGE_KEY); // pull user from storage as a JSON string
    if (data == null) { return null; } // return null if stored data is null
    const user = User.loadFromJSON(data); // otherwise convert the JSON string to an instance of User
    return user;
  }

  setUser(user: User) {
    sessionStorage.setItem(MessengerService.USER_STORAGE_KEY, JSON.stringify(user)); // set user in session storage
    this.userSet.dispatch(user); // dispatch event
  }
}
