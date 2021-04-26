import { Component, Input, OnInit } from '@angular/core';
import { Message, User } from '../messenger';
import { MessengerService } from '../messenger.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit {
  @Input() messages: Message[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
