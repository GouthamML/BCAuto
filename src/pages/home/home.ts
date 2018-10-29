import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { AlertController } from 'ionic-angular';

import 'rxjs/add/operator/map'

import { HttpClient } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http';
import { stringify } from '@angular/core/src/util';

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
  jsonBodyData: any;
  headersData:any;
  url: any;
  details: any;
  output: any;
  code:any;


  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private barcodeScanner: BarcodeScanner,
    private toast: Toast, private httpclient:HttpClient) {
    //  this.callFunc();
  }

   scan() {
    this.barcodeScanner.scan().then((barcodedata) => {
      console.log(barcodedata.text);
      this.jsonBodyData = barcodedata.text;
      // this.jsonBodyData = {}
      let url = "https://2E42370EAFB342A99759C7B7378C46D0.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/invocation";
      let jsonbody = {
      
        "channel":"default",
        "chaincode":"chain",
        "method":"readVehiclePart",
        "args":["ser123","honda","12062012","mirror","honda","hyderabad"],
        "chaincodeVer":"v1"
      }
  
      this.httpclient.post(url,this.jsonBodyData,httpOptions)
      .subscribe(response => {
        console.log(response);
        console.log(response);
        localStorage.setItem('res', response['returnCode']);
      });
    })
    this.code = localStorage.getItem('res');
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
      localStorage.setItem('res', response['returnCode']);
    });
    this.code = localStorage.getItem('res');
    console.log(this.code);

  }

  
}
