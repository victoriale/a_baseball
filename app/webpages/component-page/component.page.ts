import {Component, OnInit} from '@angular/core';
import {SeasonStatsModule} from '../../modules/season-stats/season-stats.module';
import {DraftHistoryModule} from '../../modules/draft-history/draft-history.module';
import {BoxScoresModule} from '../../modules/box-scores/box-scores.module';
import {AboutUsModule} from '../../modules/about-us/about-us.module';
import {NewsModule} from '../../modules/news/news.module';
import {ShareButtonComponent} from '../../components/share-button/share-button.component';
import {ListOfListsModule} from "../../modules/list-of-lists/list-of-lists.module";
import {SchedulesCarousel} from '../../components/carousels/schedules-carousel/schedules-carousel.component';
import {Carousel} from '../../components/carousels/carousel.component';
import {SliderCarousel} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {SchedulesComponent} from '../../components/schedules/schedules.component';
import {SchedulesModule} from '../../modules/schedules/schedules.module';

import {StandingsModuleData, StandingsModule} from '../../modules/standings/standings.module';
import {MLBStandingsTabData} from '../../services/standings.data';
import {StandingsService} from '../../services/standings.service';
import {TeamRosterModule} from '../../modules/team-roster/team-roster.module';
import {RosterService} from '../../services/roster.service';

import {ProfileHeaderData, ProfileHeaderModule} from '../../modules/profile-header/profile-header.module';
import {ProfileHeaderService} from '../../services/profile-header.service';
import {Division, Conference, MLBPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';

import {FAQModule} from "../../modules/faq/faq.module";
import {DYKModule} from "../../modules/dyk/dyk.module";

import {ComparisonModule, ComparisonModuleData} from '../../modules/comparison/comparison.module';
import {ComparisonStatsService} from '../../services/comparison-stats.service';

import {PlayerStatsModule, PlayerStatsModuleData} from '../../modules/player-stats/player-stats.module';
import {PlayerStatsService} from '../../services/player-stats.service'
import {MLBPlayerStatsTableData} from '../../services/player-stats.data'

@Component({
    selector: 'Component-page',
    templateUrl: './app/webpages/component-page/component.page.html',
    directives: [
      SliderCarousel,
      NewsModule,
      Carousel,
      SchedulesCarousel,
      BoxScoresModule,
      ShareButtonComponent,
      TeamRosterModule,
      ComparisonModule,
      DraftHistoryModule,
      ListOfListsModule,
      SchedulesModule,
      SeasonStatsModule,
      AboutUsModule,
      ProfileHeaderModule,
      StandingsModule,
      PlayerStatsModule,
      SchedulesComponent,
      FAQModule,
      DYKModule
    ],
    providers: [StandingsService, RosterService, ProfileHeaderService, ComparisonStatsService, PlayerStatsService]
})

export class ComponentPage implements OnInit {
  pageParams: MLBPageParameters;
  playerProfileHeaderData: ProfileHeaderData;
  teamProfileHeaderData: ProfileHeaderData;
  comparisonModuleData: ComparisonModuleData;
  playerStatsData: PlayerStatsModuleData;

  constructor(
    private _rosterService: RosterService,
    private _standingsService: StandingsService,
    private _profileService: ProfileHeaderService,
    private _playerStatsService: PlayerStatsService,
    private _comparisonService: ComparisonStatsService,
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
    // this.setupRosterData();//ROSTER DATA
  }

  private setupProfileData() {
    // this._profileService.getPlayerProfile(this.pageParams.playerId).subscribe(
    //   data => {
    //     this.playerProfileHeaderData = this._profileService.convertToPlayerProfileHeader(data)
    //   },
    //   err => {
    //     console.log("Error getting player profile data for " + this.pageParams.playerId + ": " + err);
    //   }
    // );
    this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
      data => {
        this.teamProfileHeaderData = this._profileService.convertToTeamProfileHeader(data)
        this.setupComparisonData();
        this.playerStatsData = this._playerStatsService.loadAllTabsForModule(this.pageParams.teamId, data.teamName);
      },
      err => {
        console.log("Error getting team profile data for " + this.pageParams.teamId + ": " + err);
      }
    );
  }
    
  private setupComparisonData() {
      this._comparisonService.getInitialPlayerStats(this.pageParams).subscribe(
          data => {
              this.comparisonModuleData = data;
          },
          err => {
              console.log("Error getting comparison data for "+ this.pageParams.teamId + ": " + err);
          });
  }

  private playerStatsTabSelected(tab: MLBPlayerStatsTableData) {
        //only show 4 rows in the module
      this._playerStatsService.getStatsTabData(tab, this.pageParams, data => {}, 4);
  }
}
