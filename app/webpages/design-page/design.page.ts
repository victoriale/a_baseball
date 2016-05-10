import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {Division, Conference, MLBPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';

import {DraftHistoryModule} from '../../modules/draft-history/draft-history.module';

import {StandingsModuleData, StandingsModule} from '../../modules/standings/standings.module';
import {StandingsService} from '../../services/standings.service';
import {MLBStandingsTableModel, MLBStandingsTableData} from '../../services/standings.data';

import {ProfileHeaderData, ProfileHeaderModule} from '../../modules/profile-header/profile-header.module';
import {ProfileHeaderService} from '../../services/profile-header.service';

import {AboutUsModule} from '../../modules/about-us/about-us.module';

@Component({
    selector: 'Design-page',
    templateUrl: './app/webpages/design-page/design.page.html',
    directives: [DraftHistoryModule, AboutUsModule, StandingsModule, ProfileHeaderModule],
    providers: [StandingsService, ProfileHeaderService]
})

export class DesignPage implements OnInit {
  pageParams: MLBPageParameters;
  standingsData: StandingsModuleData;
  playerProfileHeaderData: ProfileHeaderData;
  teamProfileHeaderData: ProfileHeaderData;
  leagueProfileHeaderData: ProfileHeaderData;

  constructor(
    private _params: RouteParams,
    private _standingsService: StandingsService,
    private _profileService: ProfileHeaderService,
    private _globalFunctions: GlobalFunctions,
    private _mlbFunctions: MLBGlobalFunctions) {
      
    if ( this.pageParams === undefined || this.pageParams === null ) {
      this.pageParams = {
        division: Division.east,
        conference: Conference.american,
        playerId: 95041,
        teamId: Number(_params.get("teamId"))
      };
    }
  }

  ngOnInit() {
    this.setupProfileData();
  }

  private setupProfileData() {
    this._profileService.getPlayerProfile(this.pageParams.playerId).subscribe(
      data => {
        this.playerProfileHeaderData = this._profileService.convertToPlayerProfileHeader(data);
      },
      err => {
        console.log("Error getting player profile data for " + this.pageParams.playerId + ": " + err);
      }
    );
    this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
      data => {
        this.pageParams.teamName = data.stats.teamName;
        this.pageParams.division = Division[data.stats.division.name.toLowerCase()];
        this.pageParams.conference = Conference[data.stats.conference.name.toLowerCase()];
        this.teamProfileHeaderData = this._profileService.convertToTeamProfileHeader(data);
        this.setupStandingsData();
      },
      err => {
        console.log("Error getting team profile data for " + this.pageParams.teamId + ": " + err);
      }
    );
    this._profileService.getMLBProfile().subscribe(
      data => {
        this.leagueProfileHeaderData = this._profileService.convertToLeagueProfileHeader(data);
      },
      err => {
        console.log("Error getting league profile data: " + err);
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
        console.log("Error getting standings data: " + err);
      });
  }
}
