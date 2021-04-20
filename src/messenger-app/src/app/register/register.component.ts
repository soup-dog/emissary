import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

  constructor(private messenger: MessengerService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log("submitted");
    this.messenger.register(this.registerForm.value["username"]);
  }
}
