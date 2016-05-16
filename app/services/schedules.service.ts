import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Conference, Division, MLBPageParameters} from '../global/global-interface';

import {TeamStandingsData, MLBStandingsTabData, MLBStandingsTableModel, MLBStandingsTableData} from './standings.data';


declare var moment;
@Injectable()
export class SchedulesService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  // private _apiToken: string = 'BApA7KEfj';
  // private _headerName: string = 'X-SNT-TOKEN';

  constructor(public http: Http, private _globalFunc: GlobalFunctions){

  }

  getLinkToPage(pageParams: MLBPageParameters): Array<any> {
    var pageName = "Schedules-page";
    var pageValues = {};

    if ( pageParams.teamId && pageParams.teamName ) {
      pageValues["teamId"] = pageParams.teamId;
      pageValues["teamName"] = pageParams.teamName;
      pageName += "-team";
    }
    else if( typeof pageParams.teamId == 'undefined' && typeof pageParams.teamName == 'undefined' ) {
      pageName += "-league";
    }
    else{
      //go to error page
    }
    return [pageName, pageValues];
  }// Returns all parameters used to get to page of Schedules

  getModuleTitle(pageParams: MLBPageParameters): string {
    let moduletitle = "Weekly Schedules";
    if ( pageParams.teamName !== undefined && pageParams.teamName !== null ) {
      moduletitle += " - " + pageParams.teamName;
    } else {
      moduletitle += " - League";
    }
    return moduletitle;
  }// Sets the title of the modules with data returned by schedules

  getPageTitle(pageParams: MLBPageParameters): string {
    let pageTitle = "MLB Schedules Breakdown";
    if ( pageParams.teamName !== undefined && pageParams.teamName !== null ) {
      pageTitle = "MLB Schedules - " + pageParams.teamName;
    }
    return pageTitle;
  }// Sets the title of the Page with data returne by shedules

  loadAllTabsForModule(pageParams: MLBPageParameters) {
    return {
        moduleTitle: this.getModuleTitle(pageParams),
        pageRouterLink: this.getLinkToPage(pageParams),
        tabs: this.initializeAllTabs(pageParams)
    };
  }// Load all tabs

  initializeAllTabs(pageParams: MLBPageParameters): Array<any> {
    let tabs: Array<any> = [];

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
    let title = this.formatGroupName('2016') + " Schedules";
    return new MLBStandingsTabData(title, conference, division, selectTab);
  }

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      //headers.append(this.headerName, this.apiToken);
      return headers;
  }

  getSchedulesService(profile, teamId, eventStatus){//TODO replace data points for list page
  //Configure HTTP Headers
  var headers = this.setToken();

  /*
  http://dev-homerunloyal-api.synapsys.us/team/schedule/2819/pre-event
  http://dev-homerunloyal-api.synapsys.us/team/schedule/2819/post-event
  */
  var callURL = this._apiUrl+'/'+profile+'/schedule';

  if(typeof teamId != 'undefined'){
    callURL += '/'+teamId;
  }
  callURL += '/'+eventStatus;

  console.log(callURL);
  return this.http.get( callURL, {
      headers: headers
    })
    .map(
      res => res.json()
    )
    .map(
      data => {
        console.log('Original Schedules Data', data);
        return 'hi schedules data';
      },
      err => {
        console.log('INVALID DATA');
      }
    )
  }

  private setupTabData(standingsTab: any, apiData: any, teamId: number, maxRows: number): Array<any> {
    //Array<TeamStandingsData>
    var sections: Array<MLBStandingsTableData> = [];
    var totalRows = 0;

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
          var table = this.setupTableData(Conference[conferenceKey], Division[divisionKey], divData, maxRows, true);
          totalRows += table.tableData.rows.length;
          if ( maxRows && totalRows > maxRows ) {
            break; //don't add more divisions
          }
          sections.push(table);
        }
        if ( maxRows && totalRows > maxRows ) {
          break; //don't add more conferences
        }
      }
    }

    if ( teamId ) {
      sections.forEach(section => {
        section.tableData.selectedKey = teamId;
      });
    }
    return sections;
  }

  private setupTableData(conference, division, rows: Array<any>, maxRows: number, includeTableName: boolean) {
    let groupName = this.formatGroupName('2016');

    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      rows = rows.slice(0, maxRows);
    }

    // //Set display values
    // rows.forEach((value, index) => {
    //   value.groupName = groupName;
    //   value.displayDate = GlobalFunctions.formatUpdatedDate(value.lastUpdated, false);
    //   value.fullImageUrl = GlobalSettings.getImageUrl(value.imageUrl);
    //   value.fullBackgroundImageUrl = GlobalSettings.getImageUrl(value.backgroundImage);
    //
    //   //Make sure numbers are numbers.
    //   value.totalWins = Number(value.totalWins);
    //   value.totalLosses = Number(value.totalLosses);
    //   value.winPercentage = Number(value.winPercentage);
    //   value.gamesBack = Number(value.gamesBack);
    //   value.streakCount = Number(value.streakCount);
    //   value.batRunsScored = Number(value.batRunsScored);
    //   value.pitchRunsAllowed = Number(value.pitchRunsAllowed);
    //
    //   if ( value.teamId === undefined || value.teamId === null ) {
    //     value.teamId = index;
    //   }
    // });

    let tableName = this.formatGroupName('2016');
    var table = new MLBStandingsTableModel(rows);
    return new MLBStandingsTableData(includeTableName ? tableName : "", conference, division, table);
  }

  private formatGroupName(date): string {
    var currentDate = new Date();

    if ( date > currentDate ) {
      let leagueName = " Upcoming Games";
      return leagueName;
    }
    else {
      let leagueName = " Current Season";
      return leagueName;
    }
  }
}
