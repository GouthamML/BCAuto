import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { AlertController } from 'ionic-angular';

import 'rxjs/add/operator/map'

import { HttpClient } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http';
import { stringify } from '@angular/core/src/util';
import { InfoPage } from '../info/info';

const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'Basic Y2xvdWQuYWRtaW46cHVycGxlQDhGYXZPcg==',
    'Content-Type' : 'application/json'    

  })
};

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  jsonOfBarcode: any;
  headersData:any;
  jsonBody:any;
  url: any;
  details: any;
  test:any;
  output: any;
  code:any;


  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private barcodeScanner: BarcodeScanner,
    private toast: Toast, private httpclient:HttpClient) {
    //  this.callFunc();
  }

  openAlertSuccess() {
    let alert = this.alertCtrl.create({
      title: 'Part Exists',
      message: 'Do you want to know more abou it?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Buy clicked');
            this.navCtrl.push(InfoPage);
            
          }
        }
      ]
    });
    alert.present();
  }

  openAlertFailure() {
    let alert = this.alertCtrl.create({
      title: 'Part Doesn\'t Exists',
      message: 'Do you want to add it to OBC?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Buy clicked');
            this.navCtrl.push(InfoPage);
            
          }
        }
      ]
    });
    alert.present();

  }


   scan() {
     let i;
      this.barcodeScanner.scan().then((barcodedata) => {
      this.jsonOfBarcode = JSON.parse(barcodedata.text);
      
      let url = "https://2E42370EAFB342A99759C7B7378C46D0.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/invocation";
      console.log('###############################');
      /*
      
      formatting the JSON payload

      */
     let jsonBody = {
       'channel' : 'default',
       'chaincode' : 'chain',
       'args' : []
     }; 

      if (this.jsonOfBarcode.chassisNumber == null){
        jsonBody["method"] = "readVehiclePart";
      }
      else{
        jsonBody["method"] = "initVehiclePart";
      }
      for(let i in this.jsonOfBarcode) {
        jsonBody.args.push(this.jsonOfBarcode[i]);
      } 
      jsonBody["chaincodeVer"] = "v1";
      console.log(jsonBody);
      this.test = this.jsonOfBarcode;
      
      this.httpclient.post(url,jsonBody,httpOptions)
      .subscribe(response => {
        localStorage.setItem('res', JSON.stringify(response));
        if( response['returnCode'] == "Success" ){
          this.openAlertSuccess();
        }
        else{
          this.openAlertFailure();
        }
        
      });
    })
    localStorage.setItem('body', JSON.stringify(this.jsonBody));
    localStorage.setItem('barCode', JSON.stringify(this.jsonOfBarcode)); 
  
  }

 

  httpClientPostMethod() {
    let url = "https://2E42370EAFB342A99759C7B7378C46D0.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/invocation";

    let jsonbody = {
      
      "channel":"default",
      "chaincode":"chain",
      "method":"readVehiclePart",
      "args":["ser123"],
      "chaincodeVer":"v1"
    }

    this.httpclient.post(url,jsonbody,httpOptions)
    .subscribe(response => {
      console.log(response);
      if( response['returnCode'] == "Success" ){
        this.openAlertSuccess();
      }
      else{
        this.openAlertFailure();
      }
      localStorage.setItem('res', JSON.stringify(response));
    });
    this.code = localStorage.getItem('res');
    console.log(this.code);

  }

  
}
