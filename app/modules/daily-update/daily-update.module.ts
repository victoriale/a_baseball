import {Component, Input} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {CircleImageData} from "../../components/images/image-data";
import {CircleImage} from "../../components/images/circle-image";
import {GlobalSettings} from "../../global/global-settings";

declare var jQuery:any;

@Component({
    selector: 'daily-update-module',
    templateUrl: './app/modules/daily-update/daily-update.module.html',
    directives: [ModuleHeader, CircleImage],
    providers: []
})

export class DailyUpdateModule{
    public displayData: Object;
    public backgroundImage: string;
    
    @Input() dailyUpdateDataArray: Array<Object>;
    @Input() profileName: string;
    public headerInfo: ModuleHeaderData = {
      moduleTitle: "Daily Update - [Profile Name]",
      hasIcon: true,
      iconClass: null
    };

    sampleImage = "./app/public/no-image.png";

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

  drawChart(){
      var yAxisMin = 0;
      //var yAxisMax = 140;

      var options = {
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
          categories: ["vs [Profile 2]", "vs [Profile 3]", "vs [Profile 4]", "vs [Profile 5]"],
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
          },
          series: {
            //pointWidth: 30
          }
        },
        colors: [
          '#272727',
          '#bc2027'
        ],
        series: [{
          pointWidth: 30,
          name: 'Pts. Scored',
          data: [4, 8, 9, 12]
        }, {
          pointWidth: 30,
          name: 'Pts. Against',
          data: [2, 10, 7, 10]
        }],
        credits: {
          enabled: false
        }
      };
      jQuery('.daily-update-chart-wrapper').highcharts(options);
    };

    ngOnInit(){
      //this.drawChart();
    }

    ngOnChanges(event){
      //console.log("event",event);
      this.drawChart();
    }

  ngAfterViewInit(){
    //console.log("event",event);
    this.drawChart();
  }
}
