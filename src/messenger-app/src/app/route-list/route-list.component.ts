import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, from, of } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';
import { MessengerService } from '../messenger.service';

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.scss', '../form.scss']
})
export class RouteListComponent implements OnInit {
  showNewRoutePopup: boolean = false;
  createRouteWordKey: string = '';
  routeCreated: boolean = false;
  addRouteForm: FormGroup = new FormGroup({
    wordKey: new FormControl('', [
      Validators.required
    ], [
      this.hasRouteAlready.bind(this)
    ])
  });

  constructor(private messenger: MessengerService) { }

  ngOnInit(): void {
  }

  get wordKeyControl() {
    return this.addRouteForm.get('wordKey');
  }

  get routes() {
    return this.messenger.getRoutes();
  }

  public async hasRouteAlready(control: AbstractControl): Promise<ValidationErrors | null> {
    return await this.messenger.hasRoute(control.value.split(' ')) ? { hasRoute: {value: control.value} } : null;
  }

  onNewRouteClick(): void {
    this.showNewRoutePopup = true;
  }

  onAddRouteFormSubmit(): void {
    this.messenger.addRoute(this.addRouteForm.value['wordKey'].split(' '));
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
