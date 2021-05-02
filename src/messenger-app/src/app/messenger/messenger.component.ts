import { Component, OnInit } from '@angular/core';
import { Message } from '../messenger';
import { MessengerService } from '../messenger.service';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss', '../list.scss']
})
export class MessengerComponent implements OnInit {

  constructor(private messenger: MessengerService) { 
    this.messenger.readyEvent.subscribe(this.messenger.requireLoggedIn.bind(this.messenger));
  }

  ngOnInit(): void {
  }

  public get ready() {
    return this.messenger.ready;
  }

  public get messages(): Message[] {
    return this.messenger.getMessages();
  }
}
