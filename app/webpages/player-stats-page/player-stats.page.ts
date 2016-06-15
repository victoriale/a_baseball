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
import {SidekickWrapper} from "../../components/sidekick-wrapper/sidekick-wrapper.component";

@Component({
    selector: 'Player-stats-page',
    templateUrl: './app/webpages/player-stats-page/player-stats.page.html',

    directives: [SidekickWrapper, BackTabComponent, TitleComponent, PlayerStatsComponent, LoadingComponent, ErrorComponent, DropdownComponent],
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
  
  profileLoaded: boolean = false;
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
    if ( this.pageParams.teamId ) {      
      this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
        data => {
          this.profileLoaded = true;
          this.pageParams = data.pageParams; 
          this.setupTitleData(data.teamName, data.fullProfileImageUrl);
          this.tabs = this._statsService.initializeAllTabs(data.teamName);
        },
        err => {
          this.hasError = true;
          console.log("Error getting player stats data for " + this.pageParams.teamId + ": " + err);
        }
      );
    }
    else {
      this.setupTitleData();
    }
  }
  
  private setupTitleData(teamName?: string, imageUrl?: string) {    
    var title = this._statsService.getPageTitle(teamName);
    this.titleData = {
      imageURL: imageUrl,
      text1: "",
      text2: "United States",
      text3: title,
      icon: "fa fa-map-marker"
    };
  }
  
  private playerStatsTabSelected(tabData: Array<any>) {
    this._statsService.getStatsTabData(tabData, this.pageParams, data => {
        this.getLastUpdatedDateForPage(data);        
      });
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
