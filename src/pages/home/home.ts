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

  
  coinsMarketData: any;
  loading: any;
  currencyData: any;
  currency: any = "INR";
  currencyOffset: any = 1;
  currencySymbol: any = "₹";
  currencyName: CurrencyName[] = [];

  sampleData : any = [
    {title: 'Reggae', id: 1},
    {title: 'Chill', id: 2},
    {title: 'Dubstep', id: 3},
    {title: 'Indie', id: 4},
    {title: 'Rap', id: 5},
    {title: 'Cowbell', id: 6},
    {title: 'Reggae2', id: 7},
    {title: 'Chill2', id: 8},
    {title: 'Dubstep2', id: 9},
    {title: 'Indie2', id: 10},
    {title: 'Rap2', id: 11},
    {title: 'Cowbell2', id: 12},
    {title: 'Reggae3', id: 13},
    {title: 'Chill3', id: 14},
    {title: 'Dubstep3', id: 15},
    {title: 'Indie3', id: 16},
    {title: 'Rap3', id: 17},
    {title: 'Cowbell3', id: 18}
  ];

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
        this.coinsMarketData=result;
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
