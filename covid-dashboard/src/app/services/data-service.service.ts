import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators'
import { DatePipe } from '@angular/common';
import { GlobalDataSummary } from '../models/golbalData';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  dayStat: string;

  constructor(private http: HttpClient, public datepipe: DatePipe) {
    this.dayStat = datepipe.transform(new Date(new Date().getTime() - (1000 * 60 * 60 * 24)), 'MM-dd-yyyy');
   }

  getGlobalData() {
    return this.http.get(environment.globalDataUrl + this.dayStat + '.csv', { responseType: 'text' }).pipe(
      map((result) => {
        let data: GlobalDataSummary[] = [];
        let dataMerged = {};

        let rows = result.split('\n')
        rows = rows.splice(1);
        rows.forEach(r => {
          let cols = r.split(/,(?=\S)/);

          let cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10]
          };

          let temp = dataMerged[cs.country];
          if (temp) {
            temp.active = cs.active + temp.active;
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;

            dataMerged[cs.country] = temp;
          } else {
            dataMerged[cs.country] = cs;
          }
        });

        return <GlobalDataSummary[]> Object.values(dataMerged);
      })
    )
  }
}
