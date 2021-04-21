import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User, Message } from './messenger';
import { NormalEvent } from './normal-event';

@Injectable({
  providedIn: 'root'
})
export class MessengerService {
  public static readonly USER_STORAGE_KEY: string = "user";
  public static readonly REGISTER_ROUTE: string = "app/register";
  private _user: User | null = null;
  public userSet: NormalEvent<User> = new NormalEvent<User>();

  public get storedUserAvailable(): boolean {
    return sessionStorage.getItem(MessengerService.USER_STORAGE_KEY) != null;
  }

  public get loggedIn() {
    return this._user !== null;
  }

  constructor(private router: Router) {
    this.pullUser();
  }

  static requiresLoggedIn = (target: MessengerService, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      target.checkLoggedIn();
      originalMethod.apply(this, args);
    }

    return descriptor;
  }

  public requireUser(): User {
    if (!this.loggedIn) {
      throw Error("User is not logged in. WARNING: This error should not been raised, it should have been guarded by the requiresLoggedIn decorator.");
    }

    return <User>this._user;
  }

  public checkLoggedIn() {
    if (!this.loggedIn) {
      this.router.navigate([MessengerService.REGISTER_ROUTE]);
    };
  }

  @MessengerService.requiresLoggedIn public getMessages(): Message[] {
    return this.requireUser().messages;
  }

  @MessengerService.requiresLoggedIn public setUserPfpFromFile(file: File): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.requireUser().pfpDataURL = <string>reader.result;
      this.pushUser();
    }; // cast result to string (because it is a data url) and set pfpDataURL
    reader.readAsDataURL(file); // read the image as a data url
  }

  public register(username: string) {
    this._user = new User(username);
    this.pushUser();
  }
  
  public login() {
    
  }

  private pullUser(): void {
    this._user = this.getUser();
  }

  @MessengerService.requiresLoggedIn private pushUser(): void {
    this.setUser(this.requireUser());
  }

  private getUser(): User | null {
    const data = sessionStorage.getItem(MessengerService.USER_STORAGE_KEY); // pull user from storage as a JSON string
    if (data == null) { return null; } // return null if stored data is null
    const user = User.loadFromJSON(data); // otherwise convert the JSON string to an instance of User
    return user;
  }

  private setUser(user: User) {
    sessionStorage.setItem(MessengerService.USER_STORAGE_KEY, JSON.stringify(user)); // set user in session storage
    this.userSet.dispatch(user); // dispatch event
  }
}
