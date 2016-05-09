import {Component, OnInit, Input} from 'angular2/core';
import {RouteParams} from "angular2/router";
import {BackTabComponent} from "../../components/backtab/backtab.component";
import {TitleComponent, TitleInputData} from "../../components/title/title.component";
import {CircleImageData} from "../../components/images/image-data";
import {PlayerStatsComponent} from "../../components/player-stats/player-stats.component";
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';

import {PlayerStatsService} from '../../services/player-stats.service';
import {ProfileHeaderService} from '../../services/profile-header.service';
import {MLBPlayerStatsTableData} from '../../services/player-stats.data';

import {Division, Conference, MLBPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';

@Component({
    selector: 'PlayerStats-page',
    templateUrl: './app/webpages/player-stats-page/player-stats.page.html',

    directives: [BackTabComponent, TitleComponent, PlayerStatsComponent, LoadingComponent, ErrorComponent],
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
  
  public hasError: boolean = false;
  
  constructor(private _params: RouteParams,
              private _profileService: ProfileHeaderService,
              private _statsService: PlayerStatsService, 
              private _globalFunctions: GlobalFunctions, 
              private _mlbFunctions: MLBGlobalFunctions) {
    //this.pageParams.teamId = Number(_params["teamId"]);
    this.pageParams.teamId = 2796;
  }
  
  ngOnInit() {
    
    this.pageParams.teamName = "Sample Team";
    this.titleData.text3 = "Player Stats - " + "Sample Team";
    this.setupPlayerStatsData();
    // this._profileService.getTeamProfile(this.pageParams.teamId)
    //   .subscribe(data => {
    //     this.pageParams.teamName = data.teamName;
    //     this.titleData.text3 = "Player Stats - " + data.teamName;
    //     this.setupPlayerStatsData();
    //   },
    //   err => {
    //     console.log("Error getting team profile data");
    //   })
  }

  private setupPlayerStatsData() {
    let self = this;
    self._statsService.loadAllTabs(this.pageParams)
      .subscribe(data => { 
        console.log("all tabs loaded for player stats");
        this.tabs = data;
      },
      err => {
        console.log("Error getting player stats data");
        this.hasError = true;
      });
  }
}
