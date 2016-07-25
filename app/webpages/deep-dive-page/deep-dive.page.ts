
import {Component, OnInit, Input, NgZone} from '@angular/core';
import {TileStackModule} from '../../modules/tile-stack/tile-stack.module';
import {ArticleStackModule} from '../../modules/article-stack/article-stack.module';
import {VideoStackModule} from '../../modules/video-stack/video-stack.module';
import {CarouselDiveModule} from '../../modules/carousel-dive/carousel-dive.module';
import {DeepDiveService} from '../../services/deep-dive.service';
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
      ResponsiveWidget,
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
    callLimit:number = 20;
    safeCall: boolean = true;
    //for carousel
    carouselData: any;
​
    //for article-stack
    firstStackTop: any;
    firstStackRow: any;
    secStackTop: any;
    secStackRow: any;
    thirdStackTop: any;
    thirdStackRow: any;
    private isHomeRunZone: boolean = false;

    //for recommendation module
    recommendationData: any;
    boxArticleData: any;
    //for Tile Stack Module
    tilestackData: any;

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

      if(this.safeCall){
        this.safeCall = false;
        this._schedulesService.setupSlideScroll(this.sideScrollData, 'league', 'pre-event', this.callLimit, this.callCount, (sideScrollData) => {
          if(this.sideScrollData == null){
            this.sideScrollData = sideScrollData;
          }
          else{
            sideScrollData.forEach(function(val,i){
              self.sideScrollData.push(val);
            })
          }
          this.safeCall = true;
          this.callCount++;
          this.scrollLength = this.sideScrollData.length;
        })
      }
    }

    private scrollCheck(event){
      let maxScroll = this.sideScrollData.length;
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
      // this._deepDiveData.getCarouselData()
      //     .subscribe(data => {
      //       console.log(data);
      //       this.carouselData = this._deepDiveData.carouselTransformData(data);
      //     });
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
      this._deepDiveData.getRecArticleData("KS",1,1)
          .subscribe(data => {
            this.recommendationData = this._deepDiveData.transformToRecArticles(data);
          });
    }
    getBoxArticleData(){
      this._deepDiveData.getDeepDiveService(1, 2)
          .subscribe(data => {
            this.boxArticleData = this._deepDiveData.transformToBoxArticle(data);
          });
    }
    getTileStackData(){
      this._deepDiveData.getDeepDiveService(2, 25)
          .subscribe(data => {
            this.tilestackData = this._deepDiveData.transformTileStack(data);
          });
    }

    getFirstArticleStackData(){
      this._deepDiveData.getDeepDiveService(1, 7)
          .subscribe(data => {
            this.firstStackTop = this._deepDiveData.transformToArticleStack(data);
            this.firstStackRow = this._deepDiveData.transformToArticleRow(data);
          });
    }
    getSecArticleStackData(){
      this._deepDiveData.getDeepDiveService(2, 7)
          .subscribe(data => {
            this.secStackTop = this._deepDiveData.transformToArticleStack(data);
            this.secStackRow = this._deepDiveData.transformToArticleRow(data);
          });
    }
    getThirdArticleStackData(){
      this._deepDiveData.getDeepDiveService(3, 7)
          .subscribe(data => {
            this.thirdStackTop = this._deepDiveData.transformToArticleStack(data);
            this.thirdStackRow = this._deepDiveData.transformToArticleRow(data);
          });
    }

    ngOnInit() {
      this.getRecommendationData();
      this.checkSize();
      this.getBoxScores(this.dateParam);
      this.getDataCarousel();
      this.getFirstArticleStackData();
      this.getSecArticleStackData();
      this.getThirdArticleStackData();
      this.getSideScroll();
      this.getBoxArticleData();
      this.getTileStackData();
    }

    ngDoCheck(){

    }

}
