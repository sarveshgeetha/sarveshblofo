import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the HttpProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class HttpProvider {

  constructor(public http: Http) {
    console.log('Hello HttpProvider Provider');
  }

  getJsonData(){
    return this.http.get('https://api.coinmarketcap.com/v1/ticker/?convert=INR').map(res => res.json());
  }

  getCurrencyData(){
    return this.http.get('http://coincap.io/exchange_rates').map(res => res.json());
  }

}
