import {TableModel, TableColumn} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';
import {TableTabData, TableComponentData} from '../components/season-stats/season-stats.component';
import {SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
import {Conference, Division} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';

//TODO-CJP: Ask backend to return values as numbers and not strings!
export interface TeamSeasonStatsData {
  teamName: string,
  imageUrl: string,
  backgroundImage: string,
  teamId: number;
  conferenceName: string,
  divisionName: string,
  lastUpdated: string,
  rank: number,
  totalWins: number,
  totalLosses: number,
  winPercentage: number,
  streakType: string,
  streakCount: number,
  batRunsScored: number,
  pitchRunsAllowed: number,
  gamesBack: number,
  seasonId: string,
  year: number,
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

export class MLBSeasonStatsTableData implements TableComponentData<TeamSeasonStatsData> {
  groupName: string;

  tableData: MLBSeasonStatsTableModel;

  conference: Conference;

  division: Division;

  constructor(title: string, conference: Conference, division: Division, table: MLBSeasonStatsTableModel) {
    this.groupName = title;
    this.conference = conference;
    this.division = division;
    this.tableData = table;
  }

}

export class MLBSeasonStatsTabData implements TableTabData<TeamSeasonStatsData> {

  title: string;

  isActive: boolean;

  isLoaded: boolean;

  hasError: boolean;

  sections: Array<MLBSeasonStatsTableData>;

  conference: Conference;

  division: Division;

  constructor(title: string, conference: Conference, division: Division, isActive: boolean) {
    this.title = title;
    this.conference = conference;
    this.division = division;
    this.isActive = isActive;
  }

  convertToCarouselItem(item: TeamSeasonStatsData, index:number): SliderCarouselInput {
    var subheader = item.seasonId + " Season Stats Report";
    var description = "Team: <span class='text-heavy'>" + item.teamName + "</span>";
    return {
      index: index,
      backgroundImage: item.fullBackgroundImageUrl, //optional
      description: [
        "<div class='season-stats-car-subhdr'><i class='fa fa-circle'></i>" + subheader + "</div>",
        "<div class='season-stats-car-hdr'>" + item.teamName + "</div>",
        "<div class='season-stats-car-desc'>" + description + "</div>",
        "<div class='season-stats-car-date'>Last Updated On " + item.displayDate + "</div>"
      ],
      imageConfig: {
        imageClass: "image-150",
        mainImage: {
          imageClass: "border-10",
          urlRouteArray: MLBGlobalFunctions.formatTeamRoute(item.teamName,item.teamId.toString()),
          imageUrl: item.fullImageUrl,
          hoverText: "<p>View</p><p>Profile</p>"
        },
        subImages: [
          {
              imageUrl: item.fullImageUrl,
              urlRouteArray: MLBGlobalFunctions.formatTeamRoute(item.teamName,item.teamId.toString()),
              hoverText: "<i class='fa fa-mail-forward'></i>",
              imageClass: "image-50-sub image-round-lower-right"
          },
        ]
      }
    };
  }
}

export class MLBSeasonStatsTableModel implements TableModel<TeamSeasonStatsData> {
  // title: string;

  columns: Array<TableColumn> = [
    {
      headerValue: "Year",
      columnClass: "data-column",
      isNumericType: true,
      key: "year"
    },{
      headerValue: "Team",
      columnClass: "location-column",
      isNumericType: false,
      key: "team"
    },{
      headerValue: "R",
      columnClass: "data-column",
      isNumericType: true,
      key: "r"
    },{
      headerValue: "H",
      columnClass: "data-column",
      isNumericType: true,
      key: "h"
    },{
      headerValue: "HR",
      columnClass: "data-column",
      isNumericType: true,
      sortDirection: -1, //descending
      key: "hr"
    },{
      headerValue: "RBI",
      columnClass: "data-column",
      isNumericType: true,
      key: "rbi"
    },{
      headerValue: "BB",
      columnClass: "data-column",
      isNumericType: true,
      key: "bb"
    },{
      headerValue: "AVG",
      columnClass: "data-column",
      isNumericType: true,
      key: "avg"
    },{
      headerValue: "OBP",
      columnClass: "data-column",
      isNumericType: true,
      key: "obp"
    },{
      headerValue: "SLG",
      columnClass: "data-column",
      isNumericType: true,
      key: "slg"
    }];

  rows: Array<TeamSeasonStatsData>;

  selectedKey:number = -1;

  constructor(rows: Array<TeamSeasonStatsData>) {
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

  isRowSelected(item:TeamSeasonStatsData, rowIndex:number): boolean {
    return this.selectedKey == item.teamId;
  }
  //TODO using standing api
  getDisplayValueAt(item:TeamSeasonStatsData, column:TableColumn):string {
    var s = null;
    switch (column.key) {
      case "year":
        s = "2016"; //TODO
        break;

      case "team":
        s = item.teamName;
        break;

      case "r":
        s = item.totalWins != null ? item.totalWins.toString() : null;
        break;

      case "h":
        s = item.totalLosses != null ? item.totalLosses.toString() : null;
        break;

      case "hr":
        s = item.winPercentage != null ? item.winPercentage.toPrecision(3) : null;
        break;

      case "rbi":
        // s = item.gamesBack != null ? (item.gamesBack == 0 ? "-" : item.gamesBack.toString()) : null;
        s = item.gamesBack != null ? item.gamesBack.toString() : null;
        break;

      case "bb":
        s = item.batRunsScored != null ? item.batRunsScored.toString() : null;
        break;

      case "avg":
        s = item.pitchRunsAllowed != null ? item.pitchRunsAllowed.toString() : null;
        break;

      case "obp":
        s = item.pitchRunsAllowed != null ? item.pitchRunsAllowed.toString() : null;
        break;

      case "slg":
        s = item.pitchRunsAllowed != null ? item.pitchRunsAllowed.toString() : null;
        break;
    }
    return s != null ? s : "N/A";
  }

  getSortValueAt(item:TeamSeasonStatsData, column:TableColumn):any {
    var o = null;
    switch (column.key) {
      case "year":
        o = "2016";//TODO
        break;

      case "team":
        o = item.teamName;
        break;

      case "r":
        o = item.totalWins;
        break;

      case "h":
        o = item.totalLosses;
        break;

      case "hr":
        o = item.winPercentage;
        break;

      case "rbi":
        o = item.gamesBack;
        break;

      case "bb":
        o = item.batRunsScored;
        break;

      case "avg":
        o = item.pitchRunsAllowed;
        break;

      case "obp":
        o = item.pitchRunsAllowed;
        break;

      case "slg":
        o = item.pitchRunsAllowed;
        break;
    }
    return o;
  }

  getImageConfigAt(item:TeamSeasonStatsData, column:TableColumn):CircleImageData {
      return undefined;
  }

  hasImageConfigAt(column:TableColumn):boolean {
    return undefined;
  }

  getRouterLinkAt(item:TeamSeasonStatsData, column:TableColumn):Array<any> {
    if ( column.key === "team" ) {
      return MLBGlobalFunctions.formatTeamRoute(item.teamName,item.teamId.toString());
    }
    else {
      return undefined;
    }
  }

  hasRouterLinkAt(column:TableColumn):boolean {
    return column.key === "team";
  }
}
