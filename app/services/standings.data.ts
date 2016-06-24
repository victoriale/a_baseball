import {TableModel, TableColumn, CellData} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';
import {StandingsTableTabData, TableComponentData} from '../components/standings/standings.component';
import {SliderCarousel, SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
import {Conference, Division} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';

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

export class MLBStandingsTabData implements StandingsTableTabData<TeamStandingsData> {

  title: string;

  isActive: boolean;

  isLoaded: boolean;

  hasError: boolean;

  sections: Array<MLBStandingsTableData>;

  conference: Conference;

  division: Division;

  selectedKey: string;

  constructor(title: string, conference: Conference, division: Division, isActive: boolean) {
    this.title = title;
    this.conference = conference;
    this.division = division;
    this.isActive = isActive;
  }

  getSelectedKey(): string {
    if ( !this.sections ) return "-1";

    var numericKey = -1;
    this.sections.forEach(section => {
      var table = section.tableData;
      if ( table.selectedKey != null && table.selectedKey >= 0 ) {
        numericKey = table.selectedKey;
      }
    });
    return numericKey.toString();
  }

  setSelectedKey(key:string) {
    this.selectedKey = key;
    if ( !this.sections ) return;

    var numericKey = Number(key);
    this.sections.forEach(section => {
      var table = section.tableData;
      if ( table.rows.filter(row => row.teamId == numericKey).length > 0 ) {
        table.selectedKey = numericKey;
      }
      else {
        table.selectedKey = -1;
      }
    });
  }

  convertToCarouselItem(item: TeamStandingsData, index:number): SliderCarouselInput {
    var teamRoute = MLBGlobalFunctions.formatTeamRoute(item.teamName, item.teamId.toString());
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

  selectedKey:number = -1;

  constructor(rows: Array<TeamStandingsData>) {
    this.rows = rows;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
  }

  setSelectedKey(key: string) {
    this.selectedKey = Number(key);
  }

  getSelectedKey(): string {
    return this.selectedKey.toString();
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
        link = MLBGlobalFunctions.formatTeamRoute(item.teamName,item.teamId.toString());
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

  // getDisplayValueAt(item:TeamStandingsData, column:TableColumn):string {
  //   var s = null;
  //   switch (column.key) {
  //     case "name":
  //       s = item.teamName;
  //       break;

  //     case "w":
  //       s = item.totalWins != null ? item.totalWins.toString() : null;
  //       break;

  //     case "l":
  //       s = item.totalLosses != null ? item.totalLosses.toString() : null;
  //       break;

  //     case "pct":
  //       s = item.winPercentage != null ? item.winPercentage.toPrecision(3) : null;
  //       break;

  //     case "gb":
  //       // s = item.gamesBack != null ? (item.gamesBack == 0 ? "-" : item.gamesBack.toString()) : null;
  //       s = item.gamesBack != null ? item.gamesBack.toString() : null;
  //       break;

  //     case "rs":
  //       s = item.batRunsScored != null ? item.batRunsScored.toString() : null;
  //       break;

  //     case "ra":
  //       s = item.pitchRunsAllowed != null ? item.pitchRunsAllowed.toString() : null;
  //       break;

  //     case "strk":
  //       if ( item.streakCount != null && item.streakType ) {
  //         var str = item.streakCount.toString();
  //         s = (item.streakType == "loss" ? "L-" : "W-") + item.streakCount.toString();
  //       }
  //       break;
  //   }
  //   return s != null ? s : "N/A";
  // }

  // getSortValueAt(item:TeamStandingsData, column:TableColumn):any {
  //   var sort = null;
  //   switch (column.key) {
  //     case "name":
  //       sort = item.teamName;
  //       break;

  //     case "w":
  //       sort = item.totalWins;
  //       break;

  //     case "l":
  //       sort = item.totalLosses;
  //       break;

  //     case "pct":
  //       sort = item.winPercentage;
  //       break;

  //     case "gb":
  //       sort = item.gamesBack;
  //       break;

  //     case "rs":
  //       sort = item.batRunsScored;
  //       break;

  //     case "ra":
  //       sort = item.pitchRunsAllowed;
  //       break;

  //     case "strk":
  //       if ( item.streakCount != null && item.streakType ) {
  //         // var str = item.streakCount.toString();
  //         // o = (item.streakType == "loss" ? "L-" : "W-") + ('0000' + str).substr(str.length); //pad with zeros
  //         sort = (item.streakType == "loss" ? -1 : 1) * item.streakCount;
  //       }
  //       break;
  //   }
  //   return sort;
  // }

  // getImageConfigAt(item:TeamStandingsData, column:TableColumn):CircleImageData {
  //   if ( column.key === "name" ) {
  //     //TODO-CJP: store after creation? or create each time?
  //     return {
  //         imageClass: "image-48",
  //         mainImage: {
  //           imageUrl: item.fullImageUrl,
  //           imageClass: "border-1",
  //           urlRouteArray: MLBGlobalFunctions.formatTeamRoute(item.teamName,item.teamId.toString()),
  //           hoverText: "<i class='fa fa-mail-forward'></i>",
  //         },
  //         subImages: []
  //       };
  //   }
  //   else {
  //     return undefined;
  //   }
  // }

  // hasImageConfigAt(column:TableColumn):boolean {
  //   return column.key === "name";
  // }

  // getRouterLinkAt(item:TeamStandingsData, column:TableColumn):Array<any> {
  //   if ( column.key === "name" ) {
  //     return MLBGlobalFunctions.formatTeamRoute(item.teamName,item.teamId.toString());
  //   }
  //   else {
  //     return undefined;
  //   }
  // }

  // hasRouterLinkAt(column:TableColumn):boolean {
  //   return column.key === "name";
  // }
}
