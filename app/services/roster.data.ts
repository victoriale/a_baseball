import {TableModel, TableColumn} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';
import {RosterTableTabData, TableComponentData} from '../components/roster/roster.component';
import {SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
import {Conference, Division} from '../global/global-interface';

export interface TeamRosterData {
  teamName: string,
  imageUrl: string,
  teamId: number;
  conferenceName: string,
  divisionName: string,
  lastUpdatedDate: Date,
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
  groupName?: string

  /**
   * - Formatted from the lastUpdatedDate
   */
  displayDate?: string
}

export class RosterTableData implements TableComponentData<TeamRosterData> {
  groupName: string;

  tableData: RosterTableModel;

  conference: Conference;

  division: Division;

  constructor(title: string, conference: Conference, division: Division, table: RosterTableModel) {
    this.groupName = title;
    this.conference = conference;
    this.division = division;
    this.tableData = table;
  }

}

export class RosterTabData implements RosterTableTabData<TeamRosterData> {

  title: string;

  isActive: boolean;

  sections: Array<RosterTableData>;

  conference: Conference;

  division: Division;

  constructor(title: string, conference: Conference, division: Division, isActive: boolean) {
    this.title = title;
    this.conference = conference;
    this.division = division;
    this.isActive = isActive;
    this.sections = [];
  }

  convertToCarouselItem(item: TeamRosterData, index:number): SliderCarouselInput {
    var subheader = item.seasonId + " Season " + item.groupName + " Standings";
    var description = item.teamName + " is currently <span class='text-heavy'>ranked " + item.rank + "</span>" +
                      " in the <span class='text-heavy'>" + item.groupName + "</span>, with a record of " +
                      "<span class='text-heavy'>" + item.totalWins + " - " + item.totalLosses + "</span>.";
    return {
      index: index,
      //backgroundImage: null, //optional
      description: [
        "<div class='standings-car-subhdr'>" + subheader + "</div>",
        "<div class='standings-car-hdr'>" + item.teamName + "</div>",
        "<div class='standings-car-desc'>" + description + "</div>",
        "<div class='standings-car-date'>Last Updated On " + item.displayDate + "</div>"
      ],
      imageConfig: {
        imageClass: "image-150",
        mainImage: {
          imageClass: "border-10",
          urlRouteArray: ["Team-page", { teamID: item.teamId }],
          imageUrl: item.imageUrl,
          hoverText: "<p>View</p><p>Profile</p>"
        },
        subImages: []
      }
    };
  }
}

export class RosterTableModel implements TableModel<TeamRosterData> {
  title: string;

  columns: Array<TableColumn> = [{
      headerValue: "Player",
      columnClass: "image-column",
      key: "name"
    },{
      headerValue: "Pos.",
      columnClass: "data-column",
      isNumericType: true,
      key: "w"
    },{
      headerValue: "Height",
      columnClass: "data-column",
      isNumericType: true,
      key: "l"
    },{
      headerValue: "Weight",
      columnClass: "data-column",
      isNumericType: true,
      sortDirection: -1, //descending
      key: "pct"
    },{
      headerValue: "Age",
      columnClass: "data-column",
      isNumericType: true,
      key: "gb"
    },{
      headerValue: "Salary",
      columnClass: "data-column",
      isNumericType: true,
      key: "rs"
    }
  ];

  rows: Array<TeamRosterData>;

  selectedKey:number = -1;

  constructor(title:string, rows: Array<TeamRosterData>) {
    this.title = title;
    this.rows = rows;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
    else if ( rows.length > 0 ) {
      this.selectedKey = rows[0].teamId;
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

  isRowSelected(item:TeamRosterData, rowIndex:number): boolean {
    return this.selectedKey == item.teamId;
  }

  getDisplayValueAt(item:TeamRosterData, column:TableColumn):string {
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
        s = item.winPercentage.toString();
        break;

      case "gb":
        s = item.gamesBack === 0 ? "-" : item.gamesBack.toString();
        break;

      case "rs":
        s = item.batRunsScored.toString();
        break;
    }
    return s;
  }

  getSortValueAt(item:TeamRosterData, column:TableColumn):any {
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
    }
    return o;
  }

  getImageConfigAt(item:TeamRosterData, column:TableColumn):CircleImageData {
    if ( column.key === "name" ) {
      //TODO-CJP: store after creation? or create each time?
      return {
          imageClass: "image-50",
          mainImage: {
            imageUrl: item.imageUrl,
            imageClass: "border-2",
            urlRouteArray: ["Team-page", { teamID: item.teamId }],
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
  
  getRouterLinkAt(item:TeamRosterData, column:TableColumn):CircleImageData {
    return undefined;
  }
  
  hasRouterLinkAt(column:TableColumn):boolean {
    return false;
  }  
}
