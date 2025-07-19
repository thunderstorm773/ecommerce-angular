import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { SystemParameterService } from './system-parameter.service';
import { SystemParameter } from '../common/system-parameter';
import { firstValueFrom, forkJoin, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  showBothBgnEurCurrencies: string = 'SHOW_BOTH_BGN_EUR_CURRENCIES';
  showBgnCurrencyFirst: string = 'SHOW_BGN_CURRENCY_FIRST';
  bgnEurExchangeRate: string = 'BGN_EUR_EXCHANGE_RATE';
  bgnCurrencyName: string = 'лв.';
  bgnCurrencyCode: string = 'BGN';
  eurCurrencyCode: string = 'EUR';

  showBothBgnEurCurrenciesParam: SystemParameter | null = null;
  showBgnCurrencyFirstParam: SystemParameter | null = null;
  bgnEurExchangeRateParam: SystemParameter | null = null;

  constructor(private currencyPipe: CurrencyPipe,
              private systemParameterService: SystemParameterService) {}

  initSystemParams(): Promise<void> {
    return firstValueFrom(
      forkJoin({
        showBothBgnEurCurrencies: this.systemParameterService.getSystemParameterByCode(this.showBothBgnEurCurrencies),
        showBgnCurrencyFirst: this.systemParameterService.getSystemParameterByCode(this.showBgnCurrencyFirst),
        bgnEurExchangeRate: this.systemParameterService.getSystemParameterByCode(this.bgnEurExchangeRate)
      })
    ).then((params) => {
      this.showBothBgnEurCurrenciesParam = params.showBothBgnEurCurrencies;
      this.showBgnCurrencyFirstParam = params.showBgnCurrencyFirst;
      this.bgnEurExchangeRateParam = params.bgnEurExchangeRate;
    });
  }

  formatPriceString(priceBgn: number, priceEur: number): string {
    let priceCurrency: string = '';

    priceBgn = this.formatNumber(priceBgn);
    priceEur = this.formatNumber(priceEur);

    // If parameters exists
    if (this.showBothBgnEurCurrenciesParam && this.showBgnCurrencyFirstParam) {
      
      if (this.showBothBgnEurCurrenciesParam.value === '1') {

        if (this.showBgnCurrencyFirstParam.value === '1') {
          priceCurrency = priceBgn.toFixed(2) + ' ' + this.bgnCurrencyName + ' (' 
                          + this.currencyPipe.transform(priceEur.toFixed(2), this.eurCurrencyCode) 
                          + ')';
        } else {
          priceCurrency = this.currencyPipe.transform(priceEur.toFixed(2), this.eurCurrencyCode) 
                          + ' (' + priceBgn.toFixed(2) + ' ' + this.bgnCurrencyName
                          + ')';
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

  formatNumber(num: number): number {
    return Math.round(num * 100) / 100;
  }
}
