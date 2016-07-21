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

import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from "../../global/global-functions";
import {Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';

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
      CarouselDiveModule
    ],
    providers: [BoxScoresService,SchedulesService,DeepDiveService],
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

    sideScrollData: any;
    ssMax:number = 7;
    ssCount:number = 0;

    //for carousel
    carouselData: any;
​
    //for article-stack
    stackrowsData: any;
    articlestackData: any;

    private isHomeRunZone: boolean = false;

    constructor(
      private _router:Router,
      private _deepDiveData:DeepDiveService,
      private _boxScores:BoxScoresService,
      private _schedulesService:SchedulesService)
      {
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
    private getSchedulesData(){
      this._schedulesService.setupSlideScroll(this.sideScrollData, 'league', 'pre-event', 20, 1, (sideScrollData) => {
        if(this.sideScrollData == null){
          //if the data comes back as null then set the newly defiend data as the returned data.
          this.sideScrollData = sideScrollData;
          this.sideScrollData.length += 6;//so that it can reach the end of the screen
        }else{
          //if there is already data inside the variable the push in the next set of data
          this.sideScrollData.push(sideScrollData);
        }
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
    private getDataCarousel() {
      this._deepDiveData.getCarouselData(this.carouselData, (carData)=>{
        this.carouselData = carData;
​
      })
    }
​
// private getDataStackRows() {
//       this._deepDiveData.getStackRowsData(this.stackrowsData, (data)=>{
//         this.stackrowsData = data;
//         console.log('stack rows',this.stackrowsData);
//       })
//     }

private getDataStackRows() {
  this._deepDiveData.getDeepDiveService()
    .subscribe(data => {
      this.stackrowsData = this._deepDiveData.stackrowsTransformData(data);
      console.log(this.stackrowsData);
    });


}
private getDataArticleStack() {
  this._deepDiveData.getDeepDiveService()
    .subscribe(data => {
      this.articlestackData = this._deepDiveData.articlestackTransformData(data);
      console.log(this.articlestackData);
    });


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
    ngOnInit() {
      this.checkSize();
      this.getBoxScores(this.dateParam);
      this.getSchedulesData();
      this.getDataCarousel();
      this.getDataStackRows();

    }

    ngDoCheck(){

    }

}
