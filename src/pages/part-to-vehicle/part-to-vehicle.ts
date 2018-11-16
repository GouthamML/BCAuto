import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HttpClient } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http';
import { AlertController } from 'ionic-angular';
import { ListpartsPage } from '../listparts/listparts';



/**
 * Generated class for the PartToVehiclePage page.
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
  selector: 'page-part-to-vehicle',
  templateUrl: 'part-to-vehicle.html',
})
export class PartToVehiclePage {

  barcodePart:any;
  barcodeVehicle: any;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, private httpclient: HttpClient, public navParams: NavParams,  private barcodeScanner: BarcodeScanner) {
  }

  transferPartToVehicle(){
    let url = "https://2E42370EAFB342A99759C7B7378C46D0.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/invocation";

    let jsonBody = {
      'channel' : 'default',
      'chaincode' : 'chain4',
      'args' : [],
      "chaincodeVer":"v1"
    }; 
    this.barcodeScanner.scan().then((barcodedata) => {
      this.barcodePart = JSON.parse(barcodedata.text);
    
    if(this.barcodePart["chassisNumber"]==null){
      jsonBody["method"] = "readVehiclePart";
      jsonBody.args.push(this.barcodePart["SerialNumber"]);
    }
    else{
      jsonBody["method"] = "readVehicle";
      jsonBody.args.push(this.barcodePart["chassisNumber"]);
    }
    console.log("json body for Reading\n" + JSON.stringify(jsonBody));
    this.httpclient.post(url, jsonBody, httpOptions)
    .subscribe(response => {
      if( response['returnCode'] != "Success"){
        let alert = this.alertCtrl.create({
          title: 'Does not exist',
          subTitle: 'Please add the part to the blockchain',
          buttons: ['Done']
        });
        alert.present();

      }
      

      else{
        let alert = this.alertCtrl.create({
          title: 'Successful',
          subTitle: 'Part has been scanned successfully',
          buttons: [
            {
            text: 'Scan vehicle',
            handler: () => {
              // Adding parts to vehicle
this.barcodeScanner.scan().then((barcodedata) => {
  this.barcodeVehicle = JSON.parse(barcodedata.text);
  console.log("from scanned\n" + barcodedata.text);
  console.log("from variable\n" + this.barcodeVehicle);

  jsonBody.args = [];
  jsonBody["method"] = "transferPartToVehicle";
  jsonBody.args.push(this.barcodePart["SerialNumber"]);
  jsonBody.args.push(this.barcodeVehicle["chassisNumber"]);

  console.log("serial number\n" + this.barcodePart["SerialNumber"]);
  console.log("chassis number\n" + this.barcodeVehicle["chassisNumber"]);


  console.log("json body for adding\n" + JSON.stringify(jsonBody));

  this.httpclient.post(url, jsonBody, httpOptions)
  .subscribe( response => {
    if (response['returnCode'] == "Success"){
      let alert = this.alertCtrl.create({
        title: 'Part Added',
        subTitle: 'Part number ' + this.barcodePart["SerialNumber"] + ' has been succesfully added to ' + this.barcodeVehicle["chassisNumber"],
        buttons: ['Done']
      });
      alert.present();
    }
    else{
      console.log("error\n")
    }
  });
})



            }
          
        }
      ]
        });
        alert.present();
        
      }
    })
  })
  }

  listParts(){
    this.navCtrl.push(ListpartsPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PartToVehiclePage');
  }

}
