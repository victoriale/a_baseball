import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Conference, Division, MLBPageParameters} from '../global/global-interface';
import {SchedulesCarouselInput} from '../components/carousels/schedules-carousel/schedules-carousel.component';
import {SchedulesData, MLBSchedulesTableModel, MLBSchedulesTableData, MLBScheduleTabData} from './schedules.data';
import {Gradient} from '../global/global-gradient';

declare var moment: any;

@Injectable()
export class SchedulesService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  // private _apiToken: string = 'BApA7KEfj';
  // private _headerName: string = 'X-SNT-TOKEN';

  constructor(public http: Http, private _globalFunc: GlobalFunctions){

  }

  getLinkToPage(pageParams: MLBPageParameters, teamName?: string): Array<any> {
    var pageName = "Schedules-page";
    var pageValues = {};

    if ( pageParams.teamId && teamName ) {
      pageValues["teamId"] = pageParams.teamId;
      pageValues["teamName"] = teamName;
      pageName += "-team";
    }
    else if( !pageParams.teamId && !teamName ) {
      pageName += "-league";
    }
    else{
      //go to error page
    }
    return [pageName, pageValues];
  }// Returns all parameters used to get to page of Schedules


  getModuleTitle(teamName?: string): string {
    let moduletitle = "Weekly Schedules";
    if ( teamName ) {
      moduletitle += " - " + teamName;
    } else {
      moduletitle += " - League";
    }
    return moduletitle;
  }// Sets the title of the modules with data returned by schedules


  getPageTitle(teamName?: string): string {
    let pageTitle = "MLB Schedules Breakdown";
    if ( teamName ) {
      pageTitle = "MLB Schedules - " + teamName;
    }
    return pageTitle;
  }// Sets the title of the Page with data returne by shedules

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      //headers.append(this.headerName, this.apiToken);
      return headers;
  }

  getSchedulesService(profile, eventStatus, limit, pageNum, isTeamProfilePage?: boolean, id?, year?){
    //Configure HTTP Headers
    var headers = this.setToken();
    var jsYear = new Date().getFullYear();//DEFAULT YEAR DATA TO CURRENT YEAR
    var displayYear;

    if(typeof year == 'undefined'){
      year = new Date().getFullYear();//once we have historic data we shall show this
    }

    if(jsYear == year){
      displayYear = "Current Season";
    }else{
      displayYear = year;
    }

    var callURL = this._apiUrl+'/'+profile+'/schedule';

    if(typeof id != 'undefined'){
      callURL += '/'+id;
    }
    callURL += '/'+eventStatus+'/'+limit+'/'+ pageNum;  //default pagination limit: 5; page: 1

    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        var tableData = this.setupTableData(eventStatus, year, data.data, id, limit, isTeamProfilePage);
        var tabData = [
          {display: 'Upcoming Games', data:'pre-event', season:displayYear, tabData: new MLBScheduleTabData(this.formatGroupName(year,'pre-event'), true)},
          {display: 'Previous Games', data:'post-event', season:displayYear, tabData: new MLBScheduleTabData(this.formatGroupName(year,'post-event'), true)}
        ];
        return {
          data:tableData,
          tabs:tabData,
          carData: this.setupCarouselData(data.data, tableData[0], limit),
          pageInfo:{
            totalPages: data.data[0].totalPages,
            totalResults: data.data[0].totalResults,
          }
        };
      });
  }

  //rows is the data coming in
  private setupTableData(eventStatus, year, rows: Array<any>, teamId, maxRows: number, isTeamProfilePage: boolean): Array<MLBSchedulesTableData> {
    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      rows = rows.slice(0, maxRows);
    }
    var currentTeamProfile = isTeamProfilePage ? teamId : null;

    //TWO tables are to be made depending on what type of tabs the use is click on in the table
    if(eventStatus == 'pre-event'){
      // let tableName = this.formatGroupName(year,eventStatus);
      var table = new MLBSchedulesTableModel(rows, eventStatus, teamId, isTeamProfilePage);
      var tableArray = new MLBSchedulesTableData('' , table, currentTeamProfile);
      return [tableArray];
    }else{
      var postDate = [];
      var dateObject = {};

      // let tableName = this.formatGroupName(year,eventStatus);
      if(typeof teamId == 'undefined'){
        var table = new MLBSchedulesTableModel(rows, eventStatus, teamId, isTeamProfilePage);// there are two types of tables for Post game (team/league) tables
        rows.forEach(function(val,index){// seperate the dates into their own Obj tables for post game reports
          var splitToDate = moment(val.startDateTimestamp).tz('America/New_York').format('YYYY-MM-DD');
          if(typeof dateObject[splitToDate] == 'undefined'){
            dateObject[splitToDate] = {};
            dateObject[splitToDate]['tableData'] = [];
            dateObject[splitToDate]['display'] = moment(val.startDateTimestamp).tz('America/New_York').format('dddd MMMM Do, YYYY') + " Games";
            dateObject[splitToDate]['tableData'].push(val);
          }else{
            dateObject[splitToDate]['tableData'].push(val);
          }
        });
        for(var date in dateObject){
          var newPostModel = new MLBSchedulesTableModel(dateObject[date]['tableData'], eventStatus, teamId, isTeamProfilePage);
          var newPostTable = new MLBSchedulesTableData(dateObject[date]['display'], newPostModel, currentTeamProfile);
          postDate.push(newPostTable);
        }
        return postDate;
      }else{//if there is a teamID
        var table = new MLBSchedulesTableModel(rows, eventStatus, teamId, isTeamProfilePage);// there are two types of tables for Post game (team/league) tables
        var tableArray = new MLBSchedulesTableData('' , table, currentTeamProfile);
        return [tableArray];
      }
    }
  }

  //TODO-CJP - remove current team profile link
  private setupCarouselData(origData: Array<SchedulesData>, tableData: MLBSchedulesTableData, maxRows?: number){
    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      origData = origData.slice(0, maxRows);
    }
    var carData = origData.map(function(val, index){
      var displayNext = '';
      if(val.eventStatus == 'pre-event'){
        var displayNext = 'Next Game:';
      }else{
        var displayNext = 'Previous Game:';
      }

      if(val.homeTeamWins === null){
        val.homeTeamWins = '#';
      }
      if(val.homeTeamLosses === null){
        val.homeTeamLosses = '#';
      }
      if(val.awayTeamWins === null){
        val.awayTeamWins = '#';
      }
      if(val.awayTeamLosses === null){
        val.awayTeamLosses = '#';
      }
      // combine together the win and loss of a team to create their record
      val.homeRecord = val.homeTeamWins + '-' + val.homeTeamLosses;//?? is this really the win and loss
      val.awayRecord = val.awayTeamWins + '-' + val.awayTeamLosses;//?? is this really the win and loss

      return tableData.updateCarouselData(val, index); //Use existing conversion function
    });
    return carData;
  }

  private formatGroupName(year, eventStatus): string {
    var currentDate = new Date().getFullYear();
    let games = "";
    if ( eventStatus == 'pre-event' ) {
      games = "<span class='text-heavy>Current Season</span> Upcoming Games";
    }
    else if(year == currentDate){
      games = "<span class='text-heavy>Current Season</span> Previously Played Games";
    }else{
      games = year + " Season";
    }
    return games;
  }
}
