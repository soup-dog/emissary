import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessengerService } from '../messenger.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../form.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      this.usernameAvailable.bind(this)
    ])
  });
  registerdUsername: string = "";
  shown: boolean = false;
  keyDataURL: SafeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // rickroll anyone who tries to download the key file before registering
  downloaded: boolean = false;

  constructor(private messenger: MessengerService, private sanitiser: DomSanitizer, private router: Router) { }

  ngOnInit(): void {
  }
  
  public usernameAvailable(control: AbstractControl): {[key: string]: any} | null {
    return this.messenger.usernameAvailable(control.value) ? null : {usernameTaken: {value: control.value}};
  }

  public requireUser = this.messenger.requireSession.bind(this.messenger);

  public get username() {
    return this.registerForm.get('username');
  }

  onSubmit(): void {
    this.messenger.register(this.registerForm.value["username"])
      .then((keyDataURL) => {
        this.keyDataURL = this.sanitiser.bypassSecurityTrustUrl(keyDataURL); // set key data url
        this.registerdUsername = this.messenger.requireSession().user.username; // set username
        this.shown = true; // show popup
      });
  }
}
