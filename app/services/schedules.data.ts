import {TableModel, TableColumn} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';
import {TableTabData, TableComponentData} from '../components/schedules/schedules.component';
import {SchedulesCarouselInput} from '../components/carousels/schedules-carousel/schedules-carousel.component';
import {Conference, Division} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';

//TODO-CJP: Ask backend to return values as numbers and not strings!
export interface SchedulesData {
  homeImageUrl: string,
  awayImageUrl: string,
  backgroundImage: string,
  teamId: number;
  eventId: string,
  stateDateTime: string,
  eventStatus: string,
  siteId: number,
  homeTeamId: number,
  awatTeamId: number,
  homeScore: number,
  awayScore: string,
  homeOutcome: number,
  awayOutcome: number,
  seasonId: string,
  homeTeamName: number,
  awayTeamName: number,
  reportUrlMod: number,

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

export class MLBSchedulesTableData implements TableComponentData<any> {
  groupName: string;

  tableData: MLBSchedulesTableModel;

  conference: Conference;

  division: Division;

  constructor(title: string, conference: Conference, division: Division, table: MLBSchedulesTableModel) {
    this.groupName = title;
    this.conference = conference;
    this.division = division;
    this.tableData = table;
  }

}

export class MLBSchedulesTabData implements TableTabData<any> {

  title: string;

  isActive: boolean;

  sections: Array<MLBSchedulesTableData>;

  conference: Conference;

  division: Division;

  constructor(title: string, conference: Conference, division: Division, isActive: boolean) {
    this.title = title;
    this.conference = conference;
    this.division = division;
    this.isActive = isActive;
    this.sections = [];
  }

  convertToCarouselItem(item: any, index:number) {
  return 'to be continued...'
  }
}

export class MLBSchedulesTableModel implements TableModel<any> {
  // title: string;

  columns: Array<TableColumn> = [{
      headerValue: "DATE",
      columnClass: "data-column",
      sortDirection: -1, //descending
      isNumericType: false,
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
      columnClass: "data-column",
      isNumericType: false,
      key: "home"
    },{
      headerValue: "GAME SUMMARY",
      columnClass: "data-column",
      isNumericType: true,
      key: "gs"
    }];

  rows: Array<any>;

  selectedKey:number = -1;

  constructor(rows: Array<any>) {
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
    return this.selectedKey == item.teamId;
  }

  getDisplayValueAt(item, column:TableColumn):string {
    var s = "";
    switch (column.key) {
      case "date":
        s = item.stateDateTime;
        break;

      case "t":
        s = item.stateDateTime;
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
    }
    /*
    homeImageUrl: string,
    awayImageUrl: string,
    backgroundImage: string,
    teamId: number;
    eventId: string,
    stateDateTime: string,
    eventStatus: string,
    siteId: number,
    homeTeamId: number,
    awatTeamId: number,
    homeScore: number,
    awayScore: string,
    homeOutcome: number,
    awayOutcome: number,
    seasonId: string,
    homeTeamName: number,
    awayTeamName: number,
    reportUrlMod: number,
    */
    return s;
  }

  getSortValueAt(item, column:TableColumn) {
    var o = null;
    switch (column.key) {
      case "name":
        o = item.teamName;
        break;

      case "w":
        o = item.totalWins;
        break;

      case "l":
        o = item.totalLosses;
        break;

      case "pct":
        o = item.winPercentage;
        break;

      case "gb":
        o = item.gamesBack;
        break;

      case "rs":
        o = item.batRunsScored;
        break;

      case "ra":
        o = item.pitchRunsAllowed;
        break;

      case "strk":
        var str = item.streakCount.toString();
        o = (item.streakType == "loss" ? "L-" : "W-") + ('0000' + str).substr(str.length); //pad with zeros
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
            imageUrl: item.fullImageUrl,
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
