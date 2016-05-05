import {Component, OnInit, Input} from 'angular2/core';
import {RouteParams} from "angular2/router";
import {BackTabComponent} from "../../components/backtab/backtab.component";
import {TitleComponent, TitleInputData} from "../../components/title/title.component";
import {CircleImageData} from "../../components/images/image-data";
import {StandingsComponent, StandingsComponentData} from "../../components/standings/standings.component";
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';

import {StandingsService} from '../../services/standings.service';
import {MLBStandingsTabData, MLBStandingsTableModel, MLBStandingsTableData} from '../../services/standings.data';

import {Division, Conference, MLBPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';

@Component({
    selector: 'Standings-page',
    templateUrl: './app/webpages/standings-page/standings.page.html',

    directives: [BackTabComponent, TitleComponent, StandingsComponent, LoadingComponent, ErrorComponent],
    providers: [StandingsService],
})

export class StandingsPage implements OnInit {
  public data: StandingsComponentData;
    
  public pageParams: MLBPageParameters = {}
  
  public titleData: TitleInputData = {
    imageURL: "/app/public/profile_placeholder.png",
    text1: "Last Updated: [date]",
    text2: "United States",
    text3: "MLB Standings Breakdown",
    icon: "fa fa-map-marker"
  }
  
  constructor(private _params: RouteParams,
              private _standingsService: StandingsService, 
              private _globalFunctions: GlobalFunctions, 
              private _mlbFunctions: MLBGlobalFunctions) {
    
    var conference = _params.get("conference");
    if ( conference !== null && conference !== undefined ) {
      this.pageParams.conference = Conference[conference.toLowerCase()];
    }
    
    var division = _params.get("division");
    if ( division !== null && division !== undefined ) {
      this.pageParams.division = Division[division.toLowerCase()];
    }
    
    var teamId = _params.get("teamId");
    if ( teamId !== null && teamId !== undefined ) {
      this.pageParams.teamId = teamId;
      // this.pageParams.teamName = "??"
    }
  }
  
  ngOnInit() {    
    this.setupStandingsData();
  }

  setupStandingsData() {
    let groupName = this._mlbFunctions.formatGroupName(this.pageParams.conference, this.pageParams.division);
    let pageTitle = "MLB Standings Breakdown";
    if ( this.pageParams.teamName !== undefined && this.pageParams.teamName !== null ) {
      pageTitle = "MLB Standings - " + this.pageParams.teamName;
    }
    this.titleData.text3 = pageTitle;
    let tabs = this._standingsService.initializeAllTabs(this.pageParams);
    
    this.data = {
      moduleTitle: pageTitle,
      tabs: tabs
    }
    
    for ( var i = 0; i < tabs.length; i++ ) {
      this._standingsService.loadTabData(tabs[i]);
    }
  }
}
