import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {Division, Conference, MLBPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';

import {DraftHistoryModule} from '../../modules/draft-history/draft-history.module';

import {StandingsModuleData, StandingsModule} from '../../modules/standings/standings.module';
import {MLBStandingsTabData} from '../../services/standings.data';
import {StandingsService} from '../../services/standings.service';

import {ProfileHeaderData, ProfileHeaderModule} from '../../modules/profile-header/profile-header.module';
import {ProfileHeaderService} from '../../services/profile-header.service';

import {AboutUsModule} from '../../modules/about-us/about-us.module';
import {ArticlesModule} from "../../modules/articles/articles.module";
import {ListOfListsModule} from "../../modules/list-of-lists/list-of-lists.module";
import {TeamRosterModule} from '../../modules/team-roster/team-roster.module';
import {RosterService} from '../../services/roster.service';
import {ShareModule, ShareModuleInput} from '../../modules/share/share.module';
import {LikeUs} from "../../modules/likeus/likeus.module";
import {CommentModule} from '../../modules/comment/comment.module';
import {ListOfListsData} from "../../modules/list-of-lists/list-of-lists.module";
import {ListOfListsService} from "../../services/list-of-lists.service";

@Component({
    selector: 'Design-page',
    templateUrl: './app/webpages/design-page/design.page.html',
    directives: [DraftHistoryModule, TeamRosterModule, AboutUsModule, StandingsModule, ProfileHeaderModule, ArticlesModule, ListOfListsModule, ShareModule, LikeUs, CommentModule],
    providers: [StandingsService, ProfileHeaderService, RosterService, ListOfListsService]
})

export class DesignPage implements OnInit {
  pageParams: MLBPageParameters;
  standingsData: StandingsModuleData;
  playerProfileHeaderData: ProfileHeaderData;
  teamProfileHeaderData: ProfileHeaderData;
  leagueProfileHeaderData: ProfileHeaderData;
  listOfListsData: ListOfListsData;
  profileType: string;
  lolDetailedDataArray : any;
  lolDataArray : boolean;
  lolCarouselDataArray : any;

  public shareModuleInput: ShareModuleInput = {
      imageUrl: './app/public/mainLogo.png'
  };

  constructor(
    private _params: RouteParams,
    private _standingsService: StandingsService,
    private _profileService: ProfileHeaderService,
    private _lolService: ListOfListsService,
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
    this.setupLolData();
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
        this.pageParams = data.pageParams;
        this.teamProfileHeaderData = this._profileService.convertToTeamProfileHeader(data);        
        this.standingsData = this._standingsService.loadAllTabsForModule(this.pageParams);
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
  
  private standingsTabSelected(tab: MLBStandingsTabData) {
    if ( tab && (!tab.sections || tab.sections.length == 0) ) {
      this._standingsService.getTabData(tab, this.pageParams, 5)//only show 5 rows in the module      
        .subscribe(data => tab.sections = data,
        err => {
          console.log("Error getting standings data");
        });
    }
  }

  private setupLolData() {
    //  getListOfListsService(version, type?, scope?, conference?, count?, page?){
    let params = {
      id : "2799",
      limit : 4,
      pageNum : 1,
      type : "team"
    }
    this._lolService.getListOfListsService(params, "module")
      .subscribe(
        listOfListsData => {
          this.listOfListsData = listOfListsData;
        },
        err => {
          console.log('Error: listOfListsData API: ', err);
        }
      );
  }

}
