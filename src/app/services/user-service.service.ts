import { Injectable } from '@angular/core';
import * as AWSCognito from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk";

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  userName: any;
  // TODO move fixed UserPoolId and ClientId values to environment.ts files

  _POOL_DATA = {
    //End-User login
    // UserPoolId: "us-east-1_uEtrsH7te", // username 
    // ClientId: "5jvvh59h1c5f7072iudkn30mgi"
    UserPoolId: "us-east-1_zfmxBLyFt",
    ClientId: "47pn2k9livkmbgqdmft3e04lj3"

    //staff login
    // UserPoolId: "us-east-1_ggEGi0Jk3",
    // ClientId: "49un1ni4391l8u1jkiums1h0ia"
  };
  // private readonly jwtTokenName = 'jwt_token';

  // private authUser = new ReplaySubject<any>(1);
  // public authUserObservable = this.authUser.asObservable();
  // _POOL_DATA: any;

  constructor() {
    // this._POOL_DATA = environment._POOL_DATA;
    console.log(this._POOL_DATA);
  }
  authenticate(username, password) {
    this.userName = username;
    return new Promise((resolved, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);

      const authDetails = new AWSCognito.AuthenticationDetails({
        Username: username,
        Password: password
      });

      const cognitoUser = new AWSCognito.CognitoUser({
        Username: username,
        Pool: userPool
      });

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: result => {
          console.log("login auth success", result);
          resolved(result);
        },
        onFailure: err => {
          console.log("login auth failure", err);
          reject(err);
        },
        newPasswordRequired: userAttributes => {
          // User was signed up by an admin and must provide new
          // password and required attributes, if any, to complete
          // authentication.

          // the api doesn't accept this field back
          userAttributes.username = username;
          delete userAttributes.email_verified;

          cognitoUser.completeNewPasswordChallenge(password, userAttributes, {
            onSuccess: function (result) {
              console.log("new password success", result);
              resolved(result);
            },
            onFailure: function (error) {
              console.log("new password failure", error);
              reject(error);
            }
          });
        }
      });
    });
  }
  async RegisterConfirmation(code, username) {
    const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);
    // var cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(userData);
    var userData = {
      Username: username,
      Pool: userPool
    };
    var cognitoUser = new AWSCognito.CognitoUser(userData);
    // When user has the Verification code, it is passed to Cognito in order to confirm the registration:

    cognitoUser.confirmRegistration(code, true, function (err, result) {
      if (err) {
        console.log(err);
        return;
      }

      console.log('call result: ' + result);
    });
  }

  //SignUp Fuction with cognito.
  signUp(username, password, Email, phoneNumber) {
    console.log(username, password, Email, phoneNumber);
    // let primaryAttributeName: any;
    // let secondaryAttributeName: any;
    // if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(username)) {
    //   primaryAttributeName = 'email';
    //   secondaryAttributeName = 'phone_number';
    // } else {
    //   primaryAttributeName = 'phone_number';
    //   secondaryAttributeName = 'email';
    //   console.log(false);
    // }
    return new Promise((resolved, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);

      let userAttribute = [];

      let userData = {
        Name: 'name',
        Value: username
      };
      // let userData = {
      //   Name: 'username',
      //   Value: username
      // }
      let UserEmail = {
        Name: 'email',
        Value: Email
      };
      let UserPhone = {
        Name: 'phone_number',
        Value: phoneNumber
      };
      let userCollectedData = new AWSCognito.CognitoUserAttribute(userData)
      let useremail = new AWSCognito.CognitoUserAttribute(UserEmail);
      let userphone = new AWSCognito.CognitoUserAttribute(UserPhone);
      // let locationId = new AWSCognito.CognitoUserAttribute(locationid);
      userAttribute.push(userCollectedData);
      userAttribute.push(useremail);
      userAttribute.push(userphone);
      // userAttribute.push(locationId);

      userPool.signUp(username, password, userAttribute, null, function (err, result) {
        if (err) {
          console.log("userpool failure", err);
          reject(err);
        } else {
          console.log("userpool success", result);
          resolved(result);
        }
      });
    });
  }

  //Forgot password flow.
  // forgotPassword(email) {
  //   return new Promise((resolved, reject) => {
  //     const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);
  //     const cognitoUser = new AWSCognito.CognitoUser({
  //       Username: email,
  //       Pool: userPool
  //     });
  //     cognitoUser.forgotPassword({
  //       onSuccess: function (result) {
  //         console.log('call result: ' + JSON.stringify(result));
  //       },
  //       onFailure: function (err) {
  //         alert(err);
  //       },
  //       inputVerificationCode() {
  //         var verificationCode = prompt('Please input verification code ', '');
  //         var newPassword = prompt('Enter new password ', '');
  //         cognitoUser.confirmPassword(verificationCode, newPassword, this);
  //       }
  //     });
  //   });
  // }

  //Forgot password flow.
  forgotPassword(email) {
    return new Promise((resolved, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);
      const cognitoUser = new AWSCognito.CognitoUser({
        Username: email,
        Pool: userPool
      });
      console.log(cognitoUser);
      cognitoUser.forgotPassword({
        onSuccess: function (result) {
          console.log('call result: ', result);
          resolved(result);
        },
        onFailure: function (err) {
          // alert(err);
          console.log('call result: OnFailure : ', err);
          reject(err);
        },
        // inputVerificationCode() {
        //   var verificationCode = prompt('Please input verification code ', '');
        //   var newPassword = prompt('Enter new password ', '');
        //   cognitoUser.confirmPassword(verificationCode, newPassword, this);
        // }
      });
    });
  }

  //Reset password flow.
  resetPassword(email, code, newPassword) {
    console.log('data: ', email, code, newPassword);
    return new Promise((resolved, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);
      const cognitoUser = new AWSCognito.CognitoUser({
        Username: email,
        Pool: userPool
      });
      cognitoUser.confirmPassword(code, newPassword, {
        onSuccess: () => {
          console.log('call result: ');
          resolved();
        },
        onFailure: (err) => {
          // alert(err);
          console.log('call result: OnFailure : ', err);
          reject(err);
        }
      });
    });
  }

  // confirmation function with Cognito.
  confirmUser(verificationCode, userName) {
    return new Promise((resolved, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);

      const cognitoUser = new AWSCognito.CognitoUser({
        Username: userName,
        Pool: userPool
      });

      cognitoUser.confirmRegistration(verificationCode, true, function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolved(result);
        }
      });
    });
  }
  // staff Mobile number OTP - RESEND
  async resendOTP(unVerifiedAttribute) {
    console.log("Resend OTP");
    let cognitoId = localStorage.getItem('cognitoId');
    let userName = localStorage.getItem('userName');
    // let getAccessName = 'CognitoIdentityServiceProvider.' + this._POOL_DATA.ClientId + '.' + cognitoId + '.accessToken';
    let getAccessName = 'CognitoIdentityServiceProvider.' + this._POOL_DATA.ClientId + '.' + userName + '.accessToken';
    console.log('consol ACEES NAME : ', getAccessName);
    let accessToken = localStorage.getItem(getAccessName);
    return new Promise((resolved, reject) => {
      var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' });
      var params = {
        AccessToken: accessToken,
        AttributeName: unVerifiedAttribute
      };
      cognitoidentityserviceprovider.getUserAttributeVerificationCode(params, function (err, data) {
        if (err) {
          console.log(err, err.stack);
          reject(err);
        } else {
          console.log(data);
          resolved(data);
        }
      });
    });
  }

  getUserInfoFromCognito() {
    let cognitoId = localStorage.getItem('cognitoId');
    let userName = localStorage.getItem('userName');
    // let getAccessName = 'CognitoIdentityServiceProvider.' + this._POOL_DATA.ClientId + '.' + cognitoId + '.accessToken';
    let getAccessName = 'CognitoIdentityServiceProvider.' + this._POOL_DATA.ClientId + '.' + userName + '.accessToken';
    console.log('consol ACEES NAME : ', getAccessName);
    let accessToken = localStorage.getItem(getAccessName);
    return new Promise((resolved, reject) => {
      var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' });
      var params = {
        AccessToken: accessToken /* required */
      };
      cognitoidentityserviceprovider.getUser(params, function (err, data) {
        if (err) {
          console.log(err, err.stack);
          reject(err);
        } // an error occurred
        else {
          console.log(data);
          resolved(data);
        }          // successful response
      });
    });
  }

  // staff Mobile number OTP confirmation
  async userConfirmation(otp, attributeName) {
    console.log("otp confirmation");
    let userName = localStorage.getItem('userName');
    let cognitoId = localStorage.getItem('cognitoId');
    let getAccessName = 'CognitoIdentityServiceProvider.' + this._POOL_DATA.ClientId + '.' + userName + '.accessToken';
    console.log('consol ACEES NAME : ', getAccessName);
    let accessToken = localStorage.getItem(getAccessName);
    return new Promise((resolved, reject) => {
      var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' });
      var params = {
        AccessToken: accessToken,
        AttributeName: attributeName,
        Code: otp
      };
      cognitoidentityserviceprovider.verifyUserAttribute(params, function (err, data) {
        if (err) {
          console.log(err, err.stack);
          reject(err);
        } else {
          console.log(data);
          resolved(true);
        }
      });
    });
  }
}
