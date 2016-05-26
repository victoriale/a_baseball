import {TableModel, TableColumn} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';
import {TableTabData, TableComponentData} from '../components/schedules/schedules.component';
import {SchedulesCarouselInput} from '../components/carousels/schedules-carousel/schedules-carousel.component';
import {Conference, Division} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Gradient} from '../global/global-gradient';

declare var moment;

//TODO-CJP: Ask backend to return values as numbers and not strings!
export interface SchedulesData {
  backgroundImage: string,
  eventId: string,
  stateDateTime: string,
  eventStatus: string,
  homeTeamId: number,
  awayTeamId: number,
  siteId: number,
  homeScore: number,
  awayScore: string,
  homeOutcome: number,
  awayOutcome: number,
  seasonId: string,
  homeTeamLogo: string,
  awayTeamLogo: string,
  homeTeamName: number,
  awayTeamName: number,
  reportUrlMod: number,
  results:string,
  teamId: number;
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

  convertToCarouselItem(item: SchedulesData, index:number) {
    return null;
  }
}

export class MLBSchedulesTableData implements TableComponentData<SchedulesData> {
  groupName: string;

  tableData: any;

  constructor(title: string, table: any) {
    this.groupName = title;
    this.tableData = table;
  }

  updateCarouselData(item, index){//ANY CHANGES HERE CHECK setupTableData in schedules.service.ts
    var displayNext = '';
    if(item.eventStatus == 'pre-event'){
      var displayNext = 'Next Game:';
    }else{
      var displayNext = 'Previous Game:';
    }
    return {//placeholder data
      index:index,
      displayNext: displayNext,
      backgroundGradient: Gradient.getGradientStyles([item.awayTeamColors.split(',')[0],item.homeTeamColors.split(',')[0]]),
      displayTime:moment(item.startDateTime).format('dddd MMMM Do, YYYY | h:mm A') + " ET", //hard coded TIMEZOME since it is coming back from api this way
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

  constructor(rows: Array<any>, eventStatus) {

    if(eventStatus === 'pre-event'){
      this.columns = [{
         headerValue: "DATE",
         columnClass: "date-column",
         sortDirection: 1, //ascending
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

    if(typeof item.homeTeamAbbr == 'undefined'){
      item.homeTeamAbbr = "N/A";
    }
    if(typeof item.awayTeamAbbr == 'undefined'){
      item.awayTeamAbbr = "N/A";
    }
    var home = item.homeTeamAbbr + " " + item.homeScore;
    var away = item.awayTeamAbbr + " " + item.awayScore;

    var s = "";
    switch (column.key) {
      case "date":
        s = moment(item.startDateTime).format('MMM DD');
        break;
      case "t":
        s = moment(item.startDateTime).format('h:mm') + " <sup> "+moment(item.startDateTime).format('A')+" </sup>";
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

      case "gs":
        if(item.eventStatus === 'pre-event'){
          s = "<a>Pregame Report <i class='fa fa-angle-right'><i></a>";
        }else if(item.eventStatus === 'post-event'){
          s = "<a>Postgame Report <i class='fa fa-angle-right'><i></a>";
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

      case "gs":
        o = item.eventStatus;
        break;

      case "r":
        o = item.results;
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
    }
    else {
      return undefined;
    }
  }

  hasImageConfigAt(column:TableColumn):boolean {
    return (column.key === "home" || column.key === "away");
  }

  getRouterLinkAt(item, column:TableColumn):Array<any> {
    if ( column.key === "home" ) {
      return MLBGlobalFunctions.formatTeamRoute(item.homeTeamName,item.homeTeamId.toString());
    }else if ( column.key === "away" ) {
      return MLBGlobalFunctions.formatTeamRoute(item.awayTeamName,item.awayTeamId.toString());
    }
    else {
      return undefined;
    }
  }

  hasRouterLinkAt(column:TableColumn):boolean {
    return (column.key === "home" || column.key === "away");
  }
}
