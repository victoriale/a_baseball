import {Component, OnInit, Input} from 'angular2/core';
import {RouteParams} from "angular2/router";
import {BackTabComponent} from "../../components/backtab/backtab.component";
import {TitleComponent, TitleInputData} from "../../components/title/title.component";
import {CircleImageData} from "../../components/images/image-data";
import {StandingsComponent} from "../../components/standings/standings.component";
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';

import {ProfileHeaderService} from '../../services/profile-header.service';
import {StandingsService} from '../../services/standings.service';
import {MLBStandingsTabData} from '../../services/standings.data';

import {Division, Conference, MLBPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';

@Component({
    selector: 'Standings-page',
    templateUrl: './app/webpages/standings-page/standings.page.html',

    directives: [BackTabComponent, TitleComponent, StandingsComponent, LoadingComponent, ErrorComponent],
    providers: [StandingsService, ProfileHeaderService],
})

export class StandingsPage implements OnInit {
  public tabs: Array<MLBStandingsTabData>;
    
  public pageParams: MLBPageParameters = {}
  
  public hasError: boolean = false;
  
  public titleData: TitleInputData;
  
  constructor(private _params: RouteParams,
              private _profileService: ProfileHeaderService,
              private _standingsService: StandingsService, 
              private _globalFunctions: GlobalFunctions, 
              private _mlbFunctions: MLBGlobalFunctions) {
    
    var type = _params.get("type");
    if ( type !== null && type !== undefined ) {
      type = type.toLowerCase();
      this.pageParams.conference = Conference[type];
    }
    
    var teamId = _params.get("teamId");
    if ( type == "team" && teamId !== null && teamId !== undefined ) {
      this.pageParams.teamId = Number(teamId);
    }
    
  }
  
  ngOnInit() {    
    var pageTitle = this._standingsService.getPageTitle(this.pageParams);
    if ( this.pageParams.teamId ) {      
      this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
        data => {
          this.pageParams = data.pageParams; 
          this.setupStandingsData(data.fullProfileImageUrl);
        },
        err => {
          console.log("Error getting team profile data for " + this.pageParams.teamId + ": " + err);
        }
      );
    }
    else {
      this.setupStandingsData();      
    }
  }
  
  private setupTitleData(title: string, imageUrl?: string) {
    this.titleData = {
      imageURL: imageUrl,
      text1: "Last Updated: [date]",
      text2: "United States",
      text3: title,
      icon: "fa fa-map-marker"
    };
  }

  private setupStandingsData(imageURL?: string) {    
    var title = this._standingsService.getPageTitle(this.pageParams);
    this.setupTitleData(title, imageURL);
    
    this._standingsService.loadAllTabs(this.pageParams)
      .subscribe(data => {        
        //Getting the first 'lastUpdatedDate' listed in the StandingsData
        if ( data && data.length > 0 && 
          data[0].sections && data[0].sections.length > 0 &&
          data[0].sections[0].tableData && data[0].sections[0].tableData.rows &&
          data[0].sections[0].tableData.rows.length > 0 ) {
            var lastUpdated = data[0].sections[0].tableData.rows[0].lastUpdated;
            this.titleData.text1 = "Last Updated: " + GlobalFunctions.formatUpdatedDate(lastUpdated, false); 
        }
        this.tabs = data;
      },
      err => {
        console.log("Error getting standings data: " + err);
        this.hasError = true;
      });
  }
}
