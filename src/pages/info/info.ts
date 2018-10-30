import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LIFECYCLE_HOOKS_VALUES } from '@angular/compiler/src/lifecycle_reflector';

/**
 * Generated class for the InfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {

  test:any;
  response:any;
  Keys:any;
  Values:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.response = JSON.parse(localStorage.getItem('res'));
    this.response = JSON.parse(this.response['result']['payload']);
    console.log(this.response);
    this.test = JSON.stringify(this.response);
    let i;
    this.Keys = Object.keys(this.response);    
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPage');
  }

}
