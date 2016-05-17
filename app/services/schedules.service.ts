import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Conference, Division, MLBPageParameters} from '../global/global-interface';

import { MLBSchedulesTableModel, MLBSchedulesTableData} from './schedules.data';


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

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      //headers.append(this.headerName, this.apiToken);
      return headers;
  }

  getSchedulesService(profile, id, eventStatus){
  //Configure HTTP Headers
  var headers = this.setToken();
  console.log(profile,id, eventStatus)
  /*
  http://dev-homerunloyal-api.synapsys.us/team/schedule/2819/pre-event
  http://dev-homerunloyal-api.synapsys.us/team/schedule/2819/post-event
  */
  var callURL = this._apiUrl+'/'+profile+'/schedule';
  var tabData = [
    {display: 'Upcoming Games', data:'pre-event'},
    {display: 'Previous games', data:'post-event'}
  ]
  if(typeof id != 'undefined'){
    callURL += '/'+id;
  }
  callURL += '/'+eventStatus+'/5/1';  //default pagination limit: 5; page: 1

  console.log(callURL);
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      return {
        data:this.setupTableData(eventStatus, data.data, 5),
        tabs:tabData
      };
    })
  }

  //rows is the data coming in
  private setupTableData(eventStatus, rows: Array<any>, maxRows: number) {
    let groupName = eventStatus;
    maxRows = 5;  // TODO replace current number
    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      rows = rows.slice(0, maxRows);
    }

    let tableName = eventStatus;
    var table = new MLBSchedulesTableModel(rows);
    return new MLBSchedulesTableData(tableName, table);
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
