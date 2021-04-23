import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { MessengerComponent } from './messenger/messenger.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'app', component: MessengerComponent },
  { path: 'app.html', component: MessengerComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register.html', component: RegisterComponent },
  { path: 'account', component: AccountComponent },
  { path: 'account.html', component: AccountComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
