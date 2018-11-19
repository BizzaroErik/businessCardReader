import { Component, OnInit, Input } from '@angular/core';
import { DashboardService } from './dashboard.service';
import {HttpClient} from '@angular/common/http';
import { vision } from 'src/environments/environment';
import {WebcamImage} from 'ngx-webcam';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import { NgForm } from '@angular/forms';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  singlePictureHolder: any;
  
 
  webcamImage: WebcamImage = null;
  webcamURL: any;
  
  showWebcam: boolean;
  shouldShowCard: boolean;
  pictureTaken:boolean;
  notFound:boolean;
  showInputForm:boolean;
  showSearch:boolean;

  showWhichCardAdded:boolean;
  
  
  displayCards: any[];
  relatedCards: any[];
  searchResultCard: any;
  cardBeingAdded:any;
  constructor(private dashboardService: DashboardService, private http:HttpClient) {
    this.showSearch = false;
    this.showInputForm = false;
    this.showWhichCardAdded = false;
    this.pictureTaken = false;
    this.showWebcam = false;
    this.shouldShowCard = false;
    this.notFound = false;

    this.displayCards = [];
    this.relatedCards = [];


    this.cardBeingAdded = {fname: "not found", lname: "not found", email: "not found", phone: "not found", card64: "not found", extra: "not found"};

    dashboardService.searchCards().subscribe((reference:any) => {
      Object.keys(reference).forEach( (element:any) => {
        let obj = reference[element];
        this.displayCards.push(obj);
      });
    });
  }


  textDetection(){
    this.showWebcam = false;
    this.shouldShowCard = false;
    this.notFound = false;
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
      var digestOfWordsArray = textAnnotations;


      var emailPhoneBase64 = this.dashboardService.parseText(digestOfWordsArray);
      var fNameLName = this.dashboardService.parseNames(digestOfWordsArray, emailPhoneBase64.email);

      
      
      this.cardBeingAdded["fname"]=fNameLName.fname;
      this.cardBeingAdded["lname"] = fNameLName.lname;
      this.cardBeingAdded["phone"]=emailPhoneBase64.phone;
      this.cardBeingAdded["email"] = emailPhoneBase64.email;
      this.cardBeingAdded["card64"]= this.webcamImage.imageAsBase64.toString();
      this.cardBeingAdded["extra"] = digestOfWordsArray[0].description;
      console.log(this.cardBeingAdded)

      

      this.checkInfo(this.cardBeingAdded);
      /*
      this.dashboardService.addCardToDB(emailPhoneBase64);
      this.dashboardService.addHistory("user added a business card");*/
    });
  }

  checkInfo(emailPhoneBase64) {
    this.showInputForm = true;
  }

  submitInfo(f: NgForm){
    this.showInputForm = false;
    this.pictureTaken = false;
    this.cardBeingAdded.fname = f.value.fname;
    this.cardBeingAdded.lname = f.value.lname;
    this.cardBeingAdded.email = f.value.email;
    this.cardBeingAdded.phone= f.value.phone;
    console.log("final card being added" + this.cardBeingAdded);
    this.dashboardService.addCardToDB(this.cardBeingAdded);
    this.dashboardService.addHistory("user added a business card");
    this.showWhichCardAdded = true;

  }


  searchDisplayCards(input: HTMLInputElement){
    console.log(input.value);
    this.relatedCards;
    var found = false;
    var search = input.value;
    for ( var x in this.displayCards){
      let y = this.displayCards[x];
      console.log(y.fname);
      if(y.email === search || y.fname===search || y.lname === search || y.phone ===search){
        this.relatedCards.push(this.displayCards[x]);
        console.log("Found the cards");
        found = true;
        this.shouldShowCard = true;
        continue;
      }
    }
    if(this.relatedCards.length < 1){
      this.shouldShowCard = false;
      this.notFound = true;
    }
  }


  private trigger: Subject<void> = new Subject<void>();
  public handleImage(webcamImage: WebcamImage): void {
    console.log('received webcam image', webcamImage);
    this.toggleWebcam();
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
      this.showWebcam = !this.showWebcam;
  }
  toggleSearch(){
    this.showSearch = !this.showSearch;
  }

  ngOnInit() {}
}