import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Conference, Division, MLBPageParameters} from '../global/global-interface';
import {SchedulesCarouselInput} from '../components/carousels/schedules-carousel/schedules-carousel.component';
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
  var year = new Date().getFullYear();//DEFAULT YEAR DATA TO CURRENT YEAR
  // console.log(profile,id, eventStatus)/
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

  // console.log(callURL);
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      return {
        data:this.setupTableData(eventStatus, year, data.data, 5),
        tabs:tabData,
        carData: this.setupCarouselData(data.data, 5),
      };
    })
  }

  //rows is the data coming in
  private setupTableData(eventStatus, year, rows: Array<any>, maxRows?: number) {
    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      rows = rows.slice(0, maxRows);
    }

    let tableName = this.formatGroupName(year,eventStatus);
    var table = new MLBSchedulesTableModel(rows);
    return new MLBSchedulesTableData(tableName , table);
  }

  private setupCarouselData(origData, maxRows?: number){
    // console.log(origData);
    var carouselData: SchedulesCarouselInput; // set a variable to the interface
    var carData = [];
    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      origData = origData.slice(0, maxRows);
    }
    origData.forEach(function(val, index){
      let displayNext = '';
      if(origData.eventStatus == 'pre-event'){
        let displayNext = 'Next Game:';
      }else{
        let displayNext = 'Previous Game:';
      }
      carouselData = {//placeholder data
        index:index,
        displayNext: displayNext,
        displayTime:moment(origData.startDateTime).format('dddd MMMM DDDD, YYYY | h:mm A') + " [ZONE]",
        detail1Data:'Home Stadium:',
        detail1Value:"[Stadium's]",
        detail2Value:'[City], [State]',
        imageConfig1:{
          imageClass: "image-125",
          mainImage: {
            imageUrl: "./app/public/placeholder-location.jpg",
            urlRouteArray: ['Disclaimer-page'],
            hoverText: "<p>View</p><p>Profile</p>",
            imageClass: "border-large"
          }
        },
        imageConfig2:{
          imageClass: "image-125",
          mainImage: {
            imageUrl: "./app/public/placeholder-location.jpg",
            urlRouteArray: ['Disclaimer-page'],
            hoverText: "<p>View</p><p>Profile</p>",
            imageClass: "border-large"
          }
        },
        teamName1: 'string',
        teamName2: 'string',
        teamLocation1:'string',
        teamLocation2:'string',
        teamRecord1:'string',
        teamRecord2:'string',
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
