import { Injectable } from '@angular/core';
import { User } from './messenger';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  public static readonly USER_STORAGE_KEY = "user";
  private user: User | null;

  constructor() {
    this.user = this.getUser();
  }

  register(username: string) {
    this.user = new User(username);
  }

  pullUser(): void {
    this.user = this.getUser();
  }

  pushUser(): void {
    if (this.user == null) { return; }
    this.setUser(this.user);
  }

  getUser(): User | null {
    const data = sessionStorage.getItem(MessengerService.USER_STORAGE_KEY); // pull user from storage as a JSON string
    if (data == null) { return null; } // return null if stored data is null
    const user = User.loadFromJSON(data); // otherwise convert the JSON string to an instance of User
    return user;
  }

  setUser(user: User) {
    sessionStorage.setItem(MessengerService.USER_STORAGE_KEY, JSON.stringify(user));
  }
}
