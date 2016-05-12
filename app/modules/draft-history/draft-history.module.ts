import {Component} from 'angular2/core';
import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {DraftHistoryService} from '../../services/draft-history.service';
import {NoDataBox} from '../../components/error/data-box/data-box.component';
import {ProfileHeaderService} from '../../services/profile-header.service';

@Component({
    selector: 'draft-history',
    templateUrl: './app/modules/draft-history/draft-history.module.html',
    directives: [NoDataBox, Tab, Tabs, SliderCarousel, DetailedListItem, ModuleHeader, ModuleFooter],
    providers: [DraftHistoryService, ProfileHeaderService],
    inputs:[]
})

export class DraftHistoryModule{
  moduleTitle: string = "Draft History - [Team Profile]"
  profileHeaderData: any;
  errorData: any;
  dataArray: any;//array of data for detailed list
  detailedDataArray:any; //variable that is just a list of the detailed DataArray
  carouselDataArray: any;
  footerData: Object;
  footerStyle: any;
  constructor(private draftService:DraftHistoryService, private profHeadService:ProfileHeaderService){
    this.footerData = {
      infoDesc: 'Want to see everybody involved in this list?',
      text: 'VIEW THE LIST',
      url: ['Draft-history-page',{teamName:'team-name-here', teamId:2796}]
    };
  }

  getDraftPage(date) {
    this.profHeadService.getTeamProfile(2799)
    .subscribe(
        data => {
          var profHeader = this.profHeadService.convertTeamPageHeader(data);
          this.profileHeaderData = profHeader.data;
          this.errorData = {
            data:profHeader.error,
            icon: "fa fa-area-chart"
          }
        },
        err => {
            console.log('Error: draftData Profile Header API: ', err);
            // this.isError = true;
        }
    );
      this.draftService.getDraftHistoryService(date, 'module')
          .subscribe(
              draftData => {
                if(typeof this.dataArray == 'undefined'){//makes sure it only runs once
                  this.dataArray = draftData.tabArray;
                }
                if(draftData.listData.length == 0){//makes sure it only runs once
                  this.detailedDataArray = false;
                }else{
                  this.detailedDataArray = draftData.listData;
                }
                this.carouselDataArray = draftData.carData
              },
              err => {
                  console.log('Error: draftData API: ', err);
                  // this.isError = true;
              }
          );
  }

  ngOnInit(){
    //MLB starts and ends in same year so can use current year logic to grab all current season and back 4 years for tabs
    var currentTab = new Date().getFullYear();
    this.getDraftPage(currentTab);
  }

  //each time a tab is selected the carousel needs to change accordingly to the correct list being shown
  selectedTab(event){
    var firstTab = 'Current Season';
    if(event == firstTab){
      event = new Date().getFullYear();
    }
    this.getDraftPage(event);
  }
}
