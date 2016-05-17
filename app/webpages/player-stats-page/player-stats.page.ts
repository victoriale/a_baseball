import {Component, OnInit, Input} from 'angular2/core';
import {RouteParams} from "angular2/router";
import {BackTabComponent} from "../../components/backtab/backtab.component";
import {TitleComponent, TitleInputData} from "../../components/title/title.component";
import {CircleImageData} from "../../components/images/image-data";
import {PlayerStatsComponent} from "../../components/player-stats/player-stats.component";
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';
import {DropdownComponent} from '../../components/dropdown/dropdown.component';

import {PlayerStatsService} from '../../services/player-stats.service';
import {ProfileHeaderService} from '../../services/profile-header.service';
import {MLBPlayerStatsTableData, MLBPlayerStatsTableModel} from '../../services/player-stats.data';

import {Division, Conference, MLBPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';

@Component({
    selector: 'Player-stats-page',
    templateUrl: './app/webpages/player-stats-page/player-stats.page.html',

    directives: [BackTabComponent, TitleComponent, PlayerStatsComponent, LoadingComponent, ErrorComponent, DropdownComponent],
    providers: [ProfileHeaderService, PlayerStatsService],
})

export class PlayerStatsPage implements OnInit {
  public tabs: Array<MLBPlayerStatsTableData>;  
    
  public pageParams: MLBPageParameters = {}
  
  public titleData: TitleInputData = {
    imageURL: "/app/public/profile_placeholder.png",
    text1: "Last Updated: [date]",
    text2: "United States",
    text3: "Player Stats",
    icon: "fa fa-map-marker"
  }
  
  hasError: boolean = false;
  lastUpdatedDateSet:boolean = false;
  
  constructor(private _params: RouteParams,
              private _profileService: ProfileHeaderService,
              private _statsService: PlayerStatsService) {    
    var teamId = _params.get("teamId");
    if ( teamId !== null && teamId !== undefined ) {
      this.pageParams.teamId = Number(teamId);
    }
  }
  
  ngOnInit() {    
    var pageTitle = this._statsService.getPageTitle(this.pageParams);
    if ( this.pageParams.teamId ) {      
      this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
        data => {
          this.pageParams = data.pageParams; 
          this.setupTitleData(data.fullProfileImageUrl);
          this.tabs = this._statsService.initializeAllTabs(this.pageParams);
        },
        err => {
          console.log("Error getting player stats data for " + this.pageParams.teamId + ": " + err);
        }
      );
    }
    else {
      this.setupTitleData();
    }
  }
  
  private setupTitleData(imageUrl?: string) {    
    var title = this._statsService.getPageTitle(this.pageParams);
    this.titleData = {
      imageURL: imageUrl,
      text1: "Last Updated: [date]",
      text2: "United States",
      text3: title,
      icon: "fa fa-map-marker"
    };
  }

  private setupPlayerStatsData() {
    this.tabs = this._statsService.initializeAllTabs(this.pageParams);
  }
  
  private playerStatsTabSelected(tab: MLBPlayerStatsTableData) {
    var hasData = false;
    if ( tab ) {
      var table = tab.seasonTableData[tab.selectedSeasonId];
      if ( table ) {     
        hasData = true;
        tab.tableData = table;
      }
      else {
        tab.tableData = null;
      }
    }    
    
    if ( !hasData ) {
      this._statsService.getTabData(tab, this.pageParams, tab.selectedSeasonId)
        .subscribe(data => { 
          this.getLastUpdatedDateForPage(data);
          tab.seasonTableData[tab.selectedSeasonId] = data;
          tab.tableData = data;
        },
        err => {
          console.log("Error getting player stats data");
          this.hasError = true;
        });
    }
  }
  
  private getLastUpdatedDateForPage(table: MLBPlayerStatsTableModel) {           
    //Getting the first 'lastUpdatedDate' listed in the StandingsData
    if ( !this.lastUpdatedDateSet && table && table.rows && table.rows.length > 0 ) {
      var lastUpdated = table.rows[0].lastUpdate;
      this.titleData.text1 = "Last Updated: " + GlobalFunctions.formatUpdatedDate(lastUpdated, false); 
      this.lastUpdatedDateSet = true;
    }
  }
}
