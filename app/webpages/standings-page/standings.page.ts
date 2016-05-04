import {Component, OnInit, Input} from 'angular2/core';
import {RouteParams} from "angular2/router";
import {BackTabComponent} from "../../components/backtab/backtab.component";
import {TitleComponent, TitleInputData} from "../../components/title/title.component";
import {CircleImageData} from "../../components/images/image-data";
import {StandingsComponent, StandingsComponentData} from "../../components/standings/standings.component";
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';

import {StandingsService} from '../../services/standings.service';
import {StandingsTableData, TeamStandingsData} from '../../services/standings.data';

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
    
  public pageParams: MLBPageParameters;
  
  public titleData: TitleInputData = {
    imageURL: "/app/public/profile_placeholder.png",
    text1: "Last Updated: [date]",
    text2: "United States",
    text3: "MLB Standings Breakdown",
    icon: "fa fa-map-marker"
  }
  
  constructor(private _standingsService: StandingsService, private _globalFunctions: GlobalFunctions, private _mlbFunctions: MLBGlobalFunctions) {     
    //TODO: Pull from URL
    if ( this.pageParams === undefined || this.pageParams === null ) {
      this.pageParams = {
        // division: Division.east,
        // conference: Conference.american
      };
    }
  }
  
  ngOnInit() {    
    this.setupStandingsData();
  }

//TODO-CJP: Move to service and base off of MLBPageParameters
  setupStandingsData() {
    let groupName = this._mlbFunctions.formatGroupName(this.pageParams.conference, this.pageParams.division);
    let moduletitle = groupName + " Standings";
    if ( this.pageParams.teamName !== undefined && this.pageParams.teamName !== null ) {
      moduletitle += " - " + this.pageParams.teamName;
    }
    
    this.data = {
      moduleTitle: moduletitle,
      tabs: []
    }

    if ( this.pageParams.division !== undefined && this.pageParams.division !== null ) {
      this._standingsService.loadTabData(this.data, this.pageParams.conference, this.pageParams.division);
      this._standingsService.loadTabData(this.data, this.pageParams.conference);
      this._standingsService.loadTabData(this.data);
    }
    else {
      this._standingsService.loadTabData(this.data);
      this._standingsService.loadTabData(this.data, Conference.american);
      this._standingsService.loadTabData(this.data, Conference.national);
    }
  }
}
