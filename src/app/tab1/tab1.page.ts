import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoadingController, ToastController, Events, AlertController } from '@ionic/angular';
import { UserServiceService } from '../services/user-service.service';
// import { UserServiceService } from '../../user-service.service';
// import { ApiService } from '../../services/api.service';
// import { ProcessService } from '../../services/process.service'
// import { CartService } from '../../order/cart.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  signinForm: any;
  submitAttempt: boolean = false;
  errorMessage: string;
  loading: any;
  message: string;
  loginData: any;
  dataFromLoginSync: any;
  userSub: any;
  userEmail: any;
  locationId: any;
  username: any;
  password: any;

  constructor(
    public router: Router,
    public formBuilder: FormBuilder,
    public UserService: UserServiceService,
    public loadingCtrl: LoadingController,
    public alertController: AlertController,
    // private toastCtrl: ToastController,
    // private route: ActivatedRoute,
    public event: Events,
  ) { }

  ngOnInit() {
    // form Validation
    // this.signinForm = this.formBuilder.group({
    //   // username: ['', Validators.compose([Validators.email, Validators.required])],
    //   password: ['', Validators.compose([Validators.minLength(8), Validators.required])]
    // });
  }

  //SignIn function for sigin user with cognito.
  signin() {
    console.log(this.username);
    this.UserService.authenticate(this.username, this.password)
      // this.UserService.authenticate(this.signinForm.controls.username.value, this.signinForm.controls.password.value)
      // this.UserService.authenticate(this.username, this.password)
      .then(res => {
        this.loginData = res;
        console.log(res);
        localStorage.setItem('login Data', JSON.stringify(this.loginData));

        //Storing Data to LocalStorage.
        localStorage.setItem('jwtToken', this.loginData.idToken.jwtToken);
        localStorage.setItem('refreshToken', this.loginData.refreshToken.token);
        localStorage.setItem('userEmail', this.loginData.idToken.payload.email);
        localStorage.setItem('cognitoId', this.loginData.idToken.payload.sub);
        this.getUser();
        this.userSub = this.loginData.idToken.payload.sub; //userSub(CognitoId).
        this.userEmail = this.loginData.idToken.payload.email;  // user email.

      }, err => {
        if (err.code === "UserNotFoundException") {
          console.log('1', err);
          this.message = err.message;
        } else if (err.code === "NotAuthorizedException") {
          console.log('2', err);
          this.message = err.message;
        } else if (err.code === "UserNotConfirmedException") {
          console.log('3', err);
          this.message = err.message;
        }
      });
  }
  getUser() {

    this.UserService.getUserInfoFromCognito()
      // this.UserService.authenticate(this.signinForm.controls.username.value, this.signinForm.controls.password.value)
      // this.UserService.authenticate(this.username, this.password)
      .then(res => {
        let abc: any = res;
        console.log(res);
        console.log(abc);

        if (abc) {
          abc.UserAttributes.forEach(userAttr => {
            console.log(userAttr);
            let unVerifiedAttribute: any;
            if (userAttr.Value === 'false') {
              console.log(userAttr.Name);
              if (userAttr.Name === 'email_verified') {
                unVerifiedAttribute = 'email';
              } else if (userAttr.Name === 'phone_number_verified') {
                unVerifiedAttribute = 'phone_number';
              }
              console.log(unVerifiedAttribute);
              this.confirmAttribute(unVerifiedAttribute);
            }
          });
        }
      }, err => {
        console.log('1', err);
      });
  }

  confirmAttribute(unVerifiedAttribute) {
    this.UserService.resendOTP(unVerifiedAttribute).then(res => {
      console.log('otp confirm : ', res);
      this.presentConfirmCode(unVerifiedAttribute);
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
  }

  async presentConfirmCode(unVerifiedAttribute) {
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
            this.UserService.userConfirmation(data.otp, unVerifiedAttribute).then(res => {
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
            // this.process.presentLoading('Sending OTP...', '');
            console.log('Confirm Ok', data);
            this.UserService.resendOTP(unVerifiedAttribute).then(res => {
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
