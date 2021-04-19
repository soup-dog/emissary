import { Component, OnInit } from '@angular/core';
import { Message, User } from '../messenger';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit {
  loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  messages: Array<Message> = [
    new Message("hello world!", new User("???", new ArrayBuffer(1))),
    new Message(this.loremIpsum, new User("[Insert_Username_Here]", new ArrayBuffer(1))),
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
