import {Component, OnInit, Input} from '@angular/core';
import {RouteParams} from "@angular/router-deprecated";
import {BackTabComponent} from "../../components/backtab/backtab.component";
import {TitleComponent, TitleInputData} from "../../components/title/title.component";
import {CircleImageData} from "../../components/images/image-data";
import {StandingsComponent} from "../../components/standings/standings.component";
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';

import {ProfileHeaderService} from '../../services/profile-header.service';
import {StandingsService} from '../../services/standings.service';
import {MLBStandingsTabData,MLBStandingsTableData} from '../../services/standings.data';
import {Division, Conference, MLBPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';

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
  
  constructor(private _route: RouteParams,
              private _profileService: ProfileHeaderService,
              private _standingsService: StandingsService) {
    
    var type = _route.get("type");
    if ( type !== null && type !== undefined ) {
      type = type.toLowerCase();
      this.pageParams.conference = Conference[type];
    }
    
    var teamId = _route.get("teamId");
    if ( type == "team" && teamId !== null && teamId !== undefined ) {
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
          this.tabs = this._standingsService.initializeAllTabs(this.pageParams);
        },
        err => {
          console.log("Error getting team profile data for " + this.pageParams.teamId + ": " + err);
        }
      );
    }
    else {
      this.setupTitleData();
      this.tabs = this._standingsService.initializeAllTabs(this.pageParams);
    }
  }
  
  private setupTitleData(teamName?: string, imageUrl?: string) {    
    var title = this._standingsService.getPageTitle(this.pageParams, teamName);
    this.titleData = {
      imageURL: imageUrl,
      text1: "Last Updated: [date]",
      text2: "United States",
      text3: title,
      icon: "fa fa-map-marker"
    };
  }
  
  private standingsTabSelected(tab: MLBStandingsTabData) {    
    this._standingsService.getStandingsTabData(tab, this.pageParams, data => {
      this.getLastUpdatedDateForPage(data);
    });
  }
  
  private getLastUpdatedDateForPage(data: MLBStandingsTableData[]) {           
      //Getting the first 'lastUpdatedDate' listed in the StandingsData
      if ( data && data.length > 0 && 
        data[0].tableData && data[0].tableData.rows &&
        data[0].tableData.rows.length > 0 ) {
          var lastUpdated = data[0].tableData.rows[0].lastUpdated;
          this.titleData.text1 = "Last Updated: " + GlobalFunctions.formatUpdatedDate(lastUpdated, false); 
      }
  }
}
