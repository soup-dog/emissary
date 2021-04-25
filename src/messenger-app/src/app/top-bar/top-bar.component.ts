import { Component, OnInit } from '@angular/core';
import { MessengerService } from '../messenger.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  constructor(private messenger: MessengerService) { }

  ngOnInit(): void {
  }

  public get userInfo() {
    return this.messenger.requireUserInfo();
  }

  public logout = this.messenger.logout.bind(this.messenger);
}
