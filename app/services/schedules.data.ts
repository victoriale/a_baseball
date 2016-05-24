import {TableModel, TableColumn} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';
import {TableTabData, TableComponentData} from '../components/schedules/schedules.component';
import {SchedulesCarouselInput} from '../components/carousels/schedules-carousel/schedules-carousel.component';
import {Conference, Division} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';

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

  tableData: MLBSchedulesTableModel;

  constructor(title: string, table: MLBSchedulesTableModel) {
    this.groupName = title;
    this.tableData = table;
  }
}

export class MLBSchedulesTableModel implements TableModel<SchedulesData> {
  // title: string;
  isTeamId: boolean = true;
  columns: Array<TableColumn>;

  rows: Array<any>;

  selectedKey:number = -1;

  constructor(rows: Array<any>) {

    if(this.isTeamId){
      this.columns = [{
         headerValue: "DATE",
         columnClass: "date-column",
         sortDirection: -1, //descending
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
      this.columns = [{
        headerValue: "HOME",
        columnClass: "image-column",
        isNumericType: false,
        key: "home"
      },{
         headerValue: "AWAY",
         columnClass: "image-column",
         isNumericType: false,
         key: "away"
       },{
         headerValue: "RESULTS",
         columnClass: "data-column",
         isNumericType: false,
         key: "r"
       },{
         headerValue: "GAME SUMMARY",
         columnClass: "data-column summary-link",
         isNumericType: false,
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
      this.selectedKey = this.rows[rowIndex].teamId;
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
    var s = "";
    switch (column.key) {
      case "date":
        s = moment(item.startDateTime).format('MMM DD');
        break;
      case "t":
        s = moment(item.startDateTime).format('h:mm a');
        break;

      case "away":
        s = "<span class='location-wrap'>"+item.awayTeamName+"</span>";
        break;

      case "home":
        s = "<span class='location-wrap'>"+item.homeTeamName+"</span>";
        break;

      case "gs":
        if(item.eventStatus === 'pre-event'){
          s = "Pregame Report <i class='fa fa-angle-right'><i>";
        }else if(item.eventStatus === 'post-event'){
          s = "Postgame Report <i class='fa fa-angle-right'><i>";
        }else{
          s = "N/A";
        }
        break;

      case "r":
        s = item.results;
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
