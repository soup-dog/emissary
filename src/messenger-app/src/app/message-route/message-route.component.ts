import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Route } from '../messenger';
import { MessengerService } from '../messenger.service';


@Component({
  selector: 'app-message-route',
  templateUrl: './message-route.component.html',
  styleUrls: ['./message-route.component.scss']
})
export class MessageRouteComponent implements OnInit {
  public messageRoute: Route | null = null;
  public routeIndex: number = -1;
  public messageForm: FormGroup = new FormGroup({
    message: new FormControl('')
  });

  constructor(private route: ActivatedRoute, private messenger: MessengerService) { }

  ngOnInit(): void {
    this.routeIndex = Number(this.route.snapshot.paramMap.get('routeIndex'));
    this.messageRoute = this.messenger.requireSession().user.routes[this.routeIndex];
  }

  onMessageFormSubmit(): void {
    console.log("in onsubmit");
    this.messenger.sendMessage(this.messageForm.value["message"], this.routeIndex);
    this.messageForm.value["message"] = "";
  }

}
