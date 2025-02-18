import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class NomenclatureFormService {

  private countriesURL: string = 'http://localhost:8080/api/countries';
  private statesURL: string = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let months: number[] = [];

    for(let currentMonth = startMonth; currentMonth <= 12; currentMonth++) {
      months.push(currentMonth);
    }

    return of(months);
  }

  getCreditCardYears(): Observable<number[]> {
    let years: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear = startYear + 10;

    for (let currentYear = startYear; currentYear <= endYear; currentYear++) {
      years.push(currentYear);
    }

    return of(years);
  }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(this.countriesURL);
  }

  getStates(countryCode: string): Observable<State[]> {
    const searchStatesURL = `${this.statesURL}/country/${countryCode}`;
    return this.httpClient.get<State[]>(searchStatesURL);
  }
}
