import {Component, OnInit, Output, EventEmitter, Injectable} from '@angular/core';

import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {NoDataBox} from '../../components/error/data-box/data-box.component';


@Component({
    selector: 'mvp-module',
    templateUrl: './app/modules/mvp/mvp.module.html',
    directives: [NoDataBox, Tab, Tabs, SliderCarousel, DetailedListItem, ModuleHeader, ModuleFooter],
    providers: [],
    inputs:['mvpData', 'title']
})

export class MVPModule implements OnInit{
  @Output() tab = new EventEmitter();
  title:string;
  mvpData:any;
  modHeadData: Object;
  errorData: any;
  dataArray: any;//array of data for detailed list
  detailedDataArray:any; //variable that is just a list of the detailed DataArray
  carouselDataArray: any;
  footerData: Object;
  footerStyle: any;

  constructor(){
  }

  ngOnInit(){
    this.displayData();
  }

  ngOnChanges(){
    this.displayData();
  }

  displayData(){
    this.modHeadData = {
        moduleTitle: "Most Valuable "+this.title+" - MLB",
        hasIcon: false,
        iconClass: '',
    };
    this.footerData = {
      infoDesc: 'Want to see everybody involved in this list?',
      text: 'VIEW THE LIST',
      url: ['List-page',this.mvpData['query']]
    };

    this.errorData = this.mvpData.errorData;
    if(typeof this.dataArray == 'undefined'){//makes sure it only runs once
      this.dataArray = this.mvpData.tabArray;
    }
    if(this.mvpData.listData.length == 0){//makes sure it only runs once
      this.detailedDataArray = false;
    }else{
      this.detailedDataArray = this.mvpData.listData;
      if(this.detailedDataArray == false){
        this.carouselDataArray = this.mvpData.carData
        this.carouselDataArray[0]['description'][0] = '<br><span class="text-heavy" style="font-size:20px">'+this.errorData.data+'</span>';
      }
    }
    this.carouselDataArray = this.mvpData.carData
  }

  //each time a tab is selected the carousel needs to change accordingly to the correct list being shown
  selectedTab(event){
    var tabArray = this.dataArray;
    for(var i = 0; i < tabArray.length; i++){
      if(event === tabArray[i]['tabDisplay']){
        this.tab.emit(tabArray[i]['tabData']);
      }
    }
  }
}
