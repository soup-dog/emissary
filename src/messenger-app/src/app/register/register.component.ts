import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessengerService } from '../messenger.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    username: new FormControl('')
  });
  username: string = "";
  shown: boolean = false;
  keyDataURL: SafeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // rickroll anyone who tries to download the key file before registering
  downloaded: boolean = false;

  constructor(private messenger: MessengerService, private sanitiser: DomSanitizer, private router: Router) { }

  ngOnInit(): void {
  }
  
  public requireUser = this.messenger.requireSession.bind(this.messenger);

  onSubmit(): void {
    this.messenger.register(this.registerForm.value["username"])
      .then((keyDataURL) => {
        this.keyDataURL = this.sanitiser.bypassSecurityTrustUrl(keyDataURL); // set key data url
        this.username = this.messenger.requireSession().user.username; // set username
        this.shown = true; // show popup
      });
  }
}
