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

  
  coinsMarketData: any = [];
  coinsMarketDataToUse: any = [];
  loading: any;
  currencyData: any;
  currency: any = "INR";
  currencyOffset: any = 1;
  currencySymbol: any = "₹";
  currencyName: CurrencyName[] = [];
  searchQuery: string = '';

  @ViewChild('currencySelect') currencySelect: Select;

  constructor(public navCtrl: NavController, private httpProvider:HttpProvider,public loadingCtrl: LoadingController) {

    this.loading = this.loadingCtrl.create({
      content: `
      <ion-spinner ></ion-spinner>`
    });

    this.getCurrencyData();
     this.initializeItems();
  }

initializeItems() {
    this.coinsMarketDataToUse = this.coinsMarketData;
}


  searchCoins(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.coinsMarketDataToUse = this.coinsMarketDataToUse.filter((item) => {
        return ((item.name.toLowerCase().indexOf(val.toLowerCase()) > -1) || (item.symbol.toLowerCase().indexOf(val.toLowerCase()) > -1) );
      })
    }
  }

coinRefresh(refresher){
     this.httpProvider.getJsonData().subscribe(
      result => {
        this.coinsMarketData=result;
        this.coinsMarketDataToUse = this.coinsMarketData;
        console.log("Success : "+this.coinsMarketData);
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
        this.coinsMarketData=result;
        this.coinsMarketDataToUse = this.coinsMarketData;
        console.log("Success : "+this.coinsMarketData);
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
