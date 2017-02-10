import {Component, Input} from '@angular/core';
import {DomSanitizationService, SafeStyle} from '@angular/platform-browser';
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";

import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {CircleImageData} from "../../components/images/image-data";
import {CircleImage} from "../../components/images/circle-image";
import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from "../../global/global-functions";
import {NoDataBox} from '../../components/error/data-box/data-box.component';
import {BarChartComponent} from '../../components/bar-chart/bar-chart.component';
import {DailyUpdateData, DailyUpdateChart} from "../../services/daily-update.service";
import {SanitizeHtml} from "../../pipes/safe.pipe";
import {PossessivePipe} from "../../pipes/possessive.pipe";

declare var jQuery:any;

@Component({
    selector: 'daily-update-module',
    templateUrl: './app/modules/daily-update/daily-update.module.html',
    directives: [ModuleHeader, CircleImage, NoDataBox, BarChartComponent, ROUTER_DIRECTIVES],
    pipes: [SanitizeHtml, PossessivePipe]
})

export class DailyUpdateModule {
  @Input() profileName: string = "[Profile Name]";

  @Input() data: DailyUpdateData;

  @Input() seasonBase: any;

  public seasonId: any;

  public chartOptions: any;

  public backgroundImage: SafeStyle;

  public noDataMessage: string = 'Sorry, there is no daily update available for [Profile Name]';

  public headerInfo: ModuleHeaderData = {
    moduleTitle: "Daily Update - [Profile Name]",
    hasIcon: false,
    iconClass: "",
  };

  public comparisonCount: number;

  public imageConfig: CircleImageData;

  constructor(private _sanitizer: DomSanitizationService){
    this.imageConfig = {
      imageClass: "image-121",
      mainImage: {
        imageClass: "border-2",
        imageUrl: GlobalSettings.getSiteLogoUrl(),
        placeholderImageUrl: GlobalSettings.getSiteLogoUrl()
      }
    };
  }

  ngOnChanges(event) {
    this.headerInfo.moduleTitle = "Daily Update - " + this.profileName;
    var seasonId;
    if(this.seasonBase == null || typeof this.seasonBase == 'undefined'){
      seasonId = new Date().getFullYear();
    } else {
      switch(this.seasonBase['curr_season']){
        case 0:
          seasonId = Number(this.seasonBase['season_id']) - 1;
          break;
        case 1:
          seasonId = 'Current';
          break;
        case 2:
          seasonId = this.seasonBase['season_id'];
          break;
      }
    }
    this.seasonId = seasonId;
    this.noDataMessage = "Sorry, there is no daily update available for " + this.profileName;
    if ( this.data ) {
      this.drawChart();
      this.backgroundImage = this._sanitizer.bypassSecurityTrustStyle("url(" + this.data.fullBackgroundImageUrl + ")");
      // this.data.postGameArticle.pubDate = GlobalFunctions.formatGlobalDate(this.data.postGameArticle.pubDate,'timeZone');
    }

    if ( this.data && this.data.chart && this.data.chart.dataSeries && this.data.chart.dataSeries.length > 0) {
      var series = this.data.chart.dataSeries[0];
      this.comparisonCount = series.values ? series.values.length : 0;
    }
    else {
      this.comparisonCount = 0;
    }
    if(event.data['currentValue'] != null && event.data['currentValue'].postGameArticle != null && event.data['currentValue'].postGameArticle.img != null){
      var img = event.data['currentValue'].postGameArticle.img;
      this.imageConfig.mainImage.imageUrl = img != null ? img : GlobalSettings.getImageUrl(null);
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
            data: item.values,
            dataLabels: {
              style: {
                color: '#272727'
              }
            }
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
        tickWidth: 0,
        labels: {
          style: {
            color: "#999999",
            fontSize: "12px"
          }
        },
      },
      yAxis: {
        min: yAxisMin,
        max: null,
        tickInterval: 2,
        opposite: true,
        title: {
          text: null
        },
        labels: {
          style: {
            color: "#999999"
          }
        },
        gridLineColor: "rgba(225, 225, 225, 0.5)"
      },
      plotOptions: {
        column: {
          pointPadding: 0,
          borderWidth: 0,
          groupPadding: .09,
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
