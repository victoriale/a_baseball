import {Component, OnInit} from 'angular2/core';
import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter, ModuleFooterData, FooterStyle} from '../../components/module-footer/module-footer.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {TitleComponent, TitleInputData} from '../../components/title/title.component';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {DraftHistoryService} from '../../services/draft-history.service';
import {RouteParams} from 'angular2/router';
import {ListPageService} from '../../services/list-page.service';
import {NoDataBox} from '../../components/error/data-box/data-box.component';
import {ProfileHeaderService} from '../../services/profile-header.service';
import {PaginationFooter} from '../../components/pagination-footer/pagination-footer.component';
import {LoadingComponent} from "../../components/loading/loading.component";
import {ErrorComponent} from "../../components/error/error.component";

import {SchedulesService} from '../../services/schedules.service';
import {SchedulesComponent} from '../../components/schedules/schedules.component';

@Component({
    selector: 'schedules-page',
    templateUrl: './app/webpages/schedules-page/schedules.page.html',
    directives: [SchedulesComponent, ErrorComponent, LoadingComponent,PaginationFooter, BackTabComponent, TitleComponent, SliderCarousel, DetailedListItem,  ModuleFooter],
    providers: [SchedulesService, ProfileHeaderService],
    inputs:[]
})

export class SchedulesPage implements OnInit{
  profileHeaderData: TitleInputData;
  errorData: any;
  paginationParameters:any;
  isError: boolean = false;
  schedulesData:any;

  constructor(private _schedulesService:SchedulesService, private profHeadService:ProfileHeaderService, private params: RouteParams){
  }

  //grab tab to make api calls for post of pre event table
  private scheduleTab(tab) {
   // console.log(tab);
  }

  private getSchedulesData(){
    var teamId = this.params.params['teamId']; //determines to call league page or team page for schedules-table
    var pageNum = this.params.params['pageNum'];
    if(typeof teamId != 'undefined'){
      this._schedulesService.getSchedulesService('team', 'pre-event', 10, pageNum, teamId)
      .subscribe(
        data => {
          this.schedulesData = data;
          this.setPaginationParams(data.pageInfo);
        },
        err => {
          console.log("Error getting Schedules Data");
        }
      )
    }else{
      this._schedulesService.getSchedulesService('league', 'pre-event', 10, pageNum)
      .subscribe(
        data => {
          this.schedulesData = data;
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
      // console.log(params)
      //'/schedules/:teamName/:teamId/:pageNum'
      var navigationParams = {
        teamName: params['teamName'],
        teamId: params['teamId'],
        pageNum: params['pageNum'],
      };

      if(typeof params['teamId'] != 'undefined'){
        this.paginationParameters = {
          index: params['pageNum'],
          max: input.totalPages,
          paginationType: 'page',
          navigationPage: 'Schedules-page-team',
          navigationParams: navigationParams,
          indexKey: 'pageNum'
        };
      }else{
        this.paginationParameters = {
          index: params['pageNum'],
          max: input.totalPages,
          paginationType: 'page',
          navigationPage: '/g',
          navigationParams: navigationParams,
          indexKey: 'pageNum'
        };
      }
  }

  ngOnInit(){
      this.getSchedulesData();
  }

}
