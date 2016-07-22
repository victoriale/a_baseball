
import {Component, OnInit, Input, NgZone} from '@angular/core';
import {TileStackModule} from '../../modules/tile-stack/tile-stack.module';
import {ArticleStackModule} from '../../modules/article-stack/article-stack.module';
import {VideoStackModule} from '../../modules/video-stack/video-stack.module';
import {CarouselDiveModule} from '../../modules/carousel-dive/carousel-dive.module';
import {DeepDiveService} from '../../services/deep-dive.service'
import {RecommendationsComponent} from '../../components/articles/recommendations/recommendations.component';
import {SidekickWrapper} from '../../components/sidekick-wrapper/sidekick-wrapper.component';
import {BoxArticleComponent} from '../../components/box-article/box-article.component';

import {SchedulesService} from '../../services/schedules.service';

import {WidgetCarouselModule} from '../../modules/widget/widget-carousel.module';
import {SideScrollSchedule} from '../../modules/side-scroll-schedules/side-scroll-schedules.module';

import {BoxScoresModule} from '../../modules/box-scores/box-scores.module';
import {BoxScoresService} from '../../services/box-scores.service';

import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from "../../global/global-functions";
import {Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {ResponsiveWidget} from '../../components/responsive-widget/responsive-widget.component';

//window declarions of global functions from library scripts
declare var moment;
declare var jQuery: any;

@Component({
    selector: 'deep-dive-page',
    templateUrl: './app/webpages/deep-dive-page/deep-dive.page.html',

    directives: [
      ROUTER_DIRECTIVES,
      SidekickWrapper,
      WidgetCarouselModule,
      SideScrollSchedule,
      BoxScoresModule,
      TileStackModule,
      ArticleStackModule,
      VideoStackModule,
      CarouselDiveModule,
      BoxArticleComponent,
      RecommendationsComponent,
      ResponsiveWidget
    ],
    providers: [BoxScoresService,SchedulesService,DeepDiveService],
})

export class DeepDivePage implements OnInit {
    public widgetPlace: string = "widgetForPage";

    //page variables
    partnerID: string;
    profileName:string;

    //for box scores
    boxScoresData: any;
    currentBoxScores: any;
    dateParam: any;
    maxHeight: any;
    scroll: boolean = true;

    sideScrollData: any;
    scrollLength: number;
    ssMax:number = 7;
    callCount:number = 1;

    //for carousel
    carouselData: any;
​
    //for article-stack
    stackTop: any;
    stackRow: any;
    private isHomeRunZone: boolean = false;

    //for recommendation module
    recommendationData: any;
    boxArticleData: any;
    constructor(
      private _router:Router,
      private _deepDiveData: DeepDiveService,
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
      //constantly check the size of the browser width and run the size check function
      window.onresize = (e) =>
      {
        // current use is box scores
        this.checkSize();
      }
    }

    //api for Schedules
    private getSideScroll(){
      let self = this;
      this._schedulesService.setupSlideScroll(this.sideScrollData, 'league', 'pre-event', (20 + this.callCount), this.callCount, (sideScrollData) => {
        if(this.sideScrollData == null){
          this.sideScrollData = sideScrollData;
          this.scrollLength = sideScrollData.length;
          this.callCount++;
        }
        else{
          // sideScrollData.forEach(function(val,i){
          //   self.sideScrollData.push(val);
          // })
          this.scrollLength = sideScrollData.length;
          this.callCount++;
        }
      })
    }

    private scrollCheck(event){
      let maxScroll = this.sideScrollData.length;
      this.scrollLength = this.sideScrollData.length - this.ssMax;
      if(event >= (maxScroll - this.ssMax)){
        this.getSideScroll();
      }
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
    private getDataCarousel() {
      this._deepDiveData.getCarouselData(this.carouselData, (carData)=>{
        this.carouselData = carData;
      })
    }

    checkSize(){
      var width = window.outerWidth;
      var height = window.outerHeight;
      if(width <= 640){
        this.scroll = false;
        this.maxHeight = 'auto';
      }else if(width > 640){
        this.scroll = true;
        this.maxHeight = 650;
      }
    }
    getRecommendationData(){
      this._deepDiveData.getAiArticleData()
          .subscribe(data => {
            this.recommendationData = this._deepDiveData.transformToRecArticles(data);
          });
    }
    getBoxArticleData(){
      this._deepDiveData.getDeepDiveService()
          .subscribe(data => {
            this.boxArticleData = this._deepDiveData.transformToBoxArticle(data);
          });
    }

    getArticleStackData(){
      this._deepDiveData.getDeepDiveService()
          .subscribe(data => {
            this.stackTop = this._deepDiveData.transformToArticleStack(data);
            this.stackRow = this._deepDiveData.transformToArticleRow(data);
          });
    }

    ngOnInit() {
      this.getRecommendationData();
      this.checkSize();
      this.getBoxScores(this.dateParam);
      this.getDataCarousel();
      this.getArticleStackData();
      this.getSideScroll();
      this.getBoxArticleData();
    }

    ngDoCheck(){

    }

}
