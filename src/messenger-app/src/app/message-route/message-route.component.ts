import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Route } from '../messenger';
import { MessengerService } from '../messenger.service';


@Component({
  selector: 'app-message-route',
  templateUrl: './message-route.component.html',
  styleUrls: ['./message-route.component.scss']
})
export class MessageRouteComponent implements OnInit {
  messageRoute: Route | null = null;

  constructor(private route: ActivatedRoute, private messenger: MessengerService) { }

  ngOnInit(): void {
    const routeIndex = Number(this.route.snapshot.paramMap.get('routeIndex'));
    this.messageRoute = this.messenger.requireSession().user.routes[routeIndex];
  }

}
