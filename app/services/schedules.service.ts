import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {CircleImageData} from '../components/images/image-data';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Conference, Division, MLBPageParameters} from '../global/global-interface';
import {SchedulesCarouselInput} from '../components/carousels/schedules-carousel/schedules-carousel.component';
import {SchedulesData, MLBSchedulesTableModel, MLBSchedulesTableData, MLBScheduleTabData} from './schedules.data';
import {Gradient} from '../global/global-gradient';
import {scheduleBoxInput} from '../components/schedule-box/schedule-box.component';

@Injectable()
export class SchedulesService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  // private _apiToken: string = 'BApA7KEfj';
  // private _headerName: string = 'X-SNT-TOKEN';

  constructor(public http: Http){

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
    var eventTab:boolean = false;

    if(typeof year == 'undefined'){
      year = new Date().getFullYear();//once we have historic data we shall show this
    }

    if(jsYear == year){
      displayYear = "Current Season";
    }else{
      displayYear = year;
    }

    //eventType determines which tab is highlighted
    if(eventStatus == 'pre-event'){
      eventTab = true;
    }else{
      eventTab = false;
    }
    var callURL = this._apiUrl+'/'+profile+'/schedule';

    if(typeof id != 'undefined'){
      callURL += '/'+id;
    }
    callURL += '/'+eventStatus+'/'+limit+'/'+ pageNum;  //default pagination limit: 5; page: 1

    if(profile == 'league'){
      callURL += '/schedule-live';
    }

    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        var tableData = this.setupTableData(eventStatus, year, data.data, id, limit, isTeamProfilePage);
        var tabData = [
          {display: 'Upcoming Games', data:'pre-event', disclaimer:'Times are displayed in ET and are subject to change', season:displayYear, tabData: new MLBScheduleTabData(this.formatGroupName(year,'pre-event'), eventTab)},
          {display: 'Previous Games', data:'post-event', disclaimer:'Games are displayed by most recent.', season:displayYear, tabData: new MLBScheduleTabData(this.formatGroupName(year,'post-event'), !eventTab)}
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

  //possibly simpler version of getting schedules api call
  getSchedule(profile, eventStatus, limit, pageNum, id?, year?){
    //Configure HTTP Headers
    var headers = this.setToken();
    var jsYear = new Date().getFullYear();//DEFAULT YEAR DATA TO CURRENT YEAR
    var displayYear;
    var eventTab:boolean = false;

    if(typeof year == 'undefined'){
      year = new Date().getFullYear();//once we have historic data we shall show this
    }

    if(jsYear == year){
      displayYear = "Current Season";
    }else{
      displayYear = year;
    }

    //eventType determines which tab is highlighted
    if(eventStatus == 'pre-event'){
      eventTab = true;
    }else{
      eventTab = false;
    }
    var callURL = this._apiUrl+'/'+profile+'/schedule';

    if(typeof id != 'undefined'){
      callURL += '/'+id;
    }
    callURL += '/'+eventStatus+'/'+limit+'/'+ pageNum;  //default pagination limit: 5; page: 1

    if(profile == 'league'){
      callURL += '/schedule-live';
    }

    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        return data;
      });
  }

  setupSlideScroll(data, profile, eventStatus, limit, pageNum, callback: Function){
    this.getSchedule('league', eventStatus, limit, pageNum)
    .subscribe( data => {
      var formattedData = this.transformSlideScroll(data.data);
      callback(formattedData);
    })
  }

  transformSlideScroll(data){
    let self = this;
    var modifiedArray = [];
    var newData:scheduleBoxInput;
    //run through and convert data to what is needed for the component
    data.forEach(function(val,index){
      let reportText = 'GAME REPORT';
      let partner = GlobalSettings.getHomeInfo();
      let reportEventType = val.reportUrlMod.split('/')[2];
      let reportEventID = val.reportUrlMod.split('/')[3];
      if(val.live == true && val.inning.toString() >= "2"){
          reportText = 'IN GAME REPORT';
          reportEventType = 'in-game-report';
      }else{
        if(val.eventStatus = 'pre-event' || (val.live == true && val.inning.toString() == "1")){
          reportText = 'PREGAME REPORT'
        }else if (val.eventStatus == 'post-event'){
          reportText = 'POST GAME REPORT';
        }else{
          reportText = 'POST GAME REPORT';
        }
      }
      let reportLink = MLBGlobalFunctions.formatAiArticleRoute(reportEventType, reportEventID);

      let date = GlobalFunctions.formatGlobalDate(val.startDateTimestamp,'defaultDate');
      let time = GlobalFunctions.formatGlobalDate(val.startDateTimestamp,'time');
      newData = {
        date: date + " &bull; " + time,
        awayImageConfig: self.imageData('image-44', 'border-1', GlobalSettings.getImageUrl(val.awayTeamLogo, GlobalSettings._imgSmLogo), MLBGlobalFunctions.formatTeamRoute(val.awayTeamName, val.awayTeamId)),
        homeImageConfig: self.imageData('image-44', 'border-1', GlobalSettings.getImageUrl(val.homeTeamLogo, GlobalSettings._imgSmLogo), MLBGlobalFunctions.formatTeamRoute(val.homeTeamName, val.homeTeamId)),
        awayTeamName: val.awayTeamLastName,
        homeTeamName: val.homeTeamLastName,
        awayLink: MLBGlobalFunctions.formatTeamRoute(val.awayTeamName, val.awayTeamId),
        homeLink: MLBGlobalFunctions.formatTeamRoute(val.homeTeamName, val.homeTeamId),
        reportDisplay: reportText,
        reportLink: reportLink,
        isLive: val.live == true ? 'schedule-live' : '',
        inning: val.inning != null ? " " + val.inning + "<sup>" + GlobalFunctions.Suffix(Number(val.inning)) + "</sup>": null
      }
      modifiedArray.push(newData);
    });
    return modifiedArray;
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
          var splitToDate = GlobalFunctions.getDateElement(val.startDateTimestamp, "fullDate");
          if(typeof dateObject[splitToDate] == 'undefined'){
            dateObject[splitToDate] = {};
            dateObject[splitToDate]['tableData'] = [];
            dateObject[splitToDate]['display'] = GlobalFunctions.formatGlobalDate(val.startDateTimestamp,'dayOfWeek') + " Games";
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

  imageData(imageClass, imageBorder, mainImg, mainImgRoute?){
    if(typeof mainImg =='undefined' || mainImg == ''){
      mainImg = "/app/public/no-image.png";
    }
    var image: CircleImageData = {//interface is found in image-data.ts
        imageClass: imageClass,
        mainImage: {
            imageUrl: mainImg,
            urlRouteArray: mainImgRoute,
            hoverText: "<i class='fa fa-mail-forward'></i>",
            imageClass: imageBorder,
        },
    };
    return image;
  }
}
