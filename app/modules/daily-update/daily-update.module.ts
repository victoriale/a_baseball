import {Component, Input} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {CircleImageData} from "../../components/images/image-data";
import {CircleImage} from "../../components/images/circle-image";
import {GlobalSettings} from "../../global/global-settings";
import {LoadingComponent} from '../../components/loading/loading.component';
import {NoDataBox} from '../../components/error/data-box/data-box.component';
import {BarChartComponent} from '../../components/bar-chart/bar-chart.component';
import {DailyUpdateData, DailyUpdateChart} from "../../services/daily-update.service";

declare var jQuery:any;

@Component({
    selector: 'daily-update-module',
    templateUrl: './app/modules/daily-update/daily-update.module.html',
    directives: [ModuleHeader, CircleImage, LoadingComponent, NoDataBox, BarChartComponent],
    providers: []
})

export class DailyUpdateModule {
  @Input() profileName: string = "[Profile Name]";

  @Input() data: DailyUpdateData;

  public chartOptions: any;
  
  public backgroundImage: string;

  public noDataMessage: string = 'Sorry, there is no daily update available for [Profile Name]';

  public headerInfo: ModuleHeaderData = {
    moduleTitle: "Daily Update - [Profile Name]",
    hasIcon: true,
    iconClass: null
  };

  public comparisonCount: number;

  public imageConfig: CircleImageData;

  constructor(){
    this.imageConfig = {
      imageClass: "image-121",
      mainImage: {
        imageClass: "border-2",
        imageUrl: GlobalSettings.getSiteLogoUrl(),
        placeholderImageUrl: GlobalSettings.getSiteLogoUrl()
      }
    };
  }

  ngOnChanges() {
    this.headerInfo.moduleTitle = "Daily Update - " + this.profileName;
    this.noDataMessage = "Sorry, there is no daily update available for " + this.profileName;

    if ( this.data ) {
      this.drawChart();
      this.backgroundImage = this.data.fullBackgroundImageUrl;
    }

    if ( this.data && this.data.chart && this.data.chart.dataSeries && this.data.chart.dataSeries.length > 0) {
      var series = this.data.chart.dataSeries[0];
      this.comparisonCount = series.values ? series.values.length : 0;
    }
    else {
      this.comparisonCount = 0;
    }
  }

  drawChart(){
    var yAxisMin = 0;
    var categories = [];
    var series = [];

    if ( this.data && this.data.chart ) {
      var chart = this.data.chart;
      categories = chart.categories;
      if ( chart.dataSeries ) {
        series = chart.dataSeries.map(item => {
          return {
            pointWidth: 30,
            name: item.name,
            data: item.values
          };
        });
      }
    }

    this.chartOptions = {
      chart: {
        type: 'column',
        height: 144,
        marginTop: 10,
        spacingTop: 0,
        spacingBottom: 0,
        style: {
          fontFamily: '\'Lato\', sans-serif'
        }
      },
      title: {
        text: ''
      },
      legend: {
        enabled: false
      },
      xAxis: {
        categories: categories,
        tickWidth: 0
      },
      yAxis: {
        min: yAxisMin,
        max: null,
        tickInterval: 2,
        opposite: true,
        title: {
          text: null
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0,
          borderWidth: 0,
          groupPadding: 0.16,
          minPointLength: 3,
          dataLabels: {
            enabled: true,
            inside: false,
            allowOverlap: true,
            crop: false,
            overflow: 'none',
            backgroundColor: undefined,
            y: 0
          },
          enableMouseTracking: false
        }
      },
      colors: [
        '#272727',
        '#bc2027'
      ],
      series: series,
      credits: {
        enabled: false
      }
    };
  };
}

