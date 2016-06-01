import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Conference, Division, MLBPageParameters} from '../global/global-interface';
import {SchedulesCarouselInput} from '../components/carousels/schedules-carousel/schedules-carousel.component';
import { MLBSchedulesTableModel, MLBSchedulesTableData, MLBScheduleTabData} from './schedules.data';
import {Gradient} from '../global/global-gradient';

declare var moment;
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

  getSchedulesService(profile, eventStatus, limit, pageNum, id?, year?){
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
  // console.log(profile,id, eventStatus)/

  var callURL = this._apiUrl+'/'+profile+'/schedule';


  if(typeof id != 'undefined'){
    callURL += '/'+id;
  }
  callURL += '/'+eventStatus+'/'+limit+'/'+ pageNum;  //default pagination limit: 5; page: 1

  // console.log(callURL);
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      var tableData = this.setupTableData(eventStatus, year, data.data, limit);
      var tabData = [
        {display: 'Upcoming Games', data:'pre-event', season:displayYear, tabData: new MLBScheduleTabData(this.formatGroupName(year,'pre-event'), true)},
        {display: 'Previous Games', data:'post-event', season:displayYear, tabData: new MLBScheduleTabData(this.formatGroupName(year,'post-event'), true)}
      ];
      return {
        data:tableData,
        tabs:tabData,
        carData: this.setupCarouselData(data.data, limit),
        pageInfo:{
          totalPages: data.data[0].totalPages,
          totalResults: data.data[0].totalResults,
        }
      };
    })
  }



  //rows is the data coming in
  private setupTableData(eventStatus, year, rows: Array<any>, maxRows?: number) {
    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      rows = rows.slice(0, maxRows);
    }
    //TWO tables are to be made depending on what type of tabs the use is click on in the table
    if(eventStatus == 'pre-event'){
      // let tableName = this.formatGroupName(year,eventStatus);
      var table = new MLBSchedulesTableModel(rows, eventStatus);
      var tableArray = new MLBSchedulesTableData('' , table);
      return [tableArray];
    }else{
      var postDate = [];
      var dateObject = {};
      // let tableName = this.formatGroupName(year,eventStatus);
      var table = new MLBSchedulesTableModel(rows, eventStatus);

      rows.forEach(function(val,index){// seperate the dates into their own Obj tables for post game reports
        var splitToDate = val.startDateTime.split(' ')[0];
        if(typeof dateObject[splitToDate] == 'undefined'){
          dateObject[splitToDate] = {};
          dateObject[splitToDate]['tableData'] = [];
          dateObject[splitToDate]['display'] = moment(val.startDateTime).format('dddd MMMM Do, YYYY') + " Games";
          dateObject[splitToDate]['tableData'].push(val);
        }else{
          dateObject[splitToDate]['tableData'].push(val);
        }
      });
      for(var date in dateObject){
        var newPostModel = new MLBSchedulesTableModel(dateObject[date]['tableData'], eventStatus);
        var newPostTable = new MLBSchedulesTableData( dateObject[date]['display'], newPostModel);
        postDate.push(newPostTable);
      }
      return postDate;
    }
  }

  private setupCarouselData(origData, maxRows?: number){//ANY CHANGES HERE CHECK updateCarouselData in schedules.data.ts
    // console.log(origData);
    var carouselData: SchedulesCarouselInput; // set a variable to the interface
    var carData = [];
    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      origData = origData.slice(0, maxRows);
    }
    origData.forEach(function(val, index){
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
      carouselData = {//placeholder data
        index:index,
        displayNext: displayNext,
        backgroundGradient: Gradient.getGradientStyles([val.awayTeamColors.split(',')[0],val.homeTeamColors.split(',')[0]], 1),
        displayTime:moment(val.startDateTime).format('dddd MMMM Do, YYYY | h:mm A') + " ET",//hard coded TIMEZOME since it is coming back from api this way
        detail1Data:'Home Stadium:',
        detail1Value:val.homeTeamVenue,
        detail2Value:val.homeTeamCity + ', ' + val.homeTeamState,
        imageConfig1:{//AWAY
          imageClass: "image-125",
          mainImage: {
            imageUrl: GlobalSettings.getImageUrl(val.awayTeamLogo),
            urlRouteArray: MLBGlobalFunctions.formatTeamRoute(val.awayTeamName, val.awayTeamId),
            hoverText: "<p>View</p><p>Profile</p>",
            imageClass: "border-5"
          }
        },
        imageConfig2:{//HOME
          imageClass: "image-125",
          mainImage: {
            imageUrl: GlobalSettings.getImageUrl(val.homeTeamLogo),
            urlRouteArray: MLBGlobalFunctions.formatTeamRoute(val.homeTeamName, val.homeTeamId),
            hoverText: "<p>View</p><p>Profile</p>",
            imageClass: "border-5"
          }
        },
        teamName1: val.awayTeamName,
        teamName2: val.homeTeamName,
        teamLocation1:val.awayTeamCity + ', ' + val.awayTeamState,
        teamLocation2:val.homeTeamCity + ', ' + val.homeTeamState,
        teamRecord1:val.awayRecord,
        teamRecord2:val.homeRecord,
      };
      carData.push(carouselData);
    });
    // console.log('returned Data',carData);

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
