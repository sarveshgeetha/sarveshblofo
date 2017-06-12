import { Component , ViewChild } from '@angular/core';
import { Select } from 'ionic-angular';
import { NavController, LoadingController } from 'ionic-angular';
import {HttpProvider} from '../../providers/http/http';
import { CurrencyName } from './currencyName';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[HttpProvider]
})

export class HomePage {

  
  newsData: any;
  loading: any;
  currencyData: any;
  currency: any = "INR";
  currencyOffset: any = 1;
  currencySymbol: any = "₹";
  currencyName: CurrencyName[] = [];

  @ViewChild('currencySelect') currencySelect: Select;

  constructor(public navCtrl: NavController, private httpProvider:HttpProvider,public loadingCtrl: LoadingController) {

    this.loading = this.loadingCtrl.create({
      content: `
      <ion-spinner ></ion-spinner>`
    });

    this.getCurrencyData();
  }

coinRefresh(refresher){
    
     this.httpProvider.getJsonData().subscribe(
      result => {
        this.newsData=result;
        console.log("Success : "+this.newsData);
      },
      err =>{
        console.error("Error : "+err);
      } ,
      () => {
        if(refresher != 0)
        {
         refresher.complete();
        }
        console.log('getData completed');
      }
    );
};

openModal(){
  this.currencySelect.open();
}

changeCurrencyOffset(event,currency){
  if(currency == "USD")
  {
    this.currencySymbol = "$";
    this.currencyOffset = 1;
  }
  else{
    this.currencySymbol = this.currencyData.symbols[currency];
    this.currencyOffset = this.currencyData.rates[currency];
  }

  console.log("Currency Symbol : "+this.currencySymbol);
  console.log("Currency Offset : "+this.currencyOffset);
}

getCurrencyData(){
    this.httpProvider.getCurrencyData().subscribe(
      result => {
        this.currencyData=result;
        var value;
          for (value in this.currencyData.rates) {
            this.currencyName.push(
                  new CurrencyName(value)
                );
            }
            this.currencyName.push(
                  new CurrencyName("USD")
                );
        this.currencySymbol = this.currencyData.symbols[this.currency];
        this.currencyOffset = this.currencyData.rates[this.currency];
        console.log("Success : "+this.currencyData);
      },
      err =>{
        console.error("Error : "+err);
      } ,
      () => {
        this.getdata();
        console.log('getCurrencyData completed');
      }
    );
}
  getdata(){
    this.loading.present();
    this.httpProvider.getJsonData().subscribe(
      result => {
        this.newsData=result;
        console.log("Success : "+this.newsData);
      },
      err =>{
        console.error("Error : "+err);
      } ,
      () => {
        this.loading.dismiss();
        console.log('getData completed');
      }
    );
  }









}
