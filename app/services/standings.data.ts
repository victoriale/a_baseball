import {TableModel, TableColumn, CellData} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';
import {StandingsTableTabData, TableComponentData} from '../components/standings/standings.component';
import {SliderCarousel, SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
import {Conference, Division} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';

export interface TeamStandingsData {
  teamName: string,
  imageUrl: string,
  backgroundImage: string,
  teamId: string;
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

export class MLBStandingsTabData implements StandingsTableTabData<TeamStandingsData> {

  title: string;

  isActive: boolean;

  isLoaded: boolean;

  hasError: boolean;

  sections: Array<MLBStandingsTableData>;

  conference: Conference;

  division: Division;

  selectedKey: string;

  currentTeamId: string;

  constructor(title: string, conference: Conference, division: Division, isActive: boolean, teamId: string) {
    this.title = title;
    this.conference = conference;
    this.division = division;
    this.isActive = isActive;
    this.currentTeamId = teamId;
  }

  getSelectedKey(): string {
    if ( !this.sections ) return "";

    var key = "";
    this.sections.forEach(section => {
      var table = section.tableData;
      if ( table.selectedKey != null && table.selectedKey != "") {
        key = table.selectedKey;
      }
    });
    return key;
  }

  setSelectedKey(key:string) {
    this.selectedKey = key;
    if ( !this.sections ) return;

    this.sections.forEach(section => {
      var table = section.tableData;
      if ( table.rows.filter(row => row.teamId == key).length > 0 ) {
        table.selectedKey = key;
      }
      else {
        table.selectedKey = "";
      }
    });
  }

  convertToCarouselItem(item: TeamStandingsData, index:number): SliderCarouselInput {
    var teamRoute = null;
    if ( this.currentTeamId != item.teamId ) {
      teamRoute = MLBGlobalFunctions.formatTeamRoute(item.teamName, item.teamId.toString());
    }
    var teamNameLink = {
        route: teamRoute,
        text: item.teamName
    };
    return SliderCarousel.convertToCarouselItemType1(index, {
      backgroundImage: item.fullBackgroundImageUrl,
      copyrightInfo: GlobalSettings.getCopyrightInfo(),
      subheader: [item.seasonId + " Season " + item.groupName + " Standings"],
      profileNameLink: teamNameLink,
      description:[
          "The ", teamNameLink,
          " are currently <span class='text-heavy'>ranked " + item.rank + GlobalFunctions.Suffix(item.rank) +
          "</span>" + " in the <span class='text-heavy'>" + item.groupName +
          "</span>, with a record of " + "<span class='text-heavy'>" + item.totalWins + " - " + item.totalLosses +
          "</span>."
      ],
      lastUpdatedDate: item.displayDate,
      circleImageUrl: item.fullImageUrl,
      circleImageRoute: teamRoute
    });
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

  selectedKey: string = "";

  /**
   * The team id of the profile page displaying the Standings module. (Optional)
   */
  currentTeamId: string;

  constructor(rows: Array<TeamStandingsData>, teamId: string) {
    this.rows = rows;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
    this.currentTeamId = teamId;
  }

  setSelectedKey(key: string) {
    this.selectedKey = key ? key.toString() : key;
  }

  getSelectedKey(): string {
    return this.selectedKey;
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

  getCellData(item:TeamStandingsData, column:TableColumn):CellData {
    var display = null;
    var sort: any = null;
    var link: Array<any> = null;
    var imageUrl: string = null;
    switch (column.key) {
      case "name":
        display = item.teamName;
        sort = item.teamName;
        if ( item.teamId != this.currentTeamId ) {
          link = MLBGlobalFunctions.formatTeamRoute(item.teamName,item.teamId.toString());
        }
        imageUrl = item.fullImageUrl;
        break;

      case "w":
        display = item.totalWins != null ? item.totalWins.toString() : null;
        sort = item.totalWins;
        break;

      case "l":
        display = item.totalLosses != null ? item.totalLosses.toString() : null;
        sort = item.totalLosses;
        break;

      case "pct":
        display = item.winPercentage != null ? item.winPercentage.toPrecision(3) : null;
        sort = item.winPercentage;
        break;

      case "gb":
        display = item.gamesBack != null ? item.gamesBack.toString() : null;
        sort = item.gamesBack;
        break;

      case "rs":
        display = item.batRunsScored != null ? item.batRunsScored.toString() : null;
        sort = item.batRunsScored;
        break;

      case "ra":
        display = item.pitchRunsAllowed != null ? item.pitchRunsAllowed.toString() : null;
        sort = item.pitchRunsAllowed;
        break;

      case "strk":
        if ( item.streakCount != null && item.streakType ) {
          var str = item.streakCount.toString();
          display = (item.streakType == "loss" ? "L-" : "W-") + item.streakCount.toString();
          sort = (item.streakType == "loss" ? -1 : 1) * item.streakCount;
        }
        break;
    }
    if ( display == null ) {
      display = "N/A";
    }
    return new CellData(display, sort, link, imageUrl);
  }
}
