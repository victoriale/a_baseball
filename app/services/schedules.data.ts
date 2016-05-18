import {TableModel, TableColumn} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';
import {TableTabData, TableComponentData} from '../components/schedules/schedules.component';
import {SchedulesCarouselInput} from '../components/carousels/schedules-carousel/schedules-carousel.component';
import {Conference, Division} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';

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
         columnClass: "data-column",
         sortDirection: -1, //descending
         isNumericType: true,
         key: "date"
       },{
         headerValue: "TIME",
         columnClass: "data-column",
         isNumericType: false,
         key: "t"
       },{
         headerValue: "AWAY",
         columnClass: "image-column",
         isNumericType: false,
         key: "away"
       },{
         headerValue: "HOME",
         columnClass: "image-column",
         isNumericType: false,
         key: "home"
       },{
         headerValue: "GAME SUMMARY",
         columnClass: "data-column",
         isNumericType: true,
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
         columnClass: "data-column",
         isNumericType: true,
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
        s = item.startDateTime;
        break;

      case "t":
        s = item.startDateTime;
        break;

      case "away":
        s = item.awayTeamName;
        break;

      case "home":
        s =item.homeTeamName;
        break;

      case "gs":
        s = item.eventStatus;
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
    if ( column.key === "name" ) {
      //TODO-CJP: store after creation? or create each time?
      return {
          imageClass: "image-48",
          mainImage: {
            imageUrl: GlobalSettings.getImageUrl(item.fullImageUrl),
            imageClass: "border-1",
            urlRouteArray: MLBGlobalFunctions.formatTeamRoute(item.teamName,item.teamId.toString()),
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
    return column.key === "name";
  }

  getRouterLinkAt(item, column:TableColumn):Array<any> {
    if ( column.key === "name" ) {
      return MLBGlobalFunctions.formatTeamRoute(item.teamName,item.teamId.toString());
    }
    else {
      return undefined;
    }
  }

  hasRouterLinkAt(column:TableColumn):boolean {
    return column.key === "name";
  }
}
