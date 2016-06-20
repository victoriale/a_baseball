import {TableModel, TableColumn} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';
import {TableTabData, TableComponentData} from '../components/schedules/schedules.component';
import {SchedulesCarouselInput} from '../components/carousels/schedules-carousel/schedules-carousel.component';
import {Conference, Division} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Gradient} from '../global/global-gradient';

declare var moment: any;

//TODO-CJP: Ask backend to return values as numbers and not strings!
export interface SchedulesData {
  index:any;
  backgroundImage: string,
  startDateTime: string,
  eventId: string,
  eventStatus: string,
  homeTeamId: string,
  awayTeamId: string,
  siteId: string,
  homeScore: string,
  awayScore: string,
  homeOutcome: number,
  awayOutcome: number,
  seasonId: string,
  homeTeamLogo: string,
  homeTeamColors: string,
  homeTeamCity: string,
  homeTeamState: string,
  homeTeamVenue: string,
  homeTeamFirstName: string,
  homeTeamLastName: string,
  homeTeamName: string,
  homeTeamNickname: string,
  homeTeamAbbreviation: string,
  homeTeamWins: string,
  homeTeamLosses: string,
  awayTeamLogo: string,
  awayTeamColors: string,
  awayTeamCity: string,
  awayTeamState: string,
  awayTeamVenue: string,
  awayTeamFirstName: string,
  awayTeamLastName: string,
  awayTeamName: string,
  awayTeamNickname: string,
  awayTeamAbbreviation: string,
  awayTeamWins: string,
  awayTeamLosses: string,
  reportUrlMod: string,
  results:string,
  /**
   * - Formatted from league and division values that generated the associated table
   */
  groupName?: string;

  /**
   * - Formatted from the lastUpdatedDate
   */
  displayDate?: string;

  /**
   * Formatted full path to image
   */
  fullImageUrl?: string;

  /**
   * Formatted full path to image
   */
  fullBackgroundImageUrl?: string;

  /**
   * Formatted home record
   */
  homeRecord?: string;

  /**
   * Formatted away record
   */
  awayRecord?: string;
}

export class MLBScheduleTabData implements TableTabData<SchedulesData> {

  title: string;

  display:string;

  dataType: string;

  season: string;

  isActive: boolean;

  sections: Array<MLBSchedulesTableData>;

  constructor(title: string, isActive: boolean) {
    this.title = title;
    this.isActive = isActive;
    this.sections = [];
  }
}

export class MLBSchedulesTableData implements TableComponentData<SchedulesData> {
  groupName: string;

  tableData: any;

  constructor(title: string, table: any) {
    this.groupName = title;
    this.tableData = table;
  }

  updateCarouselData(item: SchedulesData, index:number){//ANY CHANGES HERE CHECK setupTableData in schedules.service.ts
    var displayNext = '';
    if(item.eventStatus == 'pre-event'){
      var displayNext = 'Next Game:';
    }else{
      var displayNext = 'Previous Game:';
    }

    var colors = Gradient.getColorPair(item.awayTeamColors.split(','), item.homeTeamColors.split(','));

    return {//placeholder data
      index:index,
      displayNext: displayNext,
      backgroundGradient: Gradient.getGradientStyles(colors),
      displayTime: moment(item.startDateTime).format('dddd MMMM Do, YYYY | h:mm A') + " ET", //hard coded TIMEZOME since it is coming back from api this way
      detail1Data:'Home Stadium:',
      detail1Value:item.homeTeamVenue,
      detail2Value:item.homeTeamCity + ', ' + item.homeTeamState,
      imageConfig1:{//AWAY
        imageClass: "image-125",
        mainImage: {
          imageUrl: GlobalSettings.getImageUrl(item.awayTeamLogo),
          urlRouteArray: MLBGlobalFunctions.formatTeamRoute(item.awayTeamName, item.awayTeamId),
          hoverText: "<p>View</p><p>Profile</p>",
          imageClass: "border-5"
        }
      },
      imageConfig2:{//HOME
        imageClass: "image-125",
        mainImage: {
          imageUrl: GlobalSettings.getImageUrl(item.homeTeamLogo),
          urlRouteArray: MLBGlobalFunctions.formatTeamRoute(item.homeTeamName, item.homeTeamId),
          hoverText: "<p>View</p><p>Profile</p>",
          imageClass: "border-5"
        }
      },
      teamName1: item.awayTeamName,
      teamName2: item.homeTeamName,
      teamLocation1:item.awayTeamCity + ', ' + item.awayTeamState,
      teamLocation2:item.homeTeamCity + ', ' + item.homeTeamState,
      teamRecord1:item.awayRecord,
      teamRecord2:item.homeRecord,
    };
  }
}

export class MLBSchedulesTableModel implements TableModel<SchedulesData> {
  columns: Array<TableColumn>;

  rows: Array<any>;

  selectedKey:number = -1;

  curTeam:any;//grab the current teams object name being returned to determine where the current team stands (away / home)
  constructor(rows: Array<any>, eventStatus, teamId?) {
    //find if current team is home or away and set the name to the current objects name
    this.curTeam = teamId;
    if(eventStatus === 'pre-event'){
      this.columns = [{
         headerValue: "DATE",
         columnClass: "date-column",
         sortDirection: 1, //desc
         isNumericType: true,
         key: "date"
       },{
         headerValue: "TIME",
         columnClass: "date-column",
         key: "t"
       },{
         headerValue: "AWAY",
         columnClass: "image-column location-column",
         key: "away"
       },{
         headerValue: "HOME",
         columnClass: "image-column location-column",
         key: "home"
       },{
         headerValue: "GAME SUMMARY",
         columnClass: "summary-column",
         ignoreSort: true,
         key: "gs"
       }];
    }else{
      if(typeof teamId == 'undefined'){//for league table model there should not be a teamId coming from page parameters for post game reports
        this.columns = [
        {
           headerValue: "AWAY",
           columnClass: "image-column location-column2",
           isNumericType: false,
           key: "away"
         },{
          headerValue: "HOME",
          columnClass: "image-column location-column2",
          isNumericType: false,
          key: "home"
        },{
           headerValue: "RESULTS",
           columnClass: "data-column results-column",
           isNumericType: false,
           key: "r"
         },{
           headerValue: "GAME SUMMARY",
           columnClass: "summary-column",
           ignoreSort: true,
           key: "gs"
         }];
      }else{ // for team page post game report table model
        this.columns = [{
           headerValue: "DATE",
           columnClass: "date-column",
           sortDirection: -1, //asc
           isNumericType: true,
           key: "date"
         },{
           headerValue: "TIME",
           columnClass: "date-column",
           key: "t"
         },{
           headerValue: "OPPOSING TEAM",
           columnClass: "image-column location-column2",
           isNumericType: false,
           key: 'opp'
         },{
           headerValue: "W/L",
           columnClass: "data-column wl-column",
           isNumericType: false,
           key: "wl"
         },{
           headerValue: "RECORD",
           columnClass: "data-column record-column",
           isNumericType: true,
           key: "rec"
         },{
           headerValue: "GAME SUMMARY",
           columnClass: "summary-column",
           ignoreSort: true,
           key: "gs"
         }];
      }

    }

    this.rows = rows;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
  }

  setRowSelected(rowIndex:number) {
    if ( rowIndex >= 0 && rowIndex < this.rows.length ) {
      this.selectedKey = this.rows[rowIndex].eventId;
    }
    else {
      this.selectedKey = null;
    }
  }

  isRowSelected(item, rowIndex:number): boolean {
    return this.selectedKey == item.eventId;
  }

  //what is displaying in the html
  getDisplayValueAt(item, column:TableColumn):string {

    var homeTeamDisplay = item.homeTeamName;
    var awayTeamDisplay = item.awayTeamName;

    if(typeof item.homeTeamAbbreviation == 'undefined' || item.homeTeamAbbreviation == null){
      item.homeTeamAbbreviation = "N/A";
    }
    if(typeof item.awayTeamAbbreviation == 'undefined' || item.awayTeamAbbreviation == null){
      item.awayTeamAbbreviation = "N/A";
    }
    var home = item.homeTeamAbbreviation + " " + item.homeScore;
    var away = item.awayTeamAbbreviation + " " + item.awayScore;

    var s = "";
    switch (column.key) {
      case "date":
        s = GlobalFunctions.formatDateWithAPMonth(item.startDateTime, "", "DD");
        break;
      case "t":
        s = moment(item.startDateTime).tz('America/New_York').format('h:mm') + " <sup> "+moment(item.startDateTime).tz('America/New_York').format('A')+" </sup>";
        break;

      case "away":
        if(item.awayTeamLastName.length > 10){
          s = "<span class='location-wrap'>"+item.awayTeamNickname+"</span>";
        }else{
          s = "<span class='location-wrap'>"+item.awayTeamLastName+"</span>";
        }
        break;

      case "home":
        if(item.homeTeamLastName.length > 10){
          s = "<span class='location-wrap'>"+item.homeTeamNickname+"</span>";
        }else{
          s = "<span class='location-wrap'>"+item.homeTeamLastName+"</span>";
        }
        break;

      case "opp":
        if(this.curTeam == item.homeTeamId){
          if(item.awayTeamLastName.length > 10){
            s = "<span class='location-wrap'>"+item.awayTeamNickname+"</span>";
          }else{
            s = "<span class='location-wrap'>"+item.awayTeamLastName+"</span>";
          }
        }else{
          if(item.homeTeamLastName.length > 10){
            s = "<span class='location-wrap'>"+item.homeTeamNickname+"</span>";
          }else{
            s = "<span class='location-wrap'>"+item.homeTeamLastName+"</span>";
          }
        }

        break;

      case "gs":
        if(item.eventStatus === 'pre-event'){
          s = "<a href='"+item.reportUrlMod+"'>Pregame Report <i class='fa fa-angle-right'><i></a>";
        }else if(item.eventStatus === 'post-event'){
          s = "<a href='"+item.reportUrlMod+"'>Postgame Report <i class='fa fa-angle-right'><i></a>";
        }else{
          s = "N/A";
        }
        break;

      case "r":
        //whomever wins the game then their text gets bolded as winner
        if(item.homeOutcome == 'win'){
          home = "<span class='text-heavy'>" + home + "</span>";
        }else if(item.awayOutcome == 'win'){
          away = "<span class='text-heavy'>" + away + "</span>";
        }
          s = home + " - " + away;
        break;

      case "wl":
        //shows the current teams w/l of the current game
        if(this.curTeam == item.homeTeamId){
          s = item.homeOutcome.charAt(0).toUpperCase() + " " + item.homeScore + " - " + item.awayScore;
        }else{
          s = item.awayOutcome.charAt(0).toUpperCase() + " " + item.awayScore + " - " + item.homeScore;
        }
        break;

      case "rec":
        //shows the record of the current teams game at that time
          s = item.targetTeamWinsCurrent + " - " + item.targetTeamLossesCurrent;
        break;
    }
    return s;
  }

  getSortValueAt(item, column:TableColumn) {
    var o = null;
    switch (column.key) {
      case "date":
        o = item.startDateTime;
        break;

      case "t":
        o = item.startDateTime;
        break;

      case "away":
        o = item.awayTeamName;
        break;

      case "home":
        o =item.homeTeamName;
        break;

      case "opp":
        if(this.curTeam == item.homeTeamId){
          o = item.awayTeamName;
        }else{
          o = item.homeTeamName;
        }
        break;

      case "gs":
        o = item.eventStatus;
        break;

      case "r":
        o = item.results;
        break;

      case "wl":
        o = item.homeOutcome;
        break;

      case "rec":
        o = item.homeScore;
        break;
    }
    return o;
  }

  getImageConfigAt(item, column:TableColumn):CircleImageData {
    if ( column.key === "away") {
      //TODO-CJP: store after creation? or create each time?
      return {
          imageClass: "image-48",
          mainImage: {
            imageUrl: GlobalSettings.getImageUrl(item.awayTeamLogo),
            imageClass: "border-1",
            urlRouteArray: MLBGlobalFunctions.formatTeamRoute(item.awayTeamName,item.awayTeamId.toString()),
            hoverText: "<i class='fa fa-mail-forward'></i>",
          },
          subImages: []
        };
    }else if ( column.key === "home") {
      //TODO-CJP: store after creation? or create each time?
      return {
          imageClass: "image-48",
          mainImage: {
            imageUrl: GlobalSettings.getImageUrl(item.homeTeamLogo),
            imageClass: "border-1",
            urlRouteArray: MLBGlobalFunctions.formatTeamRoute(item.homeTeamName,item.homeTeamId.toString()),
            hoverText: "<i class='fa fa-mail-forward'></i>",
          },
          subImages: []
        };
    }else if (column.key === 'opp'){
      if(this.curTeam == item.homeTeamId){
        return {
            imageClass: "image-48",
            mainImage: {
              imageUrl: GlobalSettings.getImageUrl(item.awayTeamLogo),
              imageClass: "border-1",
              urlRouteArray: MLBGlobalFunctions.formatTeamRoute(item.awayTeamName,item.awayTeamId.toString()),
              hoverText: "<i class='fa fa-mail-forward'></i>",
            },
            subImages: []
          };
      }else{
        return {
            imageClass: "image-48",
            mainImage: {
              imageUrl: GlobalSettings.getImageUrl(item.homeTeamLogo),
              imageClass: "border-1",
              urlRouteArray: MLBGlobalFunctions.formatTeamRoute(item.homeTeamName,item.homeTeamId.toString()),
              hoverText: "<i class='fa fa-mail-forward'></i>",
            },
            subImages: []
          };
      }
    }
    else {
      return undefined;
    }
  }

  hasImageConfigAt(column:TableColumn):boolean {
    return (column.key === "home" || column.key === "away" || column.key === "opp");
  }

  getRouterLinkAt(item, column:TableColumn):Array<any> {
    if ( column.key === "home" ) {
      return MLBGlobalFunctions.formatTeamRoute(item.homeTeamName,item.homeTeamId.toString());
    }else if ( column.key === "away" ) {
      return MLBGlobalFunctions.formatTeamRoute(item.awayTeamName,item.awayTeamId.toString());
    }else if ( column.key === "opp" ){
      if(this.curTeam == item.homeTeamId){
        return MLBGlobalFunctions.formatTeamRoute(item.awayTeamName,item.awayTeamId.toString());
      }else{
        return MLBGlobalFunctions.formatTeamRoute(item.homeTeamName,item.homeTeamId.toString());
      }
    }
    else {
      return undefined;
    }
  }

  hasRouterLinkAt(column:TableColumn):boolean {
    return (column.key === "home" || column.key === "away" || column.key === "opp");
  }
}
