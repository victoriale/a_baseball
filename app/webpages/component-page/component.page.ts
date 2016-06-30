import {Component, OnInit} from '@angular/core';

import {ProfileHeaderData, ProfileHeaderModule} from '../../modules/profile-header/profile-header.module';
import {ProfileHeaderService} from '../../services/profile-header.service';
import {Division, Conference, MLBPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';

import {ComparisonModule, ComparisonModuleData} from '../../modules/comparison/comparison.module';
import {ComparisonStatsService} from '../../services/comparison-stats.service';

import {PlayerStatsModule, PlayerStatsModuleData} from '../../modules/player-stats/player-stats.module';
import {PlayerStatsService} from '../../services/player-stats.service'
import {MLBPlayerStatsTableData} from '../../services/player-stats.data'

@Component({
    selector: 'Component-page',
    templateUrl: './app/webpages/component-page/component.page.html',
    directives: [
      ComparisonModule,
      ProfileHeaderModule,
      PlayerStatsModule,
    ],
    providers: [ProfileHeaderService, ComparisonStatsService, PlayerStatsService]
})

export class ComponentPage implements OnInit {
  pageParams: MLBPageParameters;
  teamProfileHeaderData: ProfileHeaderData;
  comparisonModuleData: ComparisonModuleData;
  playerStatsData: PlayerStatsModuleData;

  constructor(
    private _profileService: ProfileHeaderService,
    private _playerStatsService: PlayerStatsService,
    private _comparisonService: ComparisonStatsService) {
    //TODO: Pull from URL
    if ( this.pageParams === undefined || this.pageParams === null ) {
      this.pageParams = {
        division: Division.east,
        conference: Conference.american,
        playerId: 96889,
        teamId: 2796
      };
    }
  }

  ngOnInit() {
    this.setupProfileData();
  }

  private setupProfileData() {
    this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
      data => {
        this.teamProfileHeaderData = this._profileService.convertToTeamProfileHeader(data)
        this.setupComparisonData();
        this.playerStatsData = this._playerStatsService.loadAllTabsForModule(this.pageParams.teamId, data.teamName, false);
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
              console.log("Error getting comparison data for "+ this.pageParams.teamId, err);
          });
  }

  private playerStatsTabSelected(tabData: Array<any>) {
        //only show 4 rows in the module
      this._playerStatsService.getStatsTabData(tabData, this.pageParams, data => {}, 4);
  }
}
