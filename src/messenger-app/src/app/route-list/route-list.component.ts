import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessengerService } from '../messenger.service';

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.scss']
})
export class RouteListComponent implements OnInit {
  showNewRoutePopup: boolean = false;
  createRouteWordKey: string = '';
  routeCreated: boolean = false;
  addRouteForm: FormGroup = new FormGroup({
    wordKey: new FormControl('')
  });

  constructor(private messenger: MessengerService) { }

  ngOnInit(): void {
  }

  get routes() {
    return this.messenger.getRoutes();
  }

  onNewRouteClick(): void {
    this.showNewRoutePopup = true;
  }

  onAddRouteFormSubmit(): void {

  }

  onCreateRoute(): void {
    this.messenger.generateRoute() // generate new route
      .then(route => route.key.toWords()) // convert key to words
      .then(words => {
        this.createRouteWordKey = words.join(' '); // set word key
        this.routeCreated = true; // show in DOM
      });
  }
}
