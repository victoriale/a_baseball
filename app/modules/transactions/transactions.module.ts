import {Component, Output, EventEmitter} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Injectable} from 'angular2/core';

import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {NoDataBox} from '../../components/error/data-box/data-box.component';


@Component({
    selector: 'transactions',
    templateUrl: './app/modules/transactions/transactions.module.html',
    directives: [NoDataBox, Tab, Tabs, SliderCarousel, DetailedListItem, ModuleHeader, ModuleFooter],
    providers: [],
    inputs:['transactionsData', 'profHeader']
})

export class TransactionsModule{
  @Output() tab: EventEmitter<string> = new EventEmitter();
  transactionsData:any;
  profHeader:any;
  modHeadData: Object;
  profileHeaderData: any;
  errorData: any;
  dataArray: any;//array of data for detailed list
  detailedDataArray:any; //variable that is just a list of the detailed DataArray
  carouselDataArray: any;
  footerData: Object;
  footerStyle: any;
  teamId:number;
  constructor( public params: RouteParams){
    this.teamId = Number(this.params.get('teamId'));
    this.footerData = {
      infoDesc: 'Want to see everybody involved in this list?',
      text: 'VIEW THE LIST',
      url: ["Disclaimer-page"]
    };
  }

  ngOnInit(){
    this.displayData();
  }

  ngOnChanges(){
    this.displayData();
  }

  displayData(){
    this.modHeadData = {
        moduleTitle: "Transactions - ",
        hasIcon: false,
        iconClass: '',
    }
    //this.errorData = this.transactionsData.errorData;
    if(typeof this.dataArray == 'undefined'){//makes sure it only runs once
      //this.dataArray = this.transactionsData.tabArray;
    }
    if(this.transactionsData.listData.length == 0){//makes sure it only runs once
      this.detailedDataArray = false;
    }else{
      this.detailedDataArray = this.transactionsData.listData;
      if(this.detailedDataArray == false){
        this.carouselDataArray = this.transactionsData.carData;
        this.carouselDataArray[0]['description'][0] = '<br><b style="font-size:20px">'+this.errorData.data+'</b>';
      }
    }
    this.carouselDataArray = this.transactionsData.carData
  }

  //each time a tab is selected the carousel needs to change accordingly to the correct list being shown
  selectedTab(event){
    this.tab.emit(event);
  }
}
