import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import 'rxjs/add/operator/map'

import { HttpClient } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http';
import { stringify } from '@angular/core/src/util';
import { InfoPage } from '../info/info';

const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'Basic Y2xvdWQuYWRtaW46c2lja2xZQDhIb09WRXI=',
    'Content-Type' : 'application/json'    

  })
};

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  credentials = {}
  jsonOfBarcode: any;
  headersData:any;
  jsonBody:any;
  url: any;
  details: any;
  test:any;
  output: any;
  code:any;
  locationOfDevice:any;


  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private barcodeScanner: BarcodeScanner,
    private toast: Toast, private httpclient:HttpClient, public loadingCtrl: LoadingController, private geolocation: Geolocation) {
    //  this.callFunc();
  }
  /*
  adding to blockchain
  */
 openAlertAddOBC(){
  let loading = this.loadingCtrl.create({
    content: 'Adding to Blockchain...'
  });

  loading.present();
  let url = "https://F4586B0D8CC042C891B307CC61F2750C.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/invocation";
  let barcode = JSON.parse(localStorage.getItem('barCode'));
  
  let body = JSON.parse(localStorage.getItem('body'));
  console.log("barcode###########\n" + JSON.stringify(barcode) );
  
  if(barcode["chassisNumber"] == null){
    body["method"] = "initVehiclePart";

  }
  else{
    body["method"] = "initVehicle";
}
  console.log("barcode type" + Object.keys(barcode));

  for(let i=0; i < Object.keys(barcode).length; i++){
    console.log("barcode data in loop\n" + barcode[Object.keys(barcode)[i]]);
    body["args"][i] = barcode[Object.keys(barcode)[i]];
  }
  body["args"].push(this.locationOfDevice);
  console.log("argss\n" + body["args"]);

  console.log("JSONbody for adding to blockchain#####\n" + JSON.stringify(body));


  this.httpclient.post(url, body, httpOptions)
  .subscribe(response => {
    loading.dismiss();
    console.log("response for adding blockchain###\n" +  JSON.stringify(response));
    if(response['returnCode'] == "Success"){
      let alert = this.alertCtrl.create({
        title: 'Added Successfully',
        subTitle: 'Scanned assets have been added to the Oracle block Chain',
        buttons: ['Done']
      });
      alert.present();
    }
    else{
      let alert = this.alertCtrl.create({
        title: 'Couldn\'t Add',
        subTitle: 'Please try again',
        buttons: ['Done']
      });
      alert.present();

    }
  })

}

  openAlertSuccess() {
    let alert = this.alertCtrl.create({
      title: 'Already Exists',
      message: 'Do you want to know more about it?',
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
      title: 'Asset Doesn\'t Exists',
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

            this.openAlertAddOBC();
            /*
            Opening loading screen!!
             */
              let loading = this.loadingCtrl.create({
                content: 'Please wait...'
              });
            
              loading.present();
            
              setTimeout(() => {
                loading.dismiss();
              }, 5000);

            
            
          }
        }
      ]
    });
    alert.present();

  }
scan() {
     let i;
     this.credentials = JSON.parse(localStorage.getItem('credentials'));
      this.barcodeScanner.scan().then((barcodedata) => {
      this.jsonOfBarcode = JSON.parse(barcodedata.text);

      //getting location from device
      this.geolocation.getCurrentPosition().then((resp) => {
        this.httpclient.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + resp.coords.latitude + ',' + resp.coords.longitude + '&sensor=true&key=AIzaSyCFxSOEO_F6DlWrNlxfj3tDTcS_3BqZF_c')
        .subscribe(data => {
          console.log(data);
          this.locationOfDevice = data["results"][4]["address_components"][1]["long_name"];
          
          console.log("location#########\n"+this.locationOfDevice);
        })
        
       }).catch((error) => {
         console.log('Error getting location', error);
       });

       

      //Adding loder after scanning QR code
      let loading = this.loadingCtrl.create({
        content: 'Fetching information....'
      });
    
      loading.present();
    
      
      //
      
      let url = "https://F4586B0D8CC042C891B307CC61F2750C.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/invocation";
      console.log('###############################');
      /*
      
      formatting the JSON payload

      */
     let jsonBody = {
       'channel' : 'default',
       'chaincode' : 'car1',
       'args' : []
     }; 

     

      if (this.jsonOfBarcode.chassisNumber == null){
        jsonBody["method"] = "readVehiclePart";
        jsonBody.args.push(this.jsonOfBarcode.SerialNumber);
      }
      else{
        jsonBody["method"] = "readVehicle";
        jsonBody.args.push(this.jsonOfBarcode.chassisNumber);
      }
      
      
      // for(let i in this.jsonOfBarcode) {
      //   jsonBody.args.push(this.jsonOfBarcode[i]);
      // } 
      jsonBody["chaincodeVer"] = "v1";
      console.log("This is jsonbody" + JSON.stringify(jsonBody));
      console.log("This is barcode data" + JSON.stringify(this.jsonOfBarcode));
      this.test = this.jsonOfBarcode;

      /*
      POST API call
       */
      
      this.httpclient.post(url,jsonBody,httpOptions)
      .subscribe(response => {
        loading.dismiss();
        localStorage.setItem('res', JSON.stringify(response));
        localStorage.setItem('body', JSON.stringify(jsonBody));
        console.log("Credentials \n"+this.credentials["username"]);
        localStorage.setItem('barCode', JSON.stringify(this.jsonOfBarcode));  //response is from blockcahin
        if( response['returnCode'] == "Success" ){
          console.log("response for success" + response);
          this.openAlertSuccess();
        }
        else{
          if( (this.jsonOfBarcode.chassisNumber!=null && this.credentials["username"]=="manufacturer") || (this.jsonOfBarcode.SerialNumber!=null && this.credentials["username"]=="supplier") ){
          this.openAlertFailure();
          }
          else{
            let alert = this.alertCtrl.create({
              title: 'Access Denied!',
              subTitle: 'You can not perform this operation',
              buttons: ['Done']
            });
            alert.present();
          }
        }
        
      });
    })
    
  
}

 

  httpClientPostMethod() {
    let url = "https://F4586B0D8CC042C891B307CC61F2750C.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/invocation";

    let jsonbody = {
      
      "channel":"default",
      "chaincode":"car1",
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
