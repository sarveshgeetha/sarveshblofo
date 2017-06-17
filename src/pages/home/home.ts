import { Component , ViewChild } from '@angular/core';
import { Select } from 'ionic-angular';
import { NavController, LoadingController } from 'ionic-angular';
import {HttpProvider} from '../../providers/http/http';
import { CurrencyName } from './currencyName';
import { TempPrice } from './tempPrice';
import { RemoveSpaces } from './remove-spaces';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[HttpProvider]
})

export class HomePage {

  defaultColor:any = true;
  coinsMarketData: any = [];
  tempData: any = [];
  coinsMarketDataToUse: any = [];
  loading: any;
  currencyData: any;
  currency: any = "INR";
  currencyOffset: any = 1;
  currencySymbol: any = "₹";
  currencyName: CurrencyName[] = [];
  tempPrice: TempPrice[] = [];
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
        return ((item.long.toLowerCase().indexOf(val.toLowerCase()) > -1) || (item.short.toLowerCase().indexOf(val.toLowerCase()) > -1) );
      })
    }
  }


priceCheck(){
        for (var i = 0 ; i < this.coinsMarketData.length ; i++ ) {
            if(this.coinsMarketDataToUse[i].price < this.coinsMarketData[i].price )
            {
              this.defaultColor = false;
              this.coinsMarketData[i].red=true;
              this.coinsMarketData[i].green=false;
            }
            else if(this.coinsMarketDataToUse[i].price > this.coinsMarketData[i].price )
            {
              this.defaultColor = false;
              this.coinsMarketData[i].red=false;
              this.coinsMarketData[i].green=true;
            }
            else if (this.coinsMarketData[i].red == false && this.coinsMarketData[i].green==false )
            {
              this.defaultColor = true;
            }
        }
}


coinsDataLoop() {
   this.httpProvider.getJsonData().subscribe(
      result => {
      this.coinsMarketData=result;
        if(this.coinsMarketDataToUse.length > 0)
        {
          console.log("Price Check Logic!");
          this.priceCheck();
        }
        this.coinsMarketDataToUse = this.coinsMarketData;
        console.log("Success coinsDataLoop!" +this.coinsMarketDataToUse.length );
      },
      err =>{
        console.error("Error : "+err);
      } ,
      () => {

      });
}



coinRefresh(refresher){
     this.httpProvider.getJsonData().subscribe(
      result => {
        this.coinsMarketData=result;
        if(this.coinsMarketDataToUse.length > 0)
        {
          console.log("Price Check Logic!");
          this.priceCheck();
        }
        this.coinsMarketDataToUse = this.coinsMarketData;
        console.log("Success Refreshing!" +this.coinsMarketDataToUse.length );
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
        console.log("Success currencyData "+this.currencyData.length);
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
        //this.tempData = this.coinsMarketData;
        console.log("Success initial loading "+this.coinsMarketData.length);
      },
      err =>{
        console.error("Error : "+err);
      } ,
      () => {
        this.loading.dismiss();
        let timeoutId = setInterval(() => { 
          this.coinsDataLoop ();
          console.log('CoinsDataLoop Called');
        }, 3000);
        console.log('getData completed');
      }
    );
  }









}
