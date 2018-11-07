import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';



/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

const userData = {
  "manufacturer": {
      "password": "manufacturer"
  },
  "dealer":{
      "password" : "dealer"    
  },
  "supplier":
  {
      "password" : "supplier"
  }

}


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  credentials = {}

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  openSignup() {
    console.log(this.credentials);
    localStorage.setItem("credentials", JSON.stringify(this.credentials));
    this.navCtrl.push(TabsPage);
  }

}
