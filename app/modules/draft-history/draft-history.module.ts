import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Injectable} from 'angular2/core';

import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {NoDataBox} from '../../components/error/data-box/data-box.component';
import {ProfileHeaderService} from '../../services/profile-header.service';

//module | interfaces | Services then space between each one
import {TeamPage} from '../../webpages/team-page/team.page';//to recall function that makes api call per tab click

@Component({
    selector: 'draft-history',
    templateUrl: './app/modules/draft-history/draft-history.module.html',
    directives: [NoDataBox, Tab, Tabs, SliderCarousel, DetailedListItem, ModuleHeader, ModuleFooter],
    providers: [TeamPage, ProfileHeaderService],
    inputs:['draftData', 'profHeader']
})

@Injectable()
export class DraftHistoryModule{
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
  constructor(private profHeadService:ProfileHeaderService, public params: RouteParams){
    this.teamId = Number(this.params.get('teamId'));
    this.footerData = {
      infoDesc: 'Want to see everybody involved in this list?',
      text: 'VIEW THE LIST',
      url: ['Draft-history-page',{teamName:this.params.get('teamName'), teamId:this.teamId}]
    };
  }

  ngOnInit(){

    // this.modHeadData = {
    //     moduleTitle: "Draft History - "+ data.headerData.stats.teamName,
    //     hasIcon: false,
    //     iconClass: '',
    // }
    // this.errorData = {
    //   data:profHeader.error,
    //   icon: "fa fa-area-chart"
    // }
    //
    //
    // if(typeof this.dataArray == 'undefined'){//makes sure it only runs once
    //   this.dataArray = draftData.tabArray;
    // }
    // if(draftData.listData.length == 0){//makes sure it only runs once
    //   this.detailedDataArray = false;
    // }else{
    //   this.detailedDataArray = draftData.listData;
    // }
    // this.carouselDataArray = draftData.carData
  }

  //each time a tab is selected the carousel needs to change accordingly to the correct list being shown
  selectedTab(event){
    var firstTab = 'Current Season';
    if(event == firstTab){
      event = new Date().getFullYear();
    }
    // this.draftData = this.teamPage.draftHistoryModule(event, this.teamId);
    console.log('click', this.draftData);
  }
}
