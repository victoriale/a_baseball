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
    selector: 'mvp-batter',
    templateUrl: './app/modules/mvp-batter/mvp-batter.module.html',
    directives: [NoDataBox, Tab, Tabs, SliderCarousel, DetailedListItem, ModuleHeader, ModuleFooter],
    providers: [],
    inputs:['draftData', 'profHeader']
})

export class MVPBatter{
  @Output() tab: EventEmitter<string> = new EventEmitter();
  draftData:any;
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
      url: ['Draft-history-page',{teamName:this.params.get('teamName'), teamId:this.teamId}]
    };

  }

  ngOnInit(){
    this.displayData();
  }

  ngOnChanges(){
    this.displayData();
  }

  displayData(){
    console.log(this.profHeader);
    this.modHeadData = {
        moduleTitle: "MVP Batter - "+ this.profHeader.profileName,
        hasIcon: false,
        iconClass: '',
    }
    this.errorData = this.draftData.errorData;
    if(typeof this.dataArray == 'undefined'){//makes sure it only runs once
      this.dataArray = this.draftData.tabArray;
    }
    if(this.draftData.listData.length == 0){//makes sure it only runs once
      this.detailedDataArray = false;
    }else{
      this.detailedDataArray = this.draftData.listData;
      if(this.detailedDataArray == false){
        this.carouselDataArray = this.draftData.carData
        this.carouselDataArray[0]['description'][0] = '<br><b style="font-size:20px">'+this.errorData.data+'</b>';
      }
    }
    this.carouselDataArray = this.draftData.carData
  }

  //each time a tab is selected the carousel needs to change accordingly to the correct list being shown
  selectedTab(event){
    this.tab.emit(event);
  }
}
