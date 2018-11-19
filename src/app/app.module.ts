import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HistoryComponent } from './history/history.component';

import { firebaseConfig, BusinessFireBaseconfig } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {FormsModule} from '@angular/forms';

import { LoginService } from './login/login.service';
import { AppRoutingModule } from './app-routing.module';

import {AuthGuard} from './login/auth.guard';
import { DashboardService } from './dashboard/dashboard.service';

import {HttpClientModule} from '@angular/common/http';
import {WebcamModule} from 'ngx-webcam';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    WebcamModule,
    HttpClientModule,
    AngularFireModule.initializeApp(BusinessFireBaseconfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [LoginService, DashboardService, AuthGuard],

  bootstrap: [AppComponent]
})
export class AppModule { }
