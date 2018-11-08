import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LIFECYCLE_HOOKS_VALUES } from '@angular/compiler/src/lifecycle_reflector';
import { TransferTemplatePage } from '../transfer-template/transfer-template';
import { AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'Basic Y2xvdWQuYWRtaW46cHVycGxlQDhGYXZPcg==',
    'Content-Type' : 'application/json'    

  })
};

const url = "https://2E42370EAFB342A99759C7B7378C46D0.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/invocation";

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
  jsonbody:any;
  argsTemp:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,  private httpclient:HttpClient) {
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
  transfer(){
    this.jsonbody = JSON.parse(localStorage.getItem('body'));
    this.argsTemp = this.jsonbody.args;
    if ( this.jsonbody.chassisNumber == null){
    this.jsonbody.method = "transferVehiclePart"
    }
    else {
      this.jsonbody.method = "transferVehicle"
    }
    this.jsonbody.args.push(this.response["owner"]);
    let alert = this.alertCtrl.create({
      title: 'Transfer',
      inputs: [
        {
          name: 'ownername',
          placeholder: 'Enter New Owner Name'
        },
        
      ],
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'TRANSFER',
          handler: data => {
            this.jsonbody.args.push(data.ownername);
            console.log("This is BODY for transfer" + JSON.stringify(this.jsonbody));
            //making post request for transfer vehicle /part
            this.httpclient.post(url, this.jsonbody, httpOptions)
            .subscribe(postResponse => {
              if( postResponse['returnCode'] == "Success"){
                let alert = this.alertCtrl.create({
                  title: 'Transfered Successfully',
                  subTitle: 'Ownership has been changed from'+this.response["owner"]+' to' + data.ownername,
                  buttons: ['Dismiss']
                });
                alert.present();
              }
            })
            
          }
        }
      ]
    });
    alert.present();
  }

}
