import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HttpClient, HttpParams } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';


/**
 * Generated class for the ListpartsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'Basic Y2xvdWQuYWRtaW46cHVycGxlQDhGYXZPcg==',
    'Content-Type' : 'application/json'    

  })
};

@Component({
  selector: 'page-listparts',
  templateUrl: 'listparts.html',
})
export class ListpartsPage {
  barcodeVehicle:any;
  parts = {};
  keys:any;
  public partNumber = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodescanner: BarcodeScanner, private httpclient: HttpClient, private alertController: AlertController, public loadingCtrl: LoadingController) {
    let url = "https://2E42370EAFB342A99759C7B7378C46D0.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/invocation";

    let jsonBody = {
      'channel' : 'default',
      'chaincode' : 'chain4',
      'method' : 'getHistoryForRecord',
      'args' : [],
      "chaincodeVer":"v1"
    }; 


    barcodescanner.scan().then( (barcodedata) => {
      this.barcodeVehicle = JSON.parse(barcodedata.text);
      
    
      jsonBody.args.push(this.barcodeVehicle["chassisNumber"]);
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
    
      loading.present();
    
      

      httpclient.post(url, jsonBody,httpOptions)
      .subscribe( response => {
        loading.dismiss();
        if(response["returnCode"] == "Success"){
           let temp = JSON.parse(response["result"]["payload"]);
           console.log("temp\n" + temp);
           let i=1;
           for(i=1; i< temp.length; i++){
             this.parts[temp[i]['Timestamp']] = temp[i]['Value']['serialNumber'];
           }
           console.log("This is parts\n" + JSON.stringify(this.parts));
           this.keys = Object.keys(this.parts);
           console.log("This is keys\n" + JSON.stringify(this.keys));
        }
        else{
          let alert = alertController.create({
            title: 'Error',
            subTitle: '10% of battery remaining',
            buttons: ['Dismiss']  
          });
          alert.present();
        }
      })


    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListpartsPage');
  }

}
