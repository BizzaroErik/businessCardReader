import { Injectable } from '@angular/core';
import { LoginService } from '../login/login.service';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable()
export class DashboardService {
  searchHistoryRef: any;
  searchHistory: any[];
  constructor(private loginService: LoginService, private db: AngularFireDatabase) {
    this.searchHistoryRef = this.db.list(`currentSession/${this.loginService.userUid}/searches`);
    this.searchHistory = [];
  }

  addCardToDB(businessObj: any){
    this.db.list(`businessCards/`).push(businessObj);
  }
  searchCards() {
    return this.db.object(`businessCards/`).valueChanges();
    //return this.db.object(`businessCards/`).snapshotChanges();
  }

  getAdmin(){
    return this.db.object(`admins/`).valueChanges();
  }




  addHistory(history: string){
    console.log(this.loginService.userUid);
    this.db.list(`history/${this.loginService.userUid}`).push(history);
  }

  getHistory(){
    return this.db.object(`history/${this.loginService.userUid}`).valueChanges();
  }








  addNamesToHistory(first: string, last: string) {
    this.searchHistory.push({firstName: first, lastName: last});
  }


  searchLast(last: string){
    return this.db.object(`names/lastNames/${last}`).snapshotChanges();
  }



  getSearchHistory() {
    return this.searchHistoryRef.valueChanges();
  }
  addNameToDB(first:string, last:string){
    this.db.list(`names/firstNames`).set(first, true);
    this.db.list(`names/lastNames`).set(last,true);
  }
}
