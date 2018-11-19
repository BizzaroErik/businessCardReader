import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { LoginService} from './login.service';

import { Observable } from 'rxjs/Observable';
import { map, take, tap } from 'rxjs/operators';
import {DashboardService} from '../dashboard/dashboard.service';

@Injectable()
export class AuthGuard implements CanActivate {
  adminId: any;
  constructor(private loginService: LoginService, private router: Router, private dashboardService: DashboardService) {
    
  }

  

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      console.log('AUTH USER AUTH USER');
      console.log(this.loginService.user);
      console.log('AUTH USER AUTH USER');

      /*
      var tf;
      this.dashboardService.getAdmin().subscribe( (results:any)=> {
        console.log(results);
        var keyArray = Object.keys(results)
        var userId =this.dashboardService.getUser;
        console.log(keyArray[0]);
        var keysss = keyArray[0];
        if(userId === keysss){
          console.log("they match");
        }
      })*/
    // console.log('IS ADMIN IS ADMIN IS ADMIN');
    // console.log('IS ADMIN IS ADMIN IS ADMIN');
    
    return this.loginService.user.pipe(
      
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
