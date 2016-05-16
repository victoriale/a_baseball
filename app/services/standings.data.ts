import {TableModel, TableColumn} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';
import {TableTabData, TableComponentData} from '../components/standings/standings.component';
import {SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
import {Conference, Division} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';

//TODO-CJP: Ask backend to return values as numbers and not strings!
export interface TeamStandingsData {
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

export class MLBStandingsTableData implements TableComponentData<TeamStandingsData> {
  groupName: string;

  tableData: MLBStandingsTableModel;

  conference: Conference;

  division: Division;

  constructor(title: string, conference: Conference, division: Division, table: MLBStandingsTableModel) {
    this.groupName = title;
    this.conference = conference;
    this.division = division;
    this.tableData = table;
  }

}

export class MLBStandingsTabData implements TableTabData<TeamStandingsData> {

  title: string;

  isActive: boolean;

  sections: Array<MLBStandingsTableData>;

  conference: Conference;

  division: Division;

  constructor(title: string, conference: Conference, division: Division, isActive: boolean) {
    this.title = title;
    this.conference = conference;
    this.division = division;
    this.isActive = isActive;
    this.sections = [];
  }

  convertToCarouselItem(item: TeamStandingsData, index:number): SliderCarouselInput {
    var subheader = item.seasonId + " Season " + item.groupName + " Standings";
    var description = item.teamName + " is currently <span class='text-heavy'>ranked " + item.rank + GlobalFunctions.Suffix(item.rank) + "</span>" +
                      " in the <span class='text-heavy'>" + item.groupName + "</span>, with a record of " +
                      "<span class='text-heavy'>" + item.totalWins + " - " + item.totalLosses + "</span>.";

    return {
      index: index,
      backgroundImage: item.fullBackgroundImageUrl, //optional
      description: [
        "<div class='standings-car-subhdr'><i class='fa fa-circle'></i>" + subheader + "</div>",
        "<div class='standings-car-hdr'>" + item.teamName + "</div>",
        "<div class='standings-car-desc'>" + description + "</div>",
        "<div class='standings-car-date'>Last Updated On " + item.displayDate + "</div>"
      ],
      imageConfig: {
        imageClass: "image-150",
        mainImage: {
          imageClass: "border-10",
          urlRouteArray: MLBGlobalFunctions.formatTeamRoute(item.teamName,item.teamId.toString()),
          imageUrl: item.fullImageUrl,
          hoverText: "<p>View</p><p>Profile</p>"
        },
        subImages: []
      }
    };
  }
}

export class MLBStandingsTableModel implements TableModel<TeamStandingsData> {
  // title: string;

  columns: Array<TableColumn> = [{
      headerValue: "Team Name",
      columnClass: "image-column",
      key: "name"
    },{
      headerValue: "W",
      columnClass: "data-column",
      isNumericType: true,
      key: "w"
    },{
      headerValue: "L",
      columnClass: "data-column",
      isNumericType: true,
      key: "l"
    },{
      headerValue: "PCT",
      columnClass: "data-column",
      isNumericType: true,
      sortDirection: -1, //descending
      key: "pct"
    },{
      headerValue: "GB",
      columnClass: "data-column",
      isNumericType: true,
      key: "gb"
    },{
      headerValue: "RS",
      columnClass: "data-column",
      isNumericType: true,
      key: "rs"
    },{
      headerValue: "RA",
      columnClass: "data-column",
      isNumericType: true,
      key: "ra"
    },{
      headerValue: "STRK",
      columnClass: "data-column",
      isNumericType: true,
      key: "strk"
    }];

  rows: Array<TeamStandingsData>;

  selectedKey:number = -1;

  constructor(rows: Array<TeamStandingsData>) {
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

  isRowSelected(item:TeamStandingsData, rowIndex:number): boolean {
    return this.selectedKey == item.teamId;
  }

  getDisplayValueAt(item:TeamStandingsData, column:TableColumn):string {
    var s = "";
    switch (column.key) {
      case "name":
        s = item.teamName;
        break;

      case "w":
        s = item.totalWins.toString();
        break;

      case "l":
        s = item.totalLosses.toString();
        break;

      case "pct":
        s =item.winPercentage.toPrecision(3);
        break;

      case "gb":
        s = item.gamesBack == 0 ? "-" : item.gamesBack.toString();
        break;

      case "rs":
        s = item.batRunsScored.toString();
        break;

      case "ra":
        s = item.pitchRunsAllowed.toString();
        break;

      case "strk":
        var str = item.streakCount.toString();
        s = (item.streakType == "loss" ? "L-" : "W-") + item.streakCount.toString();
        break;
    }
    return s;
  }

  getSortValueAt(item:TeamStandingsData, column:TableColumn):any {
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

  getImageConfigAt(item:TeamStandingsData, column:TableColumn):CircleImageData {
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

  getRouterLinkAt(item:TeamStandingsData, column:TableColumn):Array<any> {
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
