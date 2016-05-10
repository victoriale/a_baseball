import {Component, OnInit} from 'angular2/core';
import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {TitleComponent, TitleInputData} from '../../components/title/title.component';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {DraftHistoryService} from '../../services/draft-history.service';
import {ListPageService} from '../../services/list-page.service';
import {NoDataBox} from '../../components/error/data-box/data-box.component';
import {ProfileHeaderService} from '../../services/profile-header.service';

@Component({
    selector: 'draft-history-page',
    templateUrl: './app/webpages/draft-history-page/draft-history.page.html',
    directives: [NoDataBox, BackTabComponent, TitleComponent, Tab, Tabs, SliderCarousel, DetailedListItem, ModuleFooter],
    providers: [DraftHistoryService, ProfileHeaderService],
    inputs:[]
})

export class DraftHistoryPage implements OnInit{
  profileHeaderData: TitleInputData;
  errorData: any;
  dataArray: any;//array of data for detailed list
  detailedDataArray:any; //variable that is just a list of the detailed DataArray
  carouselDataArray: any;
  footerData: Object;
  footerStyle: any = {
    ctaBoxClass: "list-footer",
    ctaBtnClass:"list-footer-btn",
    hasIcon: true,
  };
  constructor(private draftService:DraftHistoryService, private profHeadService:ProfileHeaderService){

  }

  getDraftPage(date) {
      this.profHeadService.getTeamPageHeader(2799)
      .subscribe(
          profHeader => {
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
      this.draftService.getDraftHistoryService(date)
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


  selectedTab(event){
    var firstTab = 'Current Season';
    if(event == firstTab){
      event = new Date().getFullYear();
    }
    this.getDraftPage(event);
  }


}
