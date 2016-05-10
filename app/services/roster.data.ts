import {TableModel, TableColumn} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';
import {RosterTableTabData, TableComponentData} from '../components/roster/roster.component';
import {SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
import {Conference, Division} from '../global/global-interface';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';

export interface TeamRosterData {
  imageUrl: string,
  teamId: string,
  teamName: string,
  playerName: string,
  playerFirstName:string,
  playerLastName: string,
  playerId:string,
  roleStatus: string,
  active: string,
  uniformNumber: string,
  position:string,
  depth: string,
  weight: string,
  height: string,
  birthDate: string,
  city: string,
  area: string,
  country: string,
  heightInInches: string,
  age: string,
  salary: number,
  lastUpdatedDate: Date,

  /**
   * - Formatted from league and division values that generated the associated table
   */
  groupName?: string

  /**
   * - Formatted from the lastUpdatedDate
   */
  displayDate?: string
}

export class RosterTableData {
  groupName: string;

  tableData: RosterTableModel;

  constructor(title: string, table: RosterTableModel, private _globalFunctions:GlobalFunctions, private _mlbGF: MLBGlobalFunctions) {
    this.groupName = title;
    this.tableData = table;
  }

}

export class RosterTabData {

  title: string;

  isActive: boolean;

  sections: Array<RosterTableData>;

  constructor(title: string, isActive: boolean) {
    this.title = title;
    this.isActive = isActive;
    this.sections = [];
  }

}

export class RosterTableModel {
  title: string;

  columns: Array<TableColumn> = [{
      headerValue: "Player",
      columnClass: "image-column",
      key: "name"
    },{
      headerValue: "Pos.",
      columnClass: "data-column",
      isNumericType: true,
      key: "pos"
    },{
      headerValue: "Height",
      columnClass: "data-column",
      isNumericType: true,
      key: "ht"
    },{
      headerValue: "Weight",
      columnClass: "data-column",
      isNumericType: true,
      key: "wt"
    },{
      headerValue: "Age",
      columnClass: "data-column",
      isNumericType: true,
      key: "age"
    },{
      headerValue: "Salary",
      columnClass: "data-column",
      isNumericType: true,
      sortDirection: -1, //descending
      key: "sal"
    }
  ];

  rows: Array<TeamRosterData>;

  selectedKey:any = -1;

  constructor(title:string, rows: Array<TeamRosterData>, private _globalFunctions:GlobalFunctions, private _mlbGF: MLBGlobalFunctions) {
    this.title = title;
    this.rows = rows;
    console.log('Selected',rows, title);
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
    else if ( rows.length > 0 ) {
      this.selectedKey = Number(rows[0].playerId);
    }
  }

  setRowSelected(rowIndex:number) {
    if ( rowIndex >= 0 && rowIndex < this.rows.length ) {
      this.selectedKey = this.rows[rowIndex].playerId;
    }
    else {
      this.selectedKey = null;
    }
  }

  isRowSelected(item:TeamRosterData, rowIndex:number): boolean {
    return this.selectedKey == item.playerId;
  }

  getDisplayValueAt(item:TeamRosterData, column:TableColumn):string {
    let self = this;
    var s = "";
    switch (column.key) {
      case "name":
        s = item.playerName;
        break;

      case "pos":
        s = item.position.toString();
        break;

      case "ht":
        s = typeof item.height == 'undefined' ? "-" : item.age.toString();
        break;

      case "wt":
        s = typeof item.weight == 'undefined' ? "-" : item.age.toString();
        break;

      case "age":
      s = typeof item.age == 'undefined' ? "-" : item.age.toString();
        break;

      case "sal":
        s = item.salary == null ? "-" : self._globalFunctions.commaSeparateNumber(Number(item.salary));
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
            urlRouteArray: ["Team-page", { teamName: item.teamName, teamId: item.teamId }],
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
    if ( column.key === "name" ) {
      return this._mlbGF.formatPlayerRoute(item.teamName,item.playerName,item.playerId);
    }
    else {
      return undefined;
    }
  }

  hasRouterLinkAt(column:TableColumn):boolean {
    return column.key === "name";
  }
}
