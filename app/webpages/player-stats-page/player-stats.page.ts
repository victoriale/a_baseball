import {Component, OnInit, Input} from '@angular/core';
import {RouteParams} from "@angular/router-deprecated";
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
      
    // Scroll page to top to fix routerLink bug
    window.scrollTo(0, 0);
  }
  
  ngOnInit() {    
    if ( this.pageParams.teamId ) {      
      this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
        data => {
          this.pageParams = data.pageParams; 
          this.setupTitleData(data.teamName, data.fullProfileImageUrl);
          this.tabs = this._statsService.initializeAllTabs(data.teamName);
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
  
  private setupTitleData(teamName?: string, imageUrl?: string) {    
    var title = this._statsService.getPageTitle(teamName);
    this.titleData = {
      imageURL: imageUrl,
      text1: "Last Updated: [date]",
      text2: "United States",
      text3: title,
      icon: "fa fa-map-marker"
    };
  }
  
  private playerStatsTabSelected(tab: MLBPlayerStatsTableData) {
    tab.isLoaded = false;
    this._statsService.getStatsTabData(tab, this.pageParams, data => {
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
