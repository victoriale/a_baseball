import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Title} from 'angular2/platform/browser';

import {GlobalSettings} from "../../global/global-settings";
import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter, ModuleFooterData, FooterStyle} from '../../components/module-footer/module-footer.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {TitleComponent, TitleInputData} from '../../components/title/title.component';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {DraftHistoryService} from '../../services/draft-history.service';
import {ListPageService} from '../../services/list-page.service';
import {NoDataBox} from '../../components/error/data-box/data-box.component';
import {ProfileHeaderService} from '../../services/profile-header.service';
import {PaginationFooter} from '../../components/pagination-footer/pagination-footer.component';
import {LoadingComponent} from "../../components/loading/loading.component";
import {ErrorComponent} from "../../components/error/error.component";

import {SchedulesService} from '../../services/schedules.service';
import {SchedulesComponent} from '../../components/schedules/schedules.component';
import {SidekickWrapper} from "../../components/sidekick-wrapper/sidekick-wrapper.component";

declare var moment;

@Component({
    selector: 'schedules-page',
    templateUrl: './app/webpages/schedules-page/schedules.page.html',
    directives: [SidekickWrapper, SchedulesComponent, ErrorComponent, LoadingComponent,PaginationFooter, BackTabComponent, TitleComponent, SliderCarousel, DetailedListItem,  ModuleFooter],
    providers: [SchedulesService, ProfileHeaderService, Title],
    inputs:[]
})

export class SchedulesPage implements OnInit{
  profileHeaderData: TitleInputData;
  errorData: any;
  paginationParameters:any;
  isError: boolean = false;
  schedulesData:any;
  tabData: any;

  constructor(private _schedulesService:SchedulesService,
          private profHeadService:ProfileHeaderService,
          private params: RouteParams,
          private _title: Title) {
      _title.setTitle(GlobalSettings.getPageTitle("Schedules"));
    }

  //grab tab to make api calls for post of pre event table
  private scheduleTab(tab) {
      if(tab == 'Upcoming Games'){
          this.getSchedulesData('pre-event');
      }else if(tab == 'Previous Games'){
          this.getSchedulesData('post-event');
      }else{
          this.getSchedulesData('post-event');// fall back just in case no status event is present
      }
  }

  private getSchedulesData(status){
    var teamId = this.params.params['teamId']; //determines to call league page or team page for schedules-table
    var pageNum = this.params.params['pageNum'];

    if(typeof teamId != 'undefined'){
      this.profHeadService.getTeamProfile(Number(teamId))
      .subscribe(
          data => {
            this._title.setTitle(GlobalSettings.getPageTitle("Schedules", data.teamName));
            this.profileHeaderData = this.profHeadService.convertTeamPageHeader(data, "Current Season Schedule - " + data.teamName);
            this.errorData = {
              data: data.teamName + " has no record of any more games for the current season.",
              icon: "fa fa-calendar-times-o"
            }
          },
          err => {
            this.isError= true;
              console.log('Error: Schedules Profile Header API: ', err);
              // this.isError = true;
          }
      );
      this._schedulesService.getSchedulesService('team', status, 10, pageNum, status, false, teamId) // isTeamProfilePage = false
      .subscribe(
        data => {
          this.schedulesData = data;
            if(typeof this.tabData == 'undefined'){
                this.tabData = data.tabs;
            }
          this.setPaginationParams(data.pageInfo);
        },
        err => {
          console.log("Error getting Schedules Data");
        }
      )
    }else{
      this._title.setTitle(GlobalSettings.getPageTitle("Schedules", "MLB"));
      this.profHeadService.getMLBProfile()
      .subscribe(
          data => {
            var currentDate = new Date();// no stat for date so will grab current year client is on
            var display:string;
            if(currentDate.getFullYear() == currentDate.getFullYear()){// TODO must change once we have historic data
              display = "Current Season"
            }
            var pageTitle = display + " Schedules - " + data.headerData.profileNameShort;
            this.profileHeaderData = this.profHeadService.convertMLBHeader(data.headerData, pageTitle);
            this.errorData = {
              data: data.headerData.profileNameShort + " has no record of any more games for the current season.",
              icon: "fa fa-remove"
            }
          },
          err => {
            this.isError= true;
            console.log('Error: Schedules Profile Header API: ', err);
            // this.isError = true;
          }
      );
      this._schedulesService.getSchedulesService('league', status, 10, pageNum, status)
      .subscribe(
        data => {
          this.schedulesData = data;
          if(typeof this.tabData == 'undefined'){
              this.tabData = data.tabs;
          }
          this.setPaginationParams(data.pageInfo);
        },
        err => {
          console.log("Error getting Schedules Data");
        }
      )
    }
  }

  //PAGINATION
  //sets the total pages for particular lists to allow client to move from page to page without losing the sorting of the list
  setPaginationParams(input) {
      var params = this.params.params;
      var pageType;
      // console.log(params)
      //'/schedules/:teamName/:teamId/:pageNum'
      var navigationParams = {
        pageNum: params['pageNum'],
      };

      if(params['teamName'] != null){
        navigationParams['teamName'] = params['teamName'];
      }
      if(params['teamId'] != null){
        navigationParams['teamId'] = params['teamId'];
      }
      if(params['tab'] != null){
        pageType =
        navigationParams['tab'] = params['tab'];
      }

      if(typeof params['teamId'] != 'undefined'){
        if(params['tab'] != null){
          pageType = 'Schedules-page-team-tab'
        }else{
          pageType = 'Schedules-page-team'
        }
        this.paginationParameters = {
          index: params['pageNum'],
          max: input.totalPages,
          paginationType: 'page',
          navigationPage: 'Schedules-page-team',
          navigationParams: navigationParams,
          indexKey: 'pageNum'
        };
      }else{
        if(params['tab'] != null){
          pageType = 'Schedules-page-league-tab'
        }else{
          pageType = 'Schedules-page-league'
        }
        this.paginationParameters = {
          index: params['pageNum'],
          max: input.totalPages,
          paginationType: 'page',
          navigationPage: 'Schedules-page-league',
          navigationParams: navigationParams,
          indexKey: 'pageNum'
        };
      }
  }

  ngOnInit() {
    this.getSchedulesData('pre-event');// on load load any upcoming games
  }

}
