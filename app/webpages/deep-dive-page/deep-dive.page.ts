import {Component, OnInit, Input} from '@angular/core';
import {TileStackModule} from '../../modules/tile-stack/tile-stack.module';
import {ArticleStackModule} from '../../modules/article-stack/article-stack.module';
import {VideoStackModule} from '../../modules/video-stack/video-stack.module';

import {SidekickWrapper} from '../../components/sidekick-wrapper/sidekick-wrapper.component';

import {WidgetModule} from '../../modules/widget/widget.module';
import {SideScrollSchedule} from '../../modules/side-scroll-schedules/side-scroll-schedules.module';

import {BoxScoresModule} from '../../modules/box-scores/box-scores.module';
import {BoxScoresService} from '../../services/box-scores.service';

import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from "../../global/global-functions";
import {Router} from '@angular/router-deprecated';

//window declarions of global functions from library scripts
declare var moment;

@Component({
    selector: 'deep-dive-page',
    templateUrl: './app/webpages/deep-dive-page/deep-dive.page.html',

    directives: [
      SidekickWrapper,
      WidgetModule,
      SideScrollSchedule,
      BoxScoresModule,
      TileStackModule,
      ArticleStackModule,
      VideoStackModule
    ],
    providers: [BoxScoresService],
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
    constructor(
      private _router:Router,
      private _boxScores:BoxScoresService
    ) {
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
      });

      window.onresize = (e) =>
      {
        var width = window.outerWidth;
        var height = window.outerHeight;

        // console.log(width, height);
        if(width < 640){
          this.maxHeight = 'auto';
          this.scroll = false;
        }else if(width >= 640){
          this.maxHeight = 650;
          this.scroll = true;
        }
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
            console.log(this.boxScoresData);
        })
    }
    ngOnInit() {
        this.getBoxScores(this.dateParam);
    }

    ngDoCheck(){

    }

}
