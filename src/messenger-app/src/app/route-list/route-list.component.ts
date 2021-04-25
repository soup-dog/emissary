import { Component, OnInit } from '@angular/core';
import { MessengerService } from '../messenger.service';

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.scss']
})
export class RouteListComponent implements OnInit {
  showNewRoutePopup: boolean = false;
  newRouteWordKey: string = "";

  constructor(private messenger: MessengerService) { }

  ngOnInit(): void {
  }

  get routes() {
    return this.messenger.getRoutes();
  }

  onNewRouteClick(): void {
    this.showNewRoutePopup = true;
  }
}
