import { Component, OnInit } from '@angular/core';
import { MessengerService } from '../messenger.service';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss']
})
export class MessengerComponent implements OnInit {

  constructor(private messenger: MessengerService) { }

  ngOnInit(): void {
  }

  public get ready() {
    return this.messenger.ready;
  }
}
