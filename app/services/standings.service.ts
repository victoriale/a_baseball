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
    let groupName = this.formatGroupName(pageParams.conference, pageParams.division);
    let moduletitle = groupName + " Standings";
    if ( pageParams.teamName !== undefined && pageParams.teamName !== null ) {
      moduletitle += " - " + pageParams.teamName;
    }
    return moduletitle;
  }
  
  getPageTitle(pageParams: MLBPageParameters): string {    
    let groupName = this.formatGroupName(pageParams.conference, pageParams.division);
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

      // if ( standingsTab.division !== undefined ) {
      //   url += "/" + Division[standingsTab.division];
      // }
    }

    return this.http.get(url)
        .map(res => res.json())
        .map(data => this.setupTabData(standingsTab, data.data, maxRows));
  }
  
  private initializeAllTabs(pageParams: MLBPageParameters): Array<MLBStandingsTabData> {
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
    let title = this.formatGroupName(conference, division) + " Standings";
    return new MLBStandingsTabData(title, conference, division, selectTab);
  }

  private setupTabData(standingsTab: MLBStandingsTabData, apiData: any, maxRows?: number): MLBStandingsTabData {
    //Array<TeamStandingsData>
    var sections: Array<MLBStandingsTableData> = [];
    
    if ( standingsTab.conference !== null && standingsTab.conference !== undefined &&
      standingsTab.division !== null && standingsTab.division !== undefined ) {
      //get only the single division
      var conferenceKey = Conference[standingsTab.conference];
      var divisionKey = Division[standingsTab.division];      
      var divData = conferenceKey && divisionKey ? apiData[conferenceKey][divisionKey] : [];
      sections.push(this.setupTableData(standingsTab.conference, standingsTab.division, divData, maxRows, false));
    }
    else {    
      //other load all provided divisions
      for ( var conferenceKey in apiData ) {
        for ( var divisionKey in apiData[conferenceKey] ) {
          var divData = conferenceKey && divisionKey ? apiData[conferenceKey][divisionKey] : [];
          sections.push(this.setupTableData(Conference[conferenceKey], Division[divisionKey], divData, maxRows, true));          
        }
      }      
    }
    
    standingsTab.sections = sections;
    return standingsTab;
  }

  private setupTableData(conference:Conference, division:Division, rows: Array<TeamStandingsData>, maxRows: number, includeTableName: boolean): MLBStandingsTableData {
    let groupName = this.formatGroupName(conference, division);
    
    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      rows = rows.slice(0, maxRows);
    }
    
    //Set display values
    rows.forEach((value, index) => {
      value.groupName = groupName;
      value.displayDate = this._globalFunctions.formatUpdatedDate(value.lastUpdatedDate, false);
      if ( value.teamId === undefined || value.teamId === null ) {
        value.teamId = index;
      }
    });
    
    let tableName = this.formatGroupName(conference, division, true);
    var table = new MLBStandingsTableModel(rows);
    return new MLBStandingsTableData(includeTableName ? tableName : "", conference, division, table);
  }

  /**
   * - Returns the group/league name based on the given conference and division values
   *
   * @example
   * // "American League"
   * formatGroupName(Conference.american)
   *
   * @example
   * // "MLB"
   * formatGroupName()
   *
   * @example
   * // "American League East"
   * formatGroupName(Conference.american, Division.east)
   *
   * @param {Conference} conference - (Optional)
   *                                - Expected if {division} is included.
   * @param {Division} division - (Optional)
   * @returns {string}
   *
   */
  private formatGroupName(conference: Conference, division: Division, makeDivisionBold?: boolean): string {
    if ( conference !== undefined && conference !== null ) {
      let leagueName = this._globalFunctions.toTitleCase(Conference[conference]) + " League";
      if ( division !== undefined && division !== null ) {
        var divisionName = this._globalFunctions.toTitleCase(Division[division]);
        return leagueName + " " + (makeDivisionBold ? "<span class='text-heavy'>" + divisionName + "</span>" : divisionName);
      }
      else {
        return leagueName;
      }
    }
    else {
      return "MLB";
    }
  }
}
