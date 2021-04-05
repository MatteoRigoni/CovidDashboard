import { Component, OnInit } from '@angular/core';
import { GlobalDataSummary } from 'src/app/models/golbalData';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  data: GlobalDataSummary[];
  countries: string[] = [];

  totalConfirmed= 0;
  totalActive= 0;
  totalDeaths= 0;
  totalRecovered= 0;

  constructor(private service: DataServiceService) { }

  ngOnInit(): void {
    this.service.getGlobalData().subscribe(res => {
      this.data = res;
      this.data.forEach(cs => {
        this.countries.push(cs.country);
      });
    });
  }

  updateValues(country: string) {
    if (country == 'empty') {
      this.totalActive = 0;
      this.totalConfirmed = 0;
      this.totalDeaths = 0;
      this.totalRecovered = 0;
    }

    let statsCountry = this.data.filter(obj => {
      return obj.country === country
    });

    this.totalActive = statsCountry[0].active;
    this.totalConfirmed = statsCountry[0].confirmed;
    this.totalDeaths = statsCountry[0].deaths;
    this.totalRecovered = statsCountry[0].recovered;
  }

}
