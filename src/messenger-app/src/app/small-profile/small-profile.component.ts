import { Component, OnInit } from '@angular/core';
import { User } from '../messenger';
import { MessengerService } from '../messenger.service';

@Component({
  selector: 'app-small-profile',
  templateUrl: './small-profile.component.html',
  styleUrls: ['./small-profile.component.scss']
})
export class SmallProfileComponent implements OnInit {

  constructor(private messenger: MessengerService) { }

  ngOnInit(): void {
    this.messenger.requireLoggedIn();
  }

  public requireUser(): User {
    return this.messenger.requireSession();
  }
}
