import {Component, OnInit} from 'angular2/core';
import {ComparisonModule} from '../../modules/comparison/comparison.module';
import {SeasonStatsModule} from '../../modules/season-stats/season-stats.module';
import {DraftHistoryModule} from '../../modules/draft-history/draft-history.module';
import {BoxScoresModule} from '../../modules/box-scores/box-scores.module';
import {SchedulesModule} from '../../modules/schedules/schedules.module';
import {TeamRosterModule} from '../../modules/team-roster/team-roster.module';
import {AboutUsModule} from '../../modules/about-us/about-us.module';
import {ShareButtonComponent} from '../../components/share-button/share-button.component';
import {Search} from '../../components/search/search.component';
import {SchedulesCarousel} from '../../components/carousels/schedules-carousel/schedules-carousel.component';
import {Carousel} from '../../components/carousels/carousel.component';
import {SliderCarousel} from '../../components/carousels/slider-carousel/slider-carousel.component';

import {StandingsModule, StandingsModuleData} from '../../modules/standings/standings.module';
import {StandingsService} from '../../services/standings.service';

import {ProfileHeaderData, ProfileHeaderModule} from '../../modules/profile-header/profile-header.module';
import {ProfileHeaderService} from '../../services/profile-header.service';

import {Division, Conference, MLBPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';

@Component({
    selector: 'Component-page',
    templateUrl: './app/webpages/component-page/component.page.html',
    directives: [
      SliderCarousel,
      Carousel,
      SchedulesCarousel,
      BoxScoresModule,
      ShareButtonComponent,
      TeamRosterModule,
      ComparisonModule,
      DraftHistoryModule,
      SchedulesModule,
      SeasonStatsModule,
      Search,
      AboutUsModule,
      ProfileHeaderModule,
      StandingsModule
    ],
    providers: [StandingsService, ProfileHeaderService]
})

export class ComponentPage implements OnInit {
  pageParams: MLBPageParameters;
  standingsData: StandingsModuleData;
  playerProfileHeaderData: ProfileHeaderData;
  teamProfileHeaderData: ProfileHeaderData;
  
  constructor(
    private _standingsService: StandingsService,
    private _profileService: ProfileHeaderService, 
    private _globalFunctions: GlobalFunctions, 
    private _mlbFunctions: MLBGlobalFunctions) {     
    //TODO: Pull from URL
    if ( this.pageParams === undefined || this.pageParams === null ) {
      this.pageParams = {
        division: Division.east,
        conference: Conference.american,
        playerId: 95041,
        teamId: 2796
      };
    }
  }
  
  ngOnInit() {    
    this.setupProfileData();
    this.setupStandingsData();
  }
  
  private setupProfileData() {
    this._profileService.getPlayerProfile(this.pageParams.playerId).subscribe(
      data => {
        this.playerProfileHeaderData = this._profileService.convertToPlayerProfileHeader(data)
      },
      err => {
        console.log("Error getting player profile data for " + this.pageParams.playerId + ": " + err);
      }
    );
    this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
      data => {
        this.teamProfileHeaderData = this._profileService.convertToTeamProfileHeader(data)
      },
      err => {
        console.log("Error getting team profile data for " + this.pageParams.teamId + ": " + err);
      }
    );
  }

  private setupStandingsData() {       
    let self = this;
    self._standingsService.loadAllTabs(this.pageParams, 5) //only show 5 rows in the module
      .subscribe(data => { 
        this.standingsData = {
          moduleTitle: self._standingsService.getModuleTitle(this.pageParams),
          pageRouterLink: self._standingsService.getLinkToPage(this.pageParams),
          tabs: data
        };
      },
      err => {
        console.log("Error getting standings data");
      });
  }
}
