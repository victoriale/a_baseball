import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {MLBPageParameters} from '../../global/global-interface';

import {AboutUsModule} from '../../modules/about-us/about-us.module';
import {LikeUs} from "../../modules/likeus/likeus.module";
import {DYKModule} from "../../modules/dyk/dyk.module";
import {FAQModule} from "../../modules/faq/faq.module";
import {TwitterModule} from "../../modules/twitter/twitter.module";
import {ComparisonModule} from '../../modules/comparison/comparison.module';
import {CommentModule} from '../../modules/comment/comment.module';

import {StandingsModule, StandingsModuleData} from '../../modules/standings/standings.module';
import {MLBStandingsTabData} from '../../services/standings.data';
import {StandingsService} from '../../services/standings.service';

import {ProfileHeaderData, ProfileHeaderModule} from '../../modules/profile-header/profile-header.module';
import {ProfileHeaderService} from '../../services/profile-header.service';

import {ShareModule} from '../../modules/share/share.module';
import {ShareModuleInput} from '../../modules/share/share.module';

import {HeadlineComponent} from '../../components/headline/headline.component';

import {NewsModule} from '../../modules/news/news.module';
import {SchedulesModule} from '../../modules/schedules/schedules.module';
import {BoxScoresModule} from '../../modules/box-scores/box-scores.module';

@Component({
    selector: 'Player-page',
    templateUrl: './app/webpages/player-page/player.page.html',
    directives: [
        SchedulesModule,
        BoxScoresModule, 
        ProfileHeaderModule,
        StandingsModule,
        HeadlineComponent, 
        CommentModule, 
        DYKModule, 
        FAQModule, 
        LikeUs, 
        TwitterModule, 
        ComparisonModule,
        NewsModule,
        AboutUsModule],
    providers: [StandingsService,ProfileHeaderService],
})

export class PlayerPage implements OnInit {
    public shareModuleInput: ShareModuleInput = {
        imageUrl: './app/public/mainLogo.png'
    };

    pageParams: MLBPageParameters;

    standingsData: StandingsModuleData;

    profileHeaderData: ProfileHeaderData;

    constructor(
        private _params: RouteParams,
        private _standingsService: StandingsService,
        private _profileService: ProfileHeaderService) {
            
        this.pageParams = {
            playerId: Number(_params.get("playerId"))
        };
    }
  
    ngOnInit() {    
        this.setupProfileData();
    }
  
  private setupProfileData() {
    this._profileService.getPlayerProfile(this.pageParams.playerId).subscribe(
      data => {
        this.pageParams = data.pageParams;
        this.profileHeaderData = this._profileService.convertToPlayerProfileHeader(data);
        this.standingsData = this._standingsService.loadAllTabsForModule(this.pageParams);
      },
      err => {
        console.log("Error getting player profile data for " + this.pageParams.playerId + ": " + err);
      }
    );
  }
  
  private standingsTabSelected(tab: MLBStandingsTabData) {
    if ( tab && (!tab.sections || tab.sections.length == 0) ) {
      this._standingsService.getTabData(tab, this.pageParams, 5)//only show 5 rows in the module      
        .subscribe(data => tab.sections = data,
        err => {
          console.log("Error getting standings data");
        });
    }
  }
}
