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
  getHistory(){
    return this.db.object(`history/${this.loginService.userUid}`).valueChanges();
  }

  addCardToDB(businessObj: any){
    console.log("adding card to db" + businessObj);
    this.db.list(`businessCards/`).push(businessObj);
  }
  searchCards() {
    return this.db.object(`businessCards/`).valueChanges();
    //return this.db.object(`businessCards/`).snapshotChanges();
  }

  getAdmin(){
    return this.db.object(`admins/`).valueChanges();
  }
  getUser(){
    return this.loginService.userUid;
  }

  addHistory(history: string){
    var historyWithUser = `${history} ID: ${this.loginService.userUid}`;
    this.db.list(`history/${this.loginService.userUid}`).push(historyWithUser);
  }
  
  parseNames(textArray: any[], email: string){
    var fname;
    var lname;

    var smallerEmail = email.split('@')[0].toLowerCase();
    console.log(smallerEmail);
    if(email !== null){

      var i = 1;
      for(i; i<textArray.length; i++){
        let possibleName = textArray[i].description;
        var element = possibleName.replace(/\s/g,'');
        if(smallerEmail.includes(element.toLowerCase())){
          console.log("this email includes the element to lower case: " + element.toLowerCase());
          

          //may not trigger due to whitespace in email
          if(email === element) {
            console.log(email + " " + element + "they were equal");
            continue;
          }

          
          lname = element;
          if((i-1)>1){
            let priorElement = textArray[i-1].description;
            fname=priorElement;
          }
          else{
            fname = textArray[i].description;
            lname = textArray[i+1].description;
          }
          break;
        }

      }

      var fnameLname = { "fname": fname, "lname": lname};
      return fnameLname;
    }
  }

  parseText(textArray: any[]){
    //regexs for finding email and phone numbers
    var emailRegex = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g;
    var phoneRegex = new RegExp("\\+?\\(?\\d*\\)? ?\\(?\\d+\\)?\\d*([\\s./-]?\\d{2,})+", "g");
    
    //text from the card in one long string
    var inputText = textArray[0].description;
    
    var finalEmail;
    var i = 1;
    for(i; i<textArray.length; i++){
      if(textArray[i].description.includes("@")) finalEmail = textArray[i].description;
    }

    /*
    var emailArray = inputText.match(emailRegex);
    if(emailArray !== null){
      var finalEmail = emailArray[0];
    }
    */
    var phoneArray = phoneRegex.exec(inputText);
    var finalPhone = phoneArray[0];

    if(finalEmail == null){
     finalEmail = "Not Found";
    }
    if(finalPhone == null){
      finalPhone = "Not Found"
    }

     return {email: finalEmail, phone: finalPhone};
  }
}
