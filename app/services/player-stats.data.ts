import {TableModel, TableColumn} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';
import {StatsTableTabData} from '../components/player-stats/player-stats.component';
import {SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
// import {GlobalSettings} from '../global/global-settings';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';

export interface PlayerStatsData {
  teamName: string,
  teamId: number;
  teamLogo: string,
  playerName: string;
  playerId: number;
  playerHeadshot: string;
  seasonId: string;
  lastUpdatedDate: Date,
  
  //Batting Stats
  batAverage: number;
  batHomeRuns: number;
  batRbi: number;
  batSluggingPercentage: number;
  batHits: number;
  batBasesOnBalls: number;
  batOnBasePercentage: number;
  
  //Pitching Stats
  pitchEra: number;
  pitchWins: number;
  pitchLosses: number;
  pitchStrikeouts: number;
  pitchInningsPitched: number;
  pitchBasesOnBalls: number;
  pitchWhip: number;
  pitchSaves: number;
  
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
    this.selectedSeasonId = new Date().getFullYear().toString();
    this.tableData = {};
  }  

  convertToCarouselItem(item: PlayerStatsData, index:number): SliderCarouselInput {
    var subheader = "Current " + item.teamName + " Player Stats";
    var description = "";
    if ( this.isPitcherTable ) {
      description = item.playerName + " has a <span class='text-heavy'>" + item.pitchEra + 
                    " ERA</span> with <span class='text-heavy'>" + item.pitchStrikeouts + 
                    " Strikeouts</span>, <span class='text-heavy'>" + item.pitchWins + 
                    " Wins</span> and a <span class='text-heavy'>" + item.pitchLosses + 
                    " Saves</span>.";
    }
    else {
      description = item.playerName + " has a <span class='text-heavy'>" + item.batAverage + 
                    " Batting Average</span> with <span class='text-heavy'>" + item.batHomeRuns + 
                    " Homeruns</span>, <span class='text-heavy'>" + item.batRbi + 
                    " RBI's</span> and a <span class='text-heavy'>" + item.batSluggingPercentage + 
                    " Slugging Percentage</span>.";
    }
    return {
      index: index,
      //backgroundImage: null, //optional
      description: [
        "<div class='stats-car-subhdr'><i class='fa fa-circle'></i> " + subheader + "</div>",
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
        key: "pbb"
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
        key: "bbb"
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
        s = item.batHomeRuns ? item.batHomeRuns.toString() : null;
        break;
      
      case "ba": 
        s = item.batAverage ? item.batAverage.toString() : null;
        break;
      
      case "rbi": 
        s = item.batRbi ? item.batRbi.toString() : null;
        break;
      
      case "h": 
        s = item.batHits ? item.batHits.toString() : null;
        break;
      
      case "bbb": 
        s = item.batBasesOnBalls ? item.batBasesOnBalls.toString() : null;
        break;
      
      case "obp": 
        s = item.batOnBasePercentage ? item.batOnBasePercentage.toString() : null;
        break;
      
      case "slg": 
        s = item.batSluggingPercentage ? item.batSluggingPercentage.toString() : null;
        break;
      
      //PITCHING
      case "wl": 
        s = item.pitchWins != null && item.pitchLosses != null ? item.pitchWins + "/" + item.pitchLosses : null;
        break;
      
      case "ip": 
        s = item.pitchInningsPitched != null ? item.pitchInningsPitched.toString() : null;
        break;
      
      case "so": 
        s = item.pitchStrikeouts != null ? item.pitchStrikeouts.toString() : null;
        break;
      
      case "era": 
        s = item.pitchEra != null ? item.pitchEra.toString() : null;
        break;
        
      case "pbb": 
        s = item.pitchBasesOnBalls ? item.pitchBasesOnBalls.toString() : null;
        break;
      
      case "whip": 
        s = item.pitchWhip != null ? item.pitchWhip.toString() : null;
        break;
      
      case "sv": 
        s = item.pitchSaves != null ? item.pitchSaves.toString() : null;
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
        o = Number(item.batHomeRuns);
        break;
      
      case "ba": 
        o = Number(item.batAverage);
        break;
      
      case "rbi": 
        o = Number(item.batRbi);
        break;
      
      case "h": 
        o = Number(item.batHits);
        break;
      
      case "bbb": 
        o = Number(item.batBasesOnBalls);
        break;
      
      case "obp": 
        o = Number(item.batOnBasePercentage);
        break;
      
      case "slg": 
        o = Number(item.batSluggingPercentage);
        break;     
      
      //PITCHING
      case "wl": 
        var wins = item.pitchWins + "";
        var losses = item.pitchLosses + "";
        o = ('00000' + wins).substr(wins.length) + "/" + ('00000' + losses).substr(losses.length); //pad with zeros
        break;
      
      case "ip": 
        o = Number(item.pitchInningsPitched);
        break;
      
      case "so": 
        o = Number(item.pitchStrikeouts);
        break;
      
      case "era": 
        o = Number(item.pitchEra);
        break;
        
      case "pbb": 
        o = Number(item.pitchBasesOnBalls);
        break;
      
      case "whip": 
        o = Number(item.pitchWhip);
        break;
      
      case "sv": 
        o = Number(item.pitchSaves);
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