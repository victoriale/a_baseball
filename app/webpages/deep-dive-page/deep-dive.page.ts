
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
import {PartnerHeader} from "../../global/global-service";

import {WidgetCarouselModule} from '../../modules/widget/widget-carousel.module';
import {SideScrollSchedule} from '../../modules/side-scroll-schedules/side-scroll-schedules.module';

import {BoxScoresModule} from '../../modules/box-scores/box-scores.module';
import {BoxScoresService} from '../../services/box-scores.service';

import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from "../../global/global-functions";
import {GeoLocation} from "../../global/global-service";
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
    providers: [BoxScoresService,SchedulesService,DeepDiveService,GeoLocation,PartnerHeader],
})

export class DeepDivePage{
    public widgetPlace: string = "widgetForPage";

    //page variables
    partnerID: string;
    partnerData:any;
    profileName:string;
    geoLocation:string;

    //for box scores
    boxScoresData: any;
    currentBoxScores: any;
    dateParam: any;
    maxHeight: any;
    scroll: boolean = true;

    sideScrollData: any;
    scrollLength: number;
    ssMax:number = 9;
    callCount:number = 1;
    callLimit:number = 8;
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
      private _geoLocation:GeoLocation,
      private _partnerData: PartnerHeader,
      public ngZone:NgZone){

        // needs to get Geolocation first
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
          if(this.partnerID != null){
            this.getPartnerHeader();
          }else{
            this.getGeoLocation();
          }
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
      this._deepDiveData.getCarouselData(this.carouselData, '25', '1', this.geoLocation, (carData)=>{
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
      var state = this.geoLocation.toUpperCase(); //required from AI to have the call of state come in UPPERCASE
      this._deepDiveData.getRecArticleData(state, '1', '1')
          .subscribe(data => {
            this.recommendationData = this._deepDiveData.transformToRecArticles(data);
          });
    }

    getTileStackData(){
      this._deepDiveData.getDeepDiveBatchService(this.callLimit, 2, this.geoLocation)
          .subscribe(data => {
            this.tilestackData = this._deepDiveData.transformTileStack(data);
          });
    }

    getFirstArticleStackData(){
      this._deepDiveData.getDeepDiveBatchService(this.callLimit, 1, this.geoLocation)
          .subscribe(data => {
            this.firstStackTop = this._deepDiveData.transformToArticleStack(data);
            this.firstStackRow = this._deepDiveData.transformToArticleRow(data);
          });
    }
    getSecArticleStackData(){
      this._deepDiveData.getDeepDiveBatchService(this.callLimit, 2, this.geoLocation)
          .subscribe(data => {
            this.secStackTop = this._deepDiveData.transformToArticleStack(data);
            this.secStackRow = this._deepDiveData.transformToArticleRow(data);
          });
    }
    getThirdArticleStackData(){
      this._deepDiveData.getDeepDiveBatchService(this.callLimit, 3, this.geoLocation)
          .subscribe(data => {
            this.thirdStackTop = this._deepDiveData.transformToArticleStack(data);
            this.thirdStackRow = this._deepDiveData.transformToArticleRow(data);
          });
    }

    getPartnerHeader(){//Since it we are receiving
      if(this.partnerID != null){
        this._partnerData.getPartnerData(this.partnerID)
        .subscribe(
          partnerScript => {
            this.partnerData = partnerScript;
            //super long way from partner script to get location using geo location api
            var state = partnerScript['results']['location']['realestate']['location']['city'][0].state;
            state = state.toLowerCase();
            this.geoLocation = state;
            this.callModules();
          }
        );
      }else{
        this.getGeoLocation();
      }
    }

    //Subscribe to getGeoLocation in geo-location.service.ts. On Success call getNearByCities function.
    getGeoLocation() {
      var defaultState = 'ca';
        this._geoLocation.getGeoLocation()
            .subscribe(
                geoLocationData => {
                  this.geoLocation = geoLocationData[0].state;
                  this.geoLocation = this.geoLocation.toLowerCase();
                  this.callModules();

                },
                err => {
                  this.geoLocation = defaultState;
                  this.callModules();
                }
            );
    }

    callModules(){
      this.getRecommendationData();
      this.checkSize();
      this.getBoxScores(this.dateParam);
      this.getDataCarousel();
      this.getFirstArticleStackData();
      this.getSecArticleStackData();
      this.getThirdArticleStackData();
      this.getSideScroll();
      this.getTileStackData();
    }

}
