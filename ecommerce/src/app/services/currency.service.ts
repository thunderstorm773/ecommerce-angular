import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { SystemParameterService } from './system-parameter.service';
import { SystemParameter } from '../common/system-parameter';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  showBothBgnEurCurrencies: string = 'SHOW_BOTH_BGN_EUR_CURRENCIES';
  showBgnCurrencyFirst: string = 'SHOW_BGN_CURRENCY_FIRST';
  bgnCurrencyName: string = 'лв.';
  bgnCurrencyCode: string = 'BGN';
  eurCurrencyCode: string = 'EUR';

  showBothBgnEurCurrenciesParam: SystemParameter | null = null;
  showBgnCurrencyFirstParam: SystemParameter | null = null;

  constructor(private currencyPipe: CurrencyPipe,
              private systemParameterService: SystemParameterService) { 

    this.initializeSystemParams();      
  }

  formatPriceString(priceBgn: number, priceEur: number): string {
    let priceCurrency: string = '';

    priceBgn = this.formatNumber(priceBgn);
    priceEur = this.formatNumber(priceEur);

    // If parameters exists
    if (this.showBothBgnEurCurrenciesParam && this.showBgnCurrencyFirstParam) {
      
      if (this.showBothBgnEurCurrenciesParam.value === '1') {

        if (this.showBgnCurrencyFirstParam.value === '1') {
          priceCurrency = priceBgn.toFixed(2) + ' ' + this.bgnCurrencyName + ' / ' 
                          + this.currencyPipe.transform(priceEur.toFixed(2), this.eurCurrencyCode);
        } else {
          priceCurrency = this.currencyPipe.transform(priceEur.toFixed(2), this.eurCurrencyCode) 
                          + ' / ' + priceBgn.toFixed(2) + ' ' + this.bgnCurrencyName;
        }
      } else {

        if (this.showBgnCurrencyFirstParam.value === '1') {
          priceCurrency = priceBgn.toFixed(2) + ' ' + this.bgnCurrencyName;
        } else {
          priceCurrency = this.currencyPipe.transform(priceEur.toFixed(2), this.eurCurrencyCode) + '';
        }
      }
    } else {
      // Default price currency format
      priceCurrency = priceBgn + ' ' + this.bgnCurrencyName;
    }

    return priceCurrency;
  }

  formatCartStatusPrice(priceBgn: number, priceEur: number): string {
    let priceCurrency: string = '';

    priceBgn = this.formatNumber(priceBgn);
    priceEur = this.formatNumber(priceEur);

    // If parameters exists
    if (this.showBgnCurrencyFirstParam) {
      
      if (this.showBgnCurrencyFirstParam.value === '1') {
          priceCurrency = priceBgn.toFixed(2) + ' ' + this.bgnCurrencyName;
        } else {
          priceCurrency = this.currencyPipe.transform(priceEur.toFixed(2), this.eurCurrencyCode) + '';
        }
    } else {
      // Default price currency format
      priceCurrency = priceBgn + ' ' + this.bgnCurrencyName;
    }

    return priceCurrency;
  }

  formatNumber(num: number): number {
    return Math.round(num * 100) / 100;
  }

  getMainCurrencyCode(): string {
    // If parameters exists
    if (this.showBgnCurrencyFirstParam) {
      
      if (this.showBgnCurrencyFirstParam.value === '1') {
          return this.bgnCurrencyCode;
        } else {
          return this.eurCurrencyCode;
        }
    }

    return this.bgnCurrencyCode;
  }

  initializeSystemParams() {
    this.systemParameterService.getSystemParameterByCode(this.showBothBgnEurCurrencies).subscribe(
      data => this.showBothBgnEurCurrenciesParam = data
    );

    this.systemParameterService.getSystemParameterByCode(this.showBgnCurrencyFirst).subscribe(
      data => this.showBgnCurrencyFirstParam = data
    );
  }
}
