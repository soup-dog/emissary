import { Component, Input, OnInit } from '@angular/core';
import { UserInfo } from '../messenger';

@Component({
  selector: 'app-small-profile',
  templateUrl: './small-profile.component.html',
  styleUrls: ['./small-profile.component.scss']
})
export class SmallProfileComponent implements OnInit {
  @Input() userInfo: UserInfo | null = null;
  @Input() routerLink: string | any[] | null | undefined = "/account";

  constructor() { }

  ngOnInit(): void {
  }

}
