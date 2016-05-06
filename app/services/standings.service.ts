import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';
import {Conference, Division, MLBPageParameters} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {TeamStandingsData, MLBStandingsTabData, MLBStandingsTableModel, MLBStandingsTableData} from './standings.data';
import {TableTabData} from '../components/standings/standings.component';

@Injectable()
export class StandingsService {
  private _apiUrl: string = 'http://dev-homerunloyal-api.synapsys.us/standings';
// '[API]/standings/{ordering}/{conference}/{division}'

  constructor(public http: Http, private _globalFunctions: GlobalFunctions, private _mlbFunctions: MLBGlobalFunctions){}
  
  getLinkToPage(pageParams: MLBPageParameters): Array<any> {
    var pageName = "Standings-page";
    var pageValues = {};
    if ( pageParams.conference != null ) {
      pageValues["conference"] = Conference[pageParams.conference];
      
      if ( pageParams.division != null ) {
        pageValues["division"] = Conference[pageParams.division];
        
        if ( pageParams.teamId != null ) {
          pageValues["teamId"] = pageParams.teamId;
          pageName += "-page";
        }
        else {
          pageName += "-division";
        }
      }
      else {
        pageName += "-conference";
      }
    }    
    return [pageName, pageValues];
  }
  
  getModuleTitle(pageParams: MLBPageParameters): string {    
    let groupName = this._mlbFunctions.formatGroupName(pageParams.conference, pageParams.division);
    let moduletitle = groupName + " Standings";
    if ( pageParams.teamName !== undefined && pageParams.teamName !== null ) {
      moduletitle += " - " + pageParams.teamName;
    }
    return moduletitle;
  }
  
  getPageTitle(pageParams: MLBPageParameters): string {    
    let groupName = this._mlbFunctions.formatGroupName(pageParams.conference, pageParams.division);
    let pageTitle = "MLB Standings Breakdown";
    if ( pageParams.teamName !== undefined && pageParams.teamName !== null ) {
      pageTitle = "MLB Standings - " + pageParams.teamName;
    }
    return pageTitle;
  }
  
  loadAllTabs(pageParams: MLBPageParameters, maxRows?: number): Observable<Array<MLBStandingsTabData>> {    
    var tabs = this.initializeAllTabs(pageParams); 
    return Observable.forkJoin(tabs.map(tab => this.getData(tab, maxRows)));    
  }

  private getData(standingsTab: MLBStandingsTabData, maxRows?: number): Observable<MLBStandingsTabData> {
    let url = this._apiUrl;

    if ( standingsTab.conference !== undefined ) {
      url += "/" + Conference[standingsTab.conference];

      if ( standingsTab.division !== undefined ) {
        url += "/" + Division[standingsTab.division];
      }
    }

    return this.http.get(url)
        .map(res => res.json())
        .map(data => this.setupTabData(standingsTab, data.data, maxRows));
  }
  
  private initializeAllTabs(pageParams: MLBPageParameters): Array<MLBStandingsTabData> {
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

  private setupTabData(standingsTab: MLBStandingsTabData, data: Array<TeamStandingsData>, maxRows?: number): MLBStandingsTabData {
    var table = new MLBStandingsTableModel("", data);
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
    return standingsTab;
  }
}
