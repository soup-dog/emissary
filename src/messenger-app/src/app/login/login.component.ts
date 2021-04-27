import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessengerService } from '../messenger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../form.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    keyFile: new FormControl('')
  });
  public loginError: boolean = false;

  constructor(private messenger: MessengerService) { }

  ngOnInit(): void {
  }

  public onSubmit() {
    try {
      this.messenger.login(this.loginForm.value["username"], this.loginForm.value["keyFile"]); 
    }
    catch(e) {
      this.loginError = true;
    }
  }
}
