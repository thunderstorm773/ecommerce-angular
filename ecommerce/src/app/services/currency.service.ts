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
  eurCurrencyCode: string = 'EUR';

  showBothBgnEurCurrenciesParam: SystemParameter | null = null;
  showBgnCurrencyFirstParam: SystemParameter | null = null;

  constructor(private currencyPipe: CurrencyPipe,
              private systemParameterService: SystemParameterService) { 

    this.initalizeSystemParameters();      
  }

  formatPriceCurrency(priceBgn: number, priceEur: number): string {
    let priceCurrency: string = '';

    // If parameters exists
    if (this.showBothBgnEurCurrenciesParam && this.showBgnCurrencyFirstParam) {
      
      if (this.showBothBgnEurCurrenciesParam.value === '1') {

        if (this.showBgnCurrencyFirstParam.value === '1') {
          priceCurrency = priceBgn + ' ' + this.bgnCurrencyName + ' / ' + this.currencyPipe.transform(priceEur, this.eurCurrencyCode);
        } else {
          priceCurrency = this.currencyPipe.transform(priceEur, this.eurCurrencyCode) + ' / ' + priceBgn + ' ' + this.bgnCurrencyName;
        }
      } else {

        if (this.showBgnCurrencyFirstParam.value === '1') {
          priceCurrency = priceBgn + ' ' + this.bgnCurrencyName;
        } else {
          priceCurrency = this.currencyPipe.transform(priceEur, this.eurCurrencyCode) + '';
        }
      }
    } else {
      // Default price currency format
      priceCurrency = priceBgn + ' ' + this.bgnCurrencyName;
    }

    return priceCurrency;
  }

  initalizeSystemParameters() {
    this.systemParameterService.getSystemParameterByCode(this.showBothBgnEurCurrencies).subscribe(
      data => this.showBothBgnEurCurrenciesParam = data
    );

    this.systemParameterService.getSystemParameterByCode(this.showBgnCurrencyFirst).subscribe(
      data => this.showBgnCurrencyFirstParam = data
    );
  }
}
