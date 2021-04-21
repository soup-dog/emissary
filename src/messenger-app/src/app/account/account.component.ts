import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MessengerService } from '../messenger.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  pfpControl = new FormControl();

  constructor(private messenger: MessengerService) {}

  ngOnInit(): void {
    this.pfpControl.valueChanges.subscribe(file => this.messenger.setUserPfpFromFile(file)) // subscribe with hack to keep this in context 
  }
}
