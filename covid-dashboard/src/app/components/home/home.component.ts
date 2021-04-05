import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { GlobalDataSummary } from 'src/app/models/golbalData';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globatData: GlobalDataSummary[];
  pieChart: GoogleChartInterface = {
    chartType: 'PieChart',
  };
  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart',
  };

  constructor(public service: DataServiceService) {}

  ngOnInit(): void {
    this.service.getGlobalData().subscribe((res) => {
      console.log(res);

      this.globatData = res;
      res.forEach((cs) => {
        if (!Number.isNaN(cs.confirmed)) {
          this.totalActive += cs.active;
          this.totalConfirmed += cs.confirmed;
          this.totalDeaths += cs.deaths;
          this.totalRecovered += cs.recovered;
        }
      });

      this.initChart();
    });
  }

  initChart() {
    let dataTableCases = [];
    let dataTableDeaths = [];

    dataTableCases.push(['Country', 'Cases']);
    this.globatData
      .sort(function (a, b) {
        return b.confirmed - a.confirmed;
      })
      .forEach((d, index) => {
        if (index <= 10) {
          dataTableCases.push([d.country, d.confirmed]);
        }
      });

    dataTableDeaths.push(['Country', 'Deaths']);
    this.globatData
      .sort(function (a, b) {
        return b.deaths - a.deaths;
      })
      .forEach((d, index) => {
        if (index <= 10) {
          dataTableDeaths.push([d.country, d.deaths]);
        }
      });

    this.pieChart = {
      chartType: 'PieChart',
      dataTable: dataTableCases,
      //firstRowIsData: true,
      options: {
        height: 400,
        title: 'Most relevant cases',
        chartArea: { width: '100%' },
      },
    };

    console.log("load data " + dataTableDeaths.length);

    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: dataTableDeaths,
      //firstRowIsData: true,
      options: {
        height: 400,
        title: 'Most relevant deaths',
        chartArea: { width: '100%' },
      },
    };
  }
}
