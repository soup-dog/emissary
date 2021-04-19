import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  pfpControl = new FormControl();

  constructor() {}

  ngOnInit(): void {
    this.pfpControl.valueChanges.subscribe(file => {
      console.log(file);
      let reader = new FileReader();
      reader.onloadend = () => {console.log(reader.result)};
      reader.readAsArrayBuffer(file);
    })
  }
}
