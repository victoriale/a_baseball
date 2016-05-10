import {Component, Input, OnInit} from 'angular2/core';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {SchedulesCarousel} from '../../components/carousels/schedules-carousel/schedules-carousel.component';
import {TableModel, TableColumn} from '../../components/custom-table/table-data.component';

@Component({
    selector: 'schedules',
    templateUrl: './app/modules/schedules/schedules.module.html',
    directives: [SchedulesCarousel, ModuleHeader, ModuleFooter],
    providers: [],
    inputs:['']
})

export class SchedulesModule implements OnInit{
  carouselData:any;
  moduleTitle:string;
  columns: Array<TableColumn> = [{
      headerValue: "Team Name",
      columnClass: "image-column",
      key: "name"
    },{
      headerValue: "W",
      columnClass: "data-column",
      isNumericType: true,
      key: "w"
    },{
      headerValue: "L",
      columnClass: "data-column",
      isNumericType: true,
      key: "l"
    },{
      headerValue: "PCT",
      columnClass: "data-column",
      isNumericType: true,
      sortDirection: -1, //descending
      key: "pct"
    },{
      headerValue: "GB",
      columnClass: "data-column",
      isNumericType: true,
      key: "gb"
    },{
      headerValue: "RS",
      columnClass: "data-column",
      isNumericType: true,
      key: "rs"
    },{
      headerValue: "RA",
      columnClass: "data-column",
      isNumericType: true,
      key: "ra"
    },{
      headerValue: "STRK",
      columnClass: "data-column",
      isNumericType: true,
      key: "strk"
    }];

  ngOnInit(){
    this.moduleTitle = "[Profile] - Schedules";
    this.carouselData = [{
      rank:'1',//the position or rank the object is in the array;
      displayNext:'Next Game:',
      displayTime:'[DOW] [Month] [dd], [yyyy] | [Time] [AM/PM] [Zone]',
      detail1Data:'Home Stadium:',
      detail1Value:"[University]",
      detail2Value:'[Wichita], [KS]',
      imageConfig1:{
        imageClass: "image-125",
        mainImage: {
          imageUrl: "./app/public/placeholder-location.jpg",
          urlRouteArray: ['Disclaimer-page'],
          hoverText: "<p>View</p><p>Profile</p>",
          imageClass: "border-large"
        }
      },
      imageConfig2:{
        imageClass: "image-125",
        mainImage: {
          imageUrl: "./app/public/placeholder-location.jpg",
          urlRouteArray: ['Disclaimer-page'],
          hoverText: "<p>View</p><p>Profile</p>",
          imageClass: "border-large"
        }
      },
    },
    {
      rank:'2',//the position or rank the object is in the array;
      displayNext:'Next Game:',
      displayTime:'[Monday] [May] [2nd], [2016] | [2:08] [PM] [EST]',
      detail1Data:'Home Stadium:',
      detail1Value:"[Stadium's]",
      detail2Value:'[City], [State]',
      imageConfig1:{
        imageClass: "image-125",
        mainImage: {
          imageUrl: "./app/public/placeholder-location.jpg",
          urlRouteArray: ['Disclaimer-page'],
          hoverText: "<p>View</p><p>Profile</p>",
          imageClass: "border-large"
        }
      },
      imageConfig2:{
        imageClass: "image-125",
        mainImage: {
          imageUrl: "./app/public/placeholder-location.jpg",
          urlRouteArray: ['Disclaimer-page'],
          hoverText: "<p>View</p><p>Profile</p>",
          imageClass: "border-large"
        }
      },
    }];
  }
}
