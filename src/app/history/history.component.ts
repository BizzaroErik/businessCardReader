import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  searchHistory: any[];
  constructor(private dashboardService: DashboardService) {
    this.searchHistory = []
    this.setSearchHistory();
   }

   setSearchHistory(){
     this.dashboardService.getHistory().subscribe( (historyList: any) => {
        console.log(historyList);
        Object.keys(historyList).forEach( (priorSearch: any) => {
          let obj = historyList[priorSearch];
          this.searchHistory.push(obj);
        })
     });
   }


  ngOnInit() {
  }

}
