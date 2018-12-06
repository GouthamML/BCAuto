import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { HttpClient } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http';

/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'Basic Y2xvdWQuYWRtaW46c2lja2xZQDhIb09WRXI=',
    'Content-Type' : 'application/json'    

  })
};
@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {
  code:any;
  response:any;
  test:any;
  Keys:any;
  Values:any;
  jsonOfBarcode:any;
  bdata:any;
  resmap:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private httpclient:HttpClient, private alertCtrl: AlertController) {
    let url = "https://F4586B0D8CC042C891B307CC61F2750C.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/invocation";
    console.log('###############################');
    /*
    
    formatting the JSON payload
    */
   this.bdata= localStorage.getItem('barCode')
   this.jsonOfBarcode=JSON.parse(this.bdata);
   console.log(this.jsonOfBarcode);
   let jsonBody = {
     'channel' : 'default',
     'chaincode' : 'car1',
     'args' : []
   }; 

    if (this.jsonOfBarcode.SerialNumber == null){
      jsonBody["method"] = "getHistoryForRecord";
    }
    else{
      jsonBody["method"] = "getHistoryForRecord";
    }
    for(let i in this.jsonOfBarcode) {
      jsonBody.args.push(this.jsonOfBarcode[i]);
    } 
    jsonBody["chaincodeVer"] = "v1";
    console.log(jsonBody);
    this.test = this.jsonOfBarcode;
    
    this.httpclient.post(url,jsonBody,httpOptions)
    .subscribe(response => {
      localStorage.setItem('reshistory', JSON.stringify(response));
      if( response['returnCode'] == "Success" ){
        this.openAlertSuccess();
      }
      else{
        this.openAlertFailure();
      }
      
    });
  
  // localStorage.setItem('body', JSON.stringify(this.jsonBody));
  // localStorage.setItem('barCode', JSON.stringify(this.jsonOfBarcode)); 
  }

  openAlertSuccess(){
    this.response = JSON.parse(localStorage.getItem('reshistory'));
    this.response = JSON.parse(this.response['result']['payload']);
    this.resmap = this.response.map(element => {
      return {
          chassisNumber:element.Value.chassisNumber,
          serialNumber:element.Value.serialNumber,
          manufacturer:element.Value.manufacturer,
          model:element.Value.model,
          name:element.Value.name,
          assemblyDate:element.Value.assemblyDate,
          owner:element.Value.owner,
          assembler:element.Value.assembler,   
          Timestamp: element.Timestamp
      };
    }).reverse();
    // this.test = JSON.stringify(this.response);
    // console.log("This is response after parsing" +this.test);
    // let i;
    // this.Keys = Object.keys(this.response); 
    // console.log("This is barcode data" + this.Keys); 
  }
  openAlertFailure(){
    let alert = this.alertCtrl.create({
      title: 'No Information',
      message: '',
      buttons: [
                {
          text: 'OK',
          handler: () => {
            console.log('Buy clicked');
            
          }
        }
      ]
    });
    alert.present();
  }
  

  

 
 
 
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
  }

}
