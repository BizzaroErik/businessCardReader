import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { LoginService} from './login.service';

import { Observable } from 'rxjs/Observable';
import { map, take, tap } from 'rxjs/operators';
import {DashboardService} from '../dashboard/dashboard.service';

@Injectable()
export class AuthGuard implements CanActivate {
  adminId: any;
  constructor(private authService: LoginService, private router: Router, private dashboard: DashboardService) {
    
  }

  getAdmins(){
    this.dashboard.getAdmin().subscribe( (ref:any) => {
      console.log(ref);
      var x = Object.keys(ref);
      console.log("THis is the getadmins firing");
      console.log(x[0]);
      this.adminId = x[0];
    });
  }
  

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      console.log('AUTH USER AUTH USER');
      console.log(this.authService.userUid);
      console.log('AUTH USER AUTH USER');

      
    // console.log('IS ADMIN IS ADMIN IS ADMIN');
    // console.log('IS ADMIN IS ADMIN IS ADMIN');
    return this.authService.user.pipe(
      
      take(1),
      map((user) => !!user),
      tap((loggedIn) => {
        if (!loggedIn) {
          console.log('access denied');
          this.router.navigate(['']);
        }
      }),
    );
  }
}
