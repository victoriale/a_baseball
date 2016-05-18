import {Component, Input, Output, OnInit, DoCheck, EventEmitter} from 'angular2/core';

import {SchedulesCarousel, SchedulesCarouselInput} from '../carousels/schedules-carousel/schedules-carousel.component';
import {Tabs} from '../tabs/tabs.component';
import {Tab} from '../tabs/tab.component';
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
    directives: [Tabs, Tab, SchedulesCarousel, CustomTable],
})

export class SchedulesComponent implements OnInit{
  public selectedIndex;

  public carouselData: Array<SchedulesCarouselInput> = [];
  @Input() data;// the data to display is inputed through this variable
  @Input() tabs;// the tab data gets inputed through here to display all tabs

  @Output("tabSelected") tabSelectedListener = new EventEmitter();

  setSelectedCarouselIndex() {

  }

  indexNum($event) {

  }

  updateCarousel(sortedRows?) {


  }
  constructor() {
  } //constructor ENDS

  ngOnInit(){
    // console.log('tabs tabs',this.tabs);
    // console.log('tabs Data',this.data);
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
