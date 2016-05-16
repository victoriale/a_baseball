import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Conference, Division, MLBPageParameters} from '../global/global-interface';

import { MLBSchedulesTabData, MLBSchedulesTableModel, MLBSchedulesTableData} from './schedules.data';


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
    console.log(pageParams);
    var test = this.initializeAllTabs(pageParams);
    console.log(test);
    // return {
    //     moduleTitle: this.getModuleTitle(pageParams),
    //     pageRouterLink: this.getLinkToPage(pageParams),
    //     tabs: this.initializeAllTabs(pageParams)
    // };
  }// Load all tabs but for schedules there is no tabs

  loadAllTabs(pageParams: MLBPageParameters, maxRows?: number): Observable<Array<any>> {
    var tabs = this.initializeAllTabs(pageParams);
    return Observable.forkJoin(tabs.map(tab => this.getSchedulesService('team','2799', 'pre-game')));
  }

  initializeAllTabs(pageParams: MLBPageParameters): Array<any> {
    let tabs: Array<any> = [];

    tabs.push(this.createTab(true));
    console.log('initializeAllTabs', tabs);
    return tabs;
  }//there will only be one tab so this function only needs to return one for the time being


  private createTab(selectTab: boolean, conference?: Conference, division?: Division) {
    let title = this.formatGroupName('2016') + " Schedules";
    return new MLBSchedulesTabData(title, conference, division, selectTab);
  }//creates a tab with the new interface


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

  private setupTabData(SchedulesTab: any, apiData: any, teamId: number, maxRows: number): Array<any> {
    //Array<TeamSchedulesData>
    var sections: Array<any> = [];
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
    var table = new MLBSchedulesTableModel(rows);
    return new MLBSchedulesTableData(includeTableName ? tableName : "", conference, division, table);
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
