import {TableModel, TableColumn} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';
import {StatsTableTabData} from '../components/player-stats/player-stats.component';
import {SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
// import {GlobalSettings} from '../global/global-settings';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';

export interface PlayerStatsData {
  teamName: string,
  teamId: number;
  teamImageUrl: string,
  playerName: string;
  playerId: number;
  playerImageUrl: string;
  seasionId: string;
  lastUpdatedDate: Date,
  
  //Batting Stats
  battingAverage: number;
  homeRuns: number;
  runsBattedIn: number;
  sluggingPercent: number;
  hits: number;
  walks: number;
  
  //Pitching Stats
  onBasePercent: number;
  earnedRunAverage: number;
  wins: number;
  losses: number;
  strikeouts: number;
  inningsPitched: number;
  walksPitched: number;
  whip: number;
  saves: number;
  
  /**
   * - Formatted from the lastUpdatedDate
   */
  displayDate?: string;
  
  fullPlayerImageUrl?: string;
  
  fullTeamImageUrl?: string;
}

export class PlayerStatsSeasonData {
  seasonId: string;
  rows: Array<PlayerStatsData>
}

export class MLBPlayerStatsTableData implements StatsTableTabData<PlayerStatsData> {  
  tabTitle: string;
  
  tableData: {
    [seasonId: string]: TableModel<PlayerStatsData>
  };
  
  seasonIds: Array<{key: string, value: string}>;
  
  glossary: Array<{key: string, value: string}>;
  
  isActive: boolean;
  
  isPitcherTable: boolean;
  
  selectedSeasonId: string;
  
  constructor(tabName: string, isPitcherTable: boolean, isActive: boolean) {
    this.tabTitle = tabName;
    this.isActive = isActive;
    this.isPitcherTable = isPitcherTable;
    if ( this.isPitcherTable ) {
      this.glossary = [
        {key: "W/L", value: "Wins/Losses"},
        {key: "IP", value: "Innings Pitched"},
        {key: "SO", value: "Strikeouts"},
        {key: "ERA", value: "Earned Run Average"},
        {key: "BB", value: "Walks Pitched (Bases on Balls)"},
        {key: "WHIP", value: "Walks + Hits per Inning Pitched"},
        {key: "SV", value: "Saves"}
      ];
    }
    else {
      this.glossary = [
        {key: "HR", value: "Homeruns"},
        {key: "BA", value: "Batting Average"},
        {key: "RBI", value: "Runs Batted In"},
        {key: "H", value: "Hits"},
        {key: "BB", value: "Walks (Bases on Balls)"},
        {key: "OBP", value: "On-Base Percentage"},
        {key: "SLG", value: "Slugging Percentage"}
      ];
    }
  }  

  convertToCarouselItem(item: PlayerStatsData, index:number): SliderCarouselInput {
    var subheader = "Current " + item.teamName + " Player Stats";
    var description = "";
    if ( this.isPitcherTable ) {
      description = item.playerName + " has a <span class='text-heavy'>" + item.earnedRunAverage + 
                    " ERA</span> with <span class='text-heavy'>" + item.strikeouts + 
                    " Strikeouts</span>, <span class='text-heavy'>" + item.wins + 
                    " Wins</span> and a <span class='text-heavy'>" + item.saves + 
                    " Saves</span>.";
    }
    else {
      description = item.playerName + " has a <span class='text-heavy'>" + item.battingAverage + 
                    " Batting Average</span> with <span class='text-heavy'>" + item.homeRuns + 
                    " Homeruns</span>, <span class='text-heavy'>" + item.runsBattedIn + 
                    " RBI's</span> and a <span class='text-heavy'>" + item.sluggingPercent + 
                    " Slugging Percentage</span>.";
    }
    return {
      index: index,
      //backgroundImage: null, //optional
      description: [
        "<div class='stats-car-subhdr'>" + subheader + "</div>",
        "<div class='stats-car-hdr'>" + item.playerName + "</div>",
        "<div class='stats-car-desc'>" + description + "</div>",
        "<div class='stats-car-date'>Last Updated On " + item.displayDate + "</div>"
      ],
      imageConfig: {
        imageClass: "image-150",
        mainImage: {
          imageClass: "border-10",
          urlRouteArray: MLBGlobalFunctions.formatPlayerRoute(item.teamName, item.playerName, item.playerId.toString()),
          imageUrl: item.fullPlayerImageUrl,
          hoverText: "<p>View</p><p>Profile</p>"
        },
        subImages: [{
          imageClass: "image-50-sub image-round-lower-right",
          urlRouteArray: MLBGlobalFunctions.formatTeamRoute(item.teamName, item.teamId.toString()),
          imageUrl: item.fullTeamImageUrl,
          hoverText: "<i class='fa fa-mail-forward'></i>"
        }]
      }
    };
  }
}

export class MLBPlayerStatsTableModel implements TableModel<PlayerStatsData> {
  tableName: string;
  
  columns: Array<TableColumn>;
  
  rows: Array<PlayerStatsData>;
  
  selectedKey:number = -1;
  
  isPitcher: boolean;
  
  constructor(title:string, rows: Array<PlayerStatsData>, isPitcher: boolean) {
    this.tableName = title;
    this.rows = rows;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
    else if ( rows.length > 0 ) {
      this.selectedKey = rows[0].playerId;
    }
    this.isPitcher = isPitcher;
    if ( this.isPitcher ) {
      this.columns = [{
        headerValue: "Player Name",
        columnClass: "image-column",
        key: "name"
      },{
        headerValue: "W/L",
        columnClass: "data-column",
        isNumericType: true,
        key: "wl"
      },{
        headerValue: "IP",
        columnClass: "data-column",
        isNumericType: true,
        key: "ip"
      },{
        headerValue: "SO",
        columnClass: "data-column",
        isNumericType: true,
        key: "so"   
      },{
        headerValue: "ERA",
        columnClass: "data-column",
        sortDirection: -  1, //descending
        isNumericType: true,
        key: "era"
      },{
        headerValue: "BB",
        columnClass: "data-column",
        isNumericType: true,
        key: "bb"
      },{
        headerValue: "WHIP",
        columnClass: "data-column",
        isNumericType: true,
        key: "whip"
      },{
        headerValue: "SV",
        columnClass: "data-column",
        isNumericType: true,
        key: "sv"
      }]      
    } 
    else {
      this.columns = [{
        headerValue: "Player Name",
        columnClass: "image-column",
        key: "name"
      },{
        headerValue: "HR",
        columnClass: "data-column",
        isNumericType: true,
        key: "hr"
      },{
        headerValue: "BA",
        columnClass: "data-column",
        sortDirection: -  1, //descending
        isNumericType: true,
        key: "ba"
      },{
        headerValue: "RBI",
        columnClass: "data-column",
        isNumericType: true,
        key: "rbi"   
      },{
        headerValue: "H",
        columnClass: "data-column",
        isNumericType: true,
        key: "h"
      },{
        headerValue: "BB",
        columnClass: "data-column",
        isNumericType: true,
        key: "bb"
      },{
        headerValue: "OBA",
        columnClass: "data-column",
        isNumericType: true,
        key: "obp"
      },{
        headerValue: "SLG",
        columnClass: "data-column",
        isNumericType: true,
        key: "slg"
      }]
    };
  }
  
  setRowSelected(rowIndex:number) {
    if ( rowIndex >= 0 && rowIndex < this.rows.length ) {
      this.selectedKey = this.rows[rowIndex].playerId;
    }
    else {
      this.selectedKey = null;
    }
  }
  
  isRowSelected(item:PlayerStatsData, rowIndex:number): boolean {
    return this.selectedKey == item.playerId;
  }
  
  getDisplayValueAt(item:PlayerStatsData, column:TableColumn):string {
    var s = "";
    switch (column.key) {
      case "name": 
        s = item.playerName
        break;
      
      //BATTING
      case "hr": 
        s = item.homeRuns ? item.homeRuns.toString() : null;
        break;
      
      case "ba": 
        s = item.battingAverage ? item.battingAverage.toString() : null;
        break;
      
      case "rbi": 
        s = item.runsBattedIn ? item.runsBattedIn.toString() : null;
        break;
      
      case "h": 
        s = item.hits ? item.hits.toString() : null;
        break;
      
      case "bb": 
        s = this.isPitcher ?
          (item.walksPitched ? item.walksPitched.toString() : null) : 
          (item.walks ? item.walks.toString() : null);
        break;
      
      case "obp": 
        s = item.onBasePercent ? item.onBasePercent.toString() : null;
        break;
      
      case "slg": 
        s = item.sluggingPercent ? item.sluggingPercent.toString() : null;
        break;
      
      //PITCHING
      case "wl": 
        s = item.wins && item.losses ? item.wins + "/" + item.losses : null;
        break;
      
      case "ip": 
        s = item.inningsPitched ? item.inningsPitched.toString() : null;
        break;
      
      case "so": 
        s = item.strikeouts ? item.strikeouts.toString() : null;
        break;
      
      case "era": 
        s = item.earnedRunAverage ? item.earnedRunAverage.toString() : null;
        break;
        
      //case "bb" : see above
      
      case "whip": 
        s = item.whip ? item.whip.toString() : null;
        break;
      
      case "sv": 
        s = item.saves ? item.saves.toString() : null;
        break;
    }    
    return s;
  }
  
  getSortValueAt(item:PlayerStatsData, column:TableColumn):any {
    var o: any;
    switch (column.key) {
      case "name": 
        o = item.playerName
        break;
      
      case "hr": 
        o = Number(item.homeRuns);
        break;
      
      case "ba": 
        o = Number(item.battingAverage);
        break;
      
      case "rbi": 
        o = Number(item.runsBattedIn);
        break;
      
      case "h": 
        o = Number(item.hits);
        break;
      
      case "bb": 
        o = Number(item.walks);
        break;
      
      case "obp": 
        o = Number(item.onBasePercent);
        break;
      
      case "slg": 
        o = Number(item.sluggingPercent);
        break;     
      
      //PITCHING
      case "wl": 
        var wins = item.wins + "";
        var losses = item.losses + "";
        o = ('00000' + wins).substr(wins.length) + "/" + ('00000' + losses).substr(losses.length); //pad with zeros
        break;
      
      case "ip": 
        o = Number(item.inningsPitched);
        break;
      
      case "so": 
        o = Number(item.strikeouts);
        break;
      
      case "era": 
        o = Number(item.earnedRunAverage);
        break;
        
      //case "bb" : see above
      
      case "whip": 
        o = Number(item.whip);
        break;
      
      case "sv": 
        o = Number(item.saves);
        break;
    }    
    return o;
  }
  
  getImageConfigAt(item:PlayerStatsData, column:TableColumn):CircleImageData {
    if ( column.key === "name" ) {
      //TODO-CJP: store after creation? or create each time?
      return {
          imageClass: "image-50",
          mainImage: {
            imageUrl: item.fullPlayerImageUrl,
            imageClass: "border-2",
            urlRouteArray: MLBGlobalFunctions.formatPlayerRoute(item.teamName, item.playerName, item.playerId.toString()),
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
  
  getRouterLinkAt(item:PlayerStatsData, column:TableColumn):Array<any> {
    if ( column.key === "name" ) {
      return MLBGlobalFunctions.formatPlayerRoute(item.teamName, item.playerName, item.playerId.toString());
    }
    else {
      return undefined;
    }
  }
  
  hasRouterLinkAt(column:TableColumn):boolean {
    return column.key === "name";
  }
}