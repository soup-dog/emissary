import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MessageListComponent } from './message-list/message-list.component';
import { AccountComponent } from './account/account.component';
import { FileValueAccessorDirective } from './file-value-accessor.directive';
import { SmallProfileComponent } from './small-profile/small-profile.component';
import { RegisterComponent } from './register/register.component';
import { MessengerComponent } from './messenger/messenger.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    MessageListComponent,
    AccountComponent,
    FileValueAccessorDirective,
    SmallProfileComponent,
    RegisterComponent,
    MessengerComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
