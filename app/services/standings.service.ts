import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';
import {Conference, Division, MLBPageParameters} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {TeamStandingsData, MLBStandingsTabData, MLBStandingsTableModel, MLBStandingsTableData} from './standings.data';
import {StandingsModule} from '../modules/standings/standings.module';
import {StandingsComponentData, TableTabData} from '../components/standings/standings.component';

@Injectable()
export class StandingsService {
  private _apiUrl: string = 'http://dev-homerunloyal-api.synapsys.us/standings';
// '[API]/standings/{ordering}/{conference}/{division}'

  constructor(public http: Http, private _globalFunctions: GlobalFunctions, private _mlbFunctions: MLBGlobalFunctions){}

  private getData(conference: Conference, division: Division): Observable<MLBStandingsTableModel> {
    let url = this._apiUrl;
    let title = "Standings";

    if ( conference !== undefined ) {
      url += "/" + Conference[conference];

      if ( division !== undefined ) {
        url += "/" + Division[division];
      }
    }

    return this.http.get(url)
        .map(res => res.json())
        .map(data => this.createTableModel(data.data));
  }

  private createTableModel(data: Array<TeamStandingsData>): MLBStandingsTableModel {
    //TODO-CJP: create subtitle string
    return new MLBStandingsTableModel("", data);
  }
  
  initializeAllTabs(pageParams: MLBPageParameters) {
    let groupName = this._mlbFunctions.formatGroupName(pageParams.conference, pageParams.division);
    let tabs: Array<MLBStandingsTabData> = [];
    
    if ( pageParams.conference === undefined || pageParams.conference === null ) {
      //Is an MLB page: show MLB, then American, then National
      tabs.push(this.createTab(true));
      tabs.push(this.createTab(false, Conference.american));
      tabs.push(this.createTab(false, Conference.national));
    }
    else if ( pageParams.division === undefined || pageParams.division === null ) {
      //Is a League page: show All Divisions, then American, then National
      tabs.push(this.createTab(false));
      tabs.push(this.createTab(pageParams.conference === Conference.american, Conference.american));
      tabs.push(this.createTab(pageParams.conference === Conference.national, Conference.national));
    }
    else {
      //Is a Team page: show team's division, then team's league, then MLB
      tabs.push(this.createTab(true, pageParams.conference, pageParams.division));
      tabs.push(this.createTab(false, pageParams.conference));
      tabs.push(this.createTab(false));
    }
    
    return tabs;
  }
  
  private createTab(selectTab: boolean, conference?: Conference, division?: Division) {
    let title = this._mlbFunctions.formatGroupName(conference, division) + " Standings";
    return new MLBStandingsTabData(title, conference, division, selectTab);
  }

  loadTabData(standingsTab: MLBStandingsTabData, maxRows?: number) {
    this.getData(standingsTab.conference, standingsTab.division).subscribe(
      data => this.setupTabData(standingsTab, data, maxRows),
      err => { 
        console.log("Error getting standings data for " + standingsTab.title + ": " + err);
      }
    );
  }

  private setupTabData(standingsTab: MLBStandingsTabData, table: MLBStandingsTableModel, maxRows?: number) {
    let groupName = this._mlbFunctions.formatGroupName(standingsTab.conference, standingsTab.division);
    
    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      table.rows = table.rows.slice(0, maxRows);
    }
    
    //Set display values    
    table.rows.forEach((value, index) => {
      value.groupName = groupName;
      value.displayDate = this._globalFunctions.formatUpdatedDate(value.lastUpdatedDate, false);
      if ( value.teamId === undefined || value.teamId === null ) {
        value.teamId = index;
      }
    });

    //Table tabs
    let title = ""; // only include title if there are multiple tables.
    let tableData = new MLBStandingsTableData(title, standingsTab.conference, standingsTab.division, table); 
    standingsTab.sections = [tableData];
  }
}
