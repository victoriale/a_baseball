import {Component, Input, OnInit, DoCheck} from 'angular2/core';

import {SchedulesCarousel, SchedulesCarouselInput} from '../carousels/schedules-carousel/schedules-carousel.component';
import {CustomTable} from '../custom-table/custom-table.component';
import {TableModel, TableColumn, TableRow, TableCell} from '../custom-table/table-data.component';

export interface TableTabData<T> {
  title: string;
  isActive: boolean;
  sections: Array<TableComponentData<T>>;
  convertToCarouselItem(item:T, index:number):SchedulesCarouselInput
}

export interface TableComponentData<T> {
  groupName: string;
  tableData: TableModel<T>;
}
@Component({
    selector: 'schedules-component',
    templateUrl: './app/components/schedules/schedules.component.html',
    directives: [SchedulesCarousel, CustomTable],
})

export class SchedulesComponent implements DoCheck{
  public carouselData: Array<SchedulesCarouselInput> = [];
  public selectedIndex;

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

  setSelectedCarouselIndex() {

  }

  indexNum($event) {

  }

  updateCarousel(sortedRows?) {

  }
  constructor() {} //constructor ENDS
  ngDoCheck() {} //ngDoCheck ENDS
  ngOnInit(){
    this.carouselData = [{
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
  }//ngOnInit ENDS
}
