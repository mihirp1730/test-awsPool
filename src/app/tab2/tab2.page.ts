import { Component, OnInit } from '@angular/core';
import * as AWSCognito from "amazon-cognito-identity-js";
import { UserServiceService } from '../services/user-service.service';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  userName: string;
  password: string;
  phoneNumber: any;
  registerData: any;
  message: string;
  loading: any;
  email: any;


  constructor(
    public UserService: UserServiceService,
    public router: Router,
    public alertController: AlertController
  ) {

  }
  ngOnInit() {
  }

  //register User with Cognito
  register() {

    console.log(this.userName, this.password, this.email);
    this.UserService.signUp(this.userName, this.password, this.email, this.phoneNumber).then(
      res => {
        this.registerData = res;
        //Storing Data to LocalStorage.
        localStorage.setItem('cognitoId', this.registerData.userSub);
        localStorage.setItem('userName', this.registerData.user.username);
        //Navigate the page
        // this.router.navigate(['/tab1']);
        this.presentConfirmCode();
      },
      err => {
        if (err.code === "UsernameExistsException") {
          this.message = err.message;
        } else if (err.code === "InvalidPasswordException") {
          this.message = err.message;
        } else if (err.code === "InvalidParameterException") {
          this.message = err.message;
        }
      });
  }

  async presentConfirmCode() {
    // if (this.selectedStaff.isPhoneVerified) {
    //   // this.process.presentToast('Number already Verified!!!');
    //   return;
    // }
    // this.process.dismissLoading();
    const alert = await this.alertController.create({
      header: 'Enter your OTP!!!',
      inputs: [
        {
          name: 'otp',
          type: 'number',
          placeholder: 'Enter OTP'
        }
      ],
      backdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: (data) => {
            if (data.otp == "") {
              // this.process.presentToast('Please Enter valid OTP!!!');
              return false;
            }
            // this.process.presentLoading('Verifying...', '');
            console.log('Confirm Ok', data);
            this.UserService.confirmUser(data.otp, this.userName).then(res => {
              console.log('otp confirm : ', res);
              // this.process.dismissLoading();
              // this.mobileConfirmation();
            }, (error) => {
              console.log('staff-create-page: presentConfirmCode: Ok : error : ', error);
              // this.process.dismissLoading();
              if (error.code == 'NotAuthorizedException') {
                // this.process.presentToast(error.message);
                console.log('Error: NotAuthorizedException');
              } else if (error.code == 'InvalidParameterException') {
                // this.process.presentToast(error.message);
                console.log('Error: InvalidParameterException');
              } else if (error.code == 'CodeMismatchException') {
                // this.process.presentToast(error.message);
                console.log('Error: CodeMismatchException');
              } else {
                // this.process.presentToast('Something went wrong!');
              }
            });
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (data) => {
            console.log('Confirm Cancel', data);
            // this.process.presentToast('User Number Not verified!!!');
            // this.location.back();
          }
        }, {
          text: 'Resend OTP',
          handler: (data) => {

            let primaryAttributeName: any;
            // let secondaryAttributeName: any;
            // if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.userName)) {
            //   primaryAttributeName = 'email';
            // } else {
            //   primaryAttributeName = 'phone_number';
            // }
            // this.process.presentLoading('Sending OTP...', '');
            console.log('Confirm Ok', data);
            this.UserService.resendOTP(primaryAttributeName).then(res => {
              console.log('otp confirm : ', res);
              // this.process.dismissLoading();
            }, (error) => {
              console.log('staff-create-page: presentConfirmCode: Resend OTP : error : ', error);
              // this.process.dismissLoading();
              if (error.code == 'LimitExceededException') {
                // this.process.presentToast(error.message);
                console.log('LimitExceededException');
              } else if (error.code == 'NotAuthorizedException') {
                // this.process.presentToast(error.message);
                console.log('NotAuthorizedException');
              } else {
                // this.process.presentToast('Something went wrong!');
              }
            });
            return false;
          }
        }
      ]
    });
    await alert.present();
  }
}
