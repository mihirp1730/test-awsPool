import { Component } from '@angular/core';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  userTestData: any;
  constructor(
    public apiService: ApiServiceService
    ) {
    
    // this.cartTotal();

    // this.locId = localStorage.getItem('locationId');
  }
  ionViewWillEnter() {
    this.getTest();
    this.getTest1();
  }
  getTest() {
  this.apiService.getTestData().subscribe((result) => {
    this.userTestData = result; // result;
    console.log(result);
  });
  }
  getTest1() {
    this.apiService.getAuthData().subscribe((result) => {
      this.userTestData = result; // result;
      console.log(result);
    });
    }
}
