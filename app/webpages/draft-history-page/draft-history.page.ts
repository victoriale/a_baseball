import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Title} from 'angular2/platform/browser';

import {GlobalSettings} from "../../global/global-settings";
import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {TitleComponent, TitleInputData} from '../../components/title/title.component';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {DraftHistoryService} from '../../services/draft-history.service';
import {ListPageService} from '../../services/list-page.service';
import {NoDataBox} from '../../components/error/data-box/data-box.component';
import {ProfileHeaderService} from '../../services/profile-header.service';
import {LoadingComponent} from "../../components/loading/loading.component";
import {ErrorComponent} from "../../components/error/error.component";
import {SidekickWrapper} from "../../components/sidekick-wrapper/sidekick-wrapper.component";

@Component({
    selector: 'draft-history-page',
    templateUrl: './app/webpages/draft-history-page/draft-history.page.html',
    directives: [SidekickWrapper, ErrorComponent, LoadingComponent, NoDataBox, BackTabComponent, TitleComponent, Tab, Tabs, SliderCarousel, DetailedListItem],
    providers: [DraftHistoryService, ProfileHeaderService, Title]
})

export class DraftHistoryPage implements OnInit{
  whatProfile:string = "Draft History";
  profileHeaderData: TitleInputData;
  errorData: any;
  dataArray: any;//array of data for detailed list
  detailedDataArray: Array<DetailListInput>; //variable that is just a list of the detailed DataArray
  carouselDataArray: Array<SliderCarouselInput>;
  // carouselFooter: any = {
  //   ctaBoxClass: "list-footer",
  //   ctaBtnClass:"list-footer-btn",
  //   hasIcon: true,
  // };
  profileName: string;
  teamId: number;
  isError: boolean = false;
  constructor(private draftService:DraftHistoryService, 
              private profHeadService:ProfileHeaderService, 
              private params: RouteParams, 
              private _title: Title) {
    _title.setTitle(GlobalSettings.getPageTitle("Draft History"));
    if ( this.params.params['teamId'] ) {
      this.teamId = Number(this.params.params['teamId']);
    }
  }

  getProfileInfo() {
    //MLB starts and ends in same year so can use current year logic to grab all current season and back 4 years for tabs
    var currentTab = new Date().getFullYear();

    if ( this.teamId ) {
      this.profHeadService.getTeamProfile(this.teamId)
      .subscribe(
          data => {
            this._title.setTitle(GlobalSettings.getPageTitle("Draft History", data.teamName));
            var stats = data.headerData.stats;
            var pageNameForTitle = stats.teamName + " " + stats.seasonId + " - " + this.whatProfile;
            this.profileHeaderData = this.profHeadService.convertTeamPageHeader(data, pageNameForTitle);
            this.profileName = stats.teamName;
            this.getDraftPage(currentTab);
          },
          err => {
            this.isError= true;
              console.log('Error: draftData Profile Header API: ', err);
              // this.isError = true;
          }
      );
    }
    else {
      this.profHeadService.getMLBProfile()
      .subscribe(
          data => {
            this._title.setTitle(GlobalSettings.getPageTitle("Draft History", data.profileName1));
            this.profileHeaderData = this.profHeadService.convertMLBHeader(data, this.whatProfile);
            this.profileName = "MLB";
            this.getDraftPage(currentTab);
          },
          err => {
            this.isError= true;
              console.log('Error: draftData Profile Header API: ', err);
          }
      );
    }
  }

  getDraftPage(date) {
    this.errorData = {
      data: "Sorry, " + (this.teamId ? "the " + this.profileName + " do" : "MLB does") + " not currently have any data for the " + date + " " + this.whatProfile,
      icon: "fa fa-remove"
    }
    this.draftService.getDraftHistoryService(date, this.teamId, this.errorData.data, 'page')
        .subscribe(
            draftData => {
              if(typeof this.dataArray == 'undefined'){//makes sure it only runs once
                this.dataArray = draftData.tabArray;
              }
              if(draftData.listData.length == 0){//makes sure it only runs once
                this.detailedDataArray = null;
              }else{
                this.detailedDataArray = draftData.listData;
              }
              this.carouselDataArray = draftData.carData;
            },
            err => {
              this.isError= true;
                console.log('Error: draftData API: ', err);
            }
        );
  }

  ngOnInit(){
    this.getProfileInfo();
  }

  selectedTab(event){
    var firstTab = 'Current Season';

    if(event == firstTab){
      event = new Date().getFullYear();
    }
    this.getDraftPage(event);
  }


}
