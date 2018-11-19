import { Component } from '@angular/core';
import { LoginService } from './login/login.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  private _opened: boolean;
  constructor(private loginService: LoginService) {
    this._opened = true;
  }


private _toggleSidebar() {
  this._opened = !this._opened;
}
  logout() {
    this.loginService.signOut();
  }
}



