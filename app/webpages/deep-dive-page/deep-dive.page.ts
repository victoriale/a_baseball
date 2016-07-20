import {Component, OnInit, Input, NgZone} from '@angular/core';
import {TileStackModule} from '../../modules/tile-stack/tile-stack.module';
import {ArticleStackModule} from '../../modules/article-stack/article-stack.module';
import {VideoStackModule} from '../../modules/video-stack/video-stack.module';
import {CarouselDiveModule} from '../../modules/carousel-dive/carousel-dive.module';
import {DeepDiveService} from '../../services/deep-dive.service'

import {SidekickWrapper} from '../../components/sidekick-wrapper/sidekick-wrapper.component';

import {SchedulesService} from '../../services/schedules.service';

import {WidgetCarouselModule} from '../../modules/widget/widget-carousel.module';
import {SideScrollSchedule} from '../../modules/side-scroll-schedules/side-scroll-schedules.module';

import {BoxScoresModule} from '../../modules/box-scores/box-scores.module';
import {BoxScoresService} from '../../services/box-scores.service';

import {RecommendationsComponent} from '../../components/articles/recommendations/recommendations.component';

import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from "../../global/global-functions";
import {Router} from '@angular/router-deprecated';

//window declarions of global functions from library scripts
declare var moment;
declare var jQuery: any;

@Component({
    selector: 'deep-dive-page',
    templateUrl: './app/webpages/deep-dive-page/deep-dive.page.html',

    directives: [
      SidekickWrapper,
      WidgetCarouselModule,
      SideScrollSchedule,
      BoxScoresModule,
      TileStackModule,
      ArticleStackModule,
      VideoStackModule,
      CarouselDiveModule,
      RecommendationsComponent
    ],
    providers: [BoxScoresService, DeepDiveService, SchedulesService],
})

export class DeepDivePage implements OnInit {

    //page variables
    partnerID: string;
    profileName:string;

    //for box scores
    boxScoresData: any;
    currentBoxScores: any;
    dateParam: any;
    maxHeight: any;
    scroll: boolean = true;

    //data for rec module
    recommendationData: any;
    recommendationImages: any;

    sideScrollData: any;
    private isHomeRunZone: boolean = false;

    constructor(
      private _deepDiveData: DeepDiveService,
      private _router:Router,
      private _boxScores:BoxScoresService,
      private _schedulesService:SchedulesService,
      public ngZone:NgZone){
      this.profileName = "MLB";

      //for boxscores
      var currentUnixDate = new Date().getTime();
      //convert currentDate(users local time) to Unix and push it into boxScoresAPI as YYYY-MM-DD in EST using moment timezone (America/New_York)
      this.dateParam ={
        profile:'league',//current profile page
        teamId:null,
        date: moment.tz( currentUnixDate , 'America/New_York' ).format('YYYY-MM-DD')
      }

      GlobalSettings.getPartnerID(_router, partnerID => {
          this.partnerID = partnerID;
          var partnerHome = GlobalSettings.getHomeInfo().isHome && GlobalSettings.getHomeInfo().isPartner;
          this.isHomeRunZone = partnerHome;
      });

      window.onresize = (e) =>
      {
        var width = window.outerWidth;
        var height = window.outerHeight;

        ngZone.run(() => {
          if(width < 640){
            this.maxHeight = 'auto';
            this.scroll = false;
          }else if(width >= 640){
            this.maxHeight = 650;
            this.scroll = true;
          }
        });
      }
    }

    //api for Schedules
    private getSchedulesData(){
      this._schedulesService.setupSlideScroll(this.sideScrollData, 'league', 'pre-event', 10, 1, (sideScrollData) => {
          this.sideScrollData = sideScrollData;
          // console.log('finished',sideScrollData);
          // console.log(this.sideScrollData);
      })
    }

    //api for BOX SCORES
    private getBoxScores(dateParams?) {
        if (dateParams != null) {
            this.dateParam = dateParams;
        }
        this._boxScores.getBoxScores(this.boxScoresData, this.profileName, this.dateParam, (boxScoresData, currentBoxScores) => {
            this.boxScoresData = boxScoresData;
            this.currentBoxScores = currentBoxScores;
        })
    }
    getRecommendationData(){
      this._deepDiveData.getDeepDiveService()
          .subscribe(data => {
            this.recommendationData = this._deepDiveData.transformToRecArticles(data);
          });
    }
    ngOnInit(){
        this.getBoxScores(this.dateParam);
        this.getRecommendationData();
        this.getSchedulesData();
    }

    ngDoCheck(){

    }

}
