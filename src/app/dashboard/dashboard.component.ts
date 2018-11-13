import { Component, OnInit, Input } from '@angular/core';
import { DashboardService } from './dashboard.service';
import {HttpClient} from '@angular/common/http';
import { vision } from 'src/environments/environment';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  holderArray: any[];
  foundImage: any;
  pictureTaken:boolean;
  webcamImage: WebcamImage = null;
  webcamURL: any;
  showWebcam: boolean;
  searches: any[];
  missingFirst: boolean;
  wordsArray: any[];
  displayCards: any[];
  shouldShow: boolean;
  notFound:boolean;
  searchResultCard: any;
  constructor(private dashboardService: DashboardService, private http:HttpClient) {
    this.holderArray = [];
    this.pictureTaken = false;
    this.showWebcam = false;
    this.shouldShow = false;
    this.notFound = false;
    this.searches = [];
    this.missingFirst = false;
    this.wordsArray = [];
    this.displayCards = [];

    dashboardService.searchCards().subscribe((reference:any) => {
      Object.keys(reference).forEach( (element:any) => {
        let obj = reference[element];
        this.displayCards.push(obj);
      });
    });
  }


  textDetection(){
    this.shouldShow = false;
    this.notFound = false;
    console.log(this.webcamImage.imageAsBase64.toString)
    const request: any = {
      'requests': [
        {
          'image': {
            "content": this.webcamImage.imageAsBase64
          },
          'features': [
            {
              'type': 'TEXT_DETECTION',
              'maxResults': 1,
            }
          ]
        }
      ]
    };
    
    const url = `https://vision.googleapis.com/v1/images:annotate?key=${vision.visionKey}`;
    this.http.post(url,request).subscribe( (results: any) => {
      console.log('RESULTS RESULTS RESULTS');
      console.log(results);
      var responses = results['responses'];
      var text = responses[0];
      var textAnnotations = text['textAnnotations'];
      console.log(textAnnotations);
      this.wordsArray = textAnnotations;
      var emailPhoneBase64 = this.parseText(this.wordsArray);
      
      emailPhoneBase64["card64"] = this.webcamImage.imageAsBase64;
      this.holderArray = this.wordsArray;

      var fNameLName = this.parseNames(this.wordsArray, emailPhoneBase64.email);

      emailPhoneBase64["fname"] = fNameLName.fname;
      emailPhoneBase64["lname"] = fNameLName.lname;
      emailPhoneBase64["extra"] = this.wordsArray[0].description;
      
      console.log(emailPhoneBase64);
      this.dashboardService.addCardToDB(emailPhoneBase64);

    });
    
    this.dashboardService.addHistory("user added a business card");
  }

  parseNames(textArray: any[], email: string){
    var fname;
    var lname;
    console.log("this is the email");
    console.log(email);
    if(email !== null){

      var x = 1;
      for(x; x<textArray.length; x++){

        let desired = textArray[x].description;
        
        var element = desired.replace(/[^\w\s]/gi, '');
        if(email.includes(element.toLowerCase())){
          if(email === element) continue;
          lname = element;
          let priorElement = textArray[x-1].description;
          console.log(element);
          fname=priorElement;
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
    
    var email;
    var i = 1;
    for(i; i<textArray.length; i++){
      if(textArray[i].description.includes("@")) email = textArray[i].description;
    }

    /*
    var emailArray = inputText.match(emailRegex);
    if(emailArray !== null){
      var finalEmail = emailArray[0];
    }
    */
    var phoneArray = phoneRegex.exec(inputText);
    console.log(phoneArray);
    var finalPhone = phoneArray[0];

    console.log(email);
    console.log(finalPhone);

    if(email == null){
     email = "Not Found";
    }
    if(finalPhone == null){
      finalPhone = "Not Found"
    }

     return {email: email, phone: finalPhone};
    
    //this.dashboardService.addCardToDB(output)


  }



  searchDisplayCards(input: HTMLInputElement){
    var found = false;
    var search = input.value
    for ( var x in this.displayCards){
      let y = this.displayCards[x];
      if(y.email === search || y.fname===search || y.lname === search || y.phone ===search){
        console.log("Found the cards");
        found = true;
        this.searchResultCard = this.displayCards[x];
        console.log(this.searchResultCard);
        this.shouldShow = true;
        var image = new Image();
        image.src = this.searchResultCard.card64;
        this.foundImage = image;
        break;
      }
    }
    if(!found){
      this.shouldShow = false;
      this.notFound = true;
    }

  }
  private trigger: Subject<void> = new Subject<void>();
  public handleImage(webcamImage: WebcamImage): void {
    console.log('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    this.webcamURL = webcamImage.imageAsBase64;
    this.pictureTaken = true;
  }
  public triggerSnapShot(): void {
    this.trigger.next();
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  toggleWebcam(){
    if(this.showWebcam === false){
      this.showWebcam = !this.showWebcam;
    }
  }



  ngOnInit() {

  }

}
