import {TableModel, TableColumn} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';
import {StatsTableTabData} from '../components/player-stats/player-stats.component';
import {SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
// import {GlobalSettings} from '../global/global-settings';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';

export interface PlayerStatsData {
  teamName: string,
  teamId: string;
  teamLogo: string,
  playerName: string;
  playerId: string;
  playerHeadshot: string;
  backgroundImage: string;
  seasonId: string;
  lastUpdate: string;
  
  //Batting Stats
  batAverage: number;
  batHomeRuns: string;
  batRbi: string;
  batSluggingPercentage: number;
  batHits: string;
  batBasesOnBalls: string;
  batOnBasePercentage: number;
  
  //Pitching Stats
  pitchEra: number;
  pitchWins: string;
  pitchLosses: string;
  pitchStrikeouts: string;
  pitchInningsPitched: string;
  pitchBasesOnBalls: string;
  whip: number;
  pitchSaves: string;
  
  /**
   * - Formatted from the lastUpdatedDate
   */
  displayDate?: string;
  
  fullPlayerImageUrl?: string;
  
  fullTeamImageUrl?: string;
  
  fullBackgroundImageUrl?: string;
}

export class MLBPlayerStatsTableData implements StatsTableTabData<PlayerStatsData> {  
  tabTitle: string;
  
  tableName: string;
  
  isLoaded: boolean;
  
  hasError: boolean; 
  
  tableData: TableModel<PlayerStatsData>;
  
  seasonTableData: { [key: string]: TableModel<PlayerStatsData> } = {};
  
  seasonIds: Array<{key: string, value: string}> = []
  
  glossary: Array<{key: string, value: string}>;
  
  isActive: boolean;
  
  isPitcherTable: boolean;
  
  selectedSeasonId: string;
  
  constructor(teamName: string, tabName: string, isPitcherTable: boolean, isActive: boolean) {
    this.tabTitle = tabName;    
    this.tableName = "<span class='text-heavy'>" + teamName + "</span> " + tabName + " Stats";  
    this.isActive = isActive;
    this.isPitcherTable = isPitcherTable;
    if ( this.isPitcherTable ) {
      this.glossary = [
        {key: "W/L", value: "Wins/Losses"},
        {key: "ERA", value: "Earned Run Average"},
        {key: "WHIP", value: "Walks + Hits per Inning Pitched"},
        {key: "IP", value: "Innings Pitched"},
        {key: "BB", value: "Walks Pitched (Bases on Balls)"},
        {key: "SV", value: "Saves"},
        {key: "SO", value: "Strikeouts"}
      ];
    }
    else {
      this.glossary = [
        {key: "HR", value: "Homeruns"},
        {key: "H", value: "Hits"},
        {key: "OBP", value: "On-Base Percentage"},
        {key: "BA", value: "Batting Average"},
        {key: "BB", value: "Walks (Bases on Balls)"},
        {key: "SLG", value: "Slugging Percentage"},
        {key: "RBI", value: "Runs Batted In"}
      ];
    }
    var currYear = new Date().getFullYear();
    var year = currYear;
    this.selectedSeasonId = currYear.toString();
    for ( var i = 0; i < 5; i++ ) {
      this.seasonIds.push({
        key: year.toString(), 
        value: i == 0 ? "Current Season" : year.toString() + " Season"
      });
      year--; 
    }
  }  

  convertToCarouselItem(item: PlayerStatsData, index:number): SliderCarouselInput {
    var subheader = "Current " + item.teamName + " Player Stats";
    var description = "";
    var tense = " has";
    var temporalInfo = "";
    if ( this.selectedSeasonId != this.seasonIds[0].key ) {
      tense = " had";
      temporalInfo = " in " + this.selectedSeasonId;
    }
    if ( this.isPitcherTable ) {
      description = item.playerName + tense + " a <span class='text-heavy'>" + (item.pitchEra != null ? item.pitchEra.toFixed(2) : "N/A") + 
                    " ERA</span> with <span class='text-heavy'>" + item.pitchStrikeouts + 
                    " Strikeouts</span>, <span class='text-heavy'>" + item.pitchWins + 
                    " Wins</span> and a <span class='text-heavy'>" + item.pitchLosses + 
                    " Saves</span>" + temporalInfo + ".";
    }
    else {
      description = item.playerName + tense + " a <span class='text-heavy'>" + (item.batAverage != null ? item.batAverage.toPrecision(3) : "N/A") + 
                    " Batting Average</span> with <span class='text-heavy'>" + item.batHomeRuns + 
                    " Homeruns</span>, <span class='text-heavy'>" + item.batRbi + 
                    " RBI's</span> and a <span class='text-heavy'>" + (item.batSluggingPercentage != null ? item.batSluggingPercentage.toPrecision(3) : "N/A") + 
                    " Slugging Percentage</span>" + temporalInfo + ".";
    }
    return {
      index: index,
      backgroundImage: item.fullBackgroundImageUrl, //optional
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
  columns: Array<TableColumn>;
  
  rows: Array<PlayerStatsData>;
  
  selectedKey:string = "";
  
  isPitcher: boolean;
  
  constructor(rows: Array<PlayerStatsData>, isPitcher: boolean) {
    this.rows = rows;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
    else if ( rows.length > 0 ) {
      // this.selectedKey = rows[0].playerId;
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
        sortDirection: 1, //ascending
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
        sortDirection: -1, //descending
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
        headerValue: "OBP",
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
        s = item.batHomeRuns != null ? item.batHomeRuns : null;
        break;
      
      case "ba": 
        s = item.batAverage != null  ? item.batAverage.toFixed(3) : null;
        break;
      
      case "rbi": 
        s = item.batRbi != null  ? item.batRbi : null;
        break;
      
      case "h": 
        s = item.batHits != null  ? item.batHits : null;
        break;
      
      case "bbb": 
        s = item.batBasesOnBalls != null  ? item.batBasesOnBalls : null;
        break;
      
      case "obp": 
        s = item.batOnBasePercentage != null ? item.batOnBasePercentage.toFixed(3) : null;
        break;
      
      case "slg": 
        s = item.batSluggingPercentage != null ? item.batSluggingPercentage.toFixed(3) : null;
        break;
      
      //PITCHING
      case "wl": 
        s = item.pitchWins != null && item.pitchLosses != null ? item.pitchWins + "-" + item.pitchLosses : null;
        break;
      
      case "ip": 
        s = item.pitchInningsPitched != null ? item.pitchInningsPitched.toString() : null;
        break;
      
      case "so": 
        s = item.pitchStrikeouts != null ? item.pitchStrikeouts.toString() : null;
        break;
      
      case "era": 
        s = item.pitchEra != null ? item.pitchEra.toFixed(2) : null;
        break;
        
      case "pbb": 
        s = item.pitchBasesOnBalls != null  ? item.pitchBasesOnBalls.toString() : null;
        break;
      
      case "whip": 
        s = item.whip != null ? item.whip.toFixed(2) : null;
        break;
      
      case "sv": 
        s = item.pitchSaves != null ? item.pitchSaves.toString() : null;
        break;
    }    
    return s != null ? s : "N/A";
  }
  
  getSortValueAt(item:PlayerStatsData, column:TableColumn):any {
    var o: any;
    switch (column.key) {
      case "name": 
        o = item.playerName
        break;
      
      case "hr": 
        o = item.batHomeRuns != null ? Number(item.batHomeRuns) : null;
        break;
      
      case "ba": 
        o = item.batAverage != null ? Number(item.batAverage) : null;
        break;
      
      case "rbi": 
        o = item.batRbi != null ? Number(item.batRbi) : null;
        break;
      
      case "h": 
        o = item.batHits != null ? Number(item.batHits) : null;
        break;
      
      case "bbb": 
        o = item.batBasesOnBalls != null ? Number(item.batBasesOnBalls) : null;
        break;
      
      case "obp": 
        o = item.batOnBasePercentage != null ? Number(item.batOnBasePercentage) : null;
        break;
      
      case "slg": 
        o = item.batSluggingPercentage != null ? Number(item.batSluggingPercentage) : null;
        break;     
      
      //PITCHING
      case "wl": 
        var wins = item.pitchWins + "";
        var losses = item.pitchLosses + "";
        o = ('00000' + wins).substr(wins.length) + "/" + ('00000' + losses).substr(losses.length); //pad with zeros
        break;
      
      case "ip": 
        o = item.pitchInningsPitched != null ? Number(item.pitchInningsPitched) : null;
        break;
      
      case "so": 
        o = item.pitchStrikeouts != null ? Number(item.pitchStrikeouts) : null;
        break;
      
      case "era": 
        o = item.pitchEra != null ? Number(item.pitchEra) : null;
        break;
        
      case "pbb": 
        o = item.pitchBasesOnBalls != null ? Number(item.pitchBasesOnBalls) : null;
        break;
      
      case "whip": 
        o = item.whip != null ? Number(item.whip) : null;
        break;
      
      case "sv": 
        o = item.pitchSaves != null ? Number(item.pitchSaves) : null;
        break;
    }    
    return o;
  }
  
  getImageConfigAt(item:PlayerStatsData, column:TableColumn):CircleImageData {
    if ( column.key === "name" ) {
      return {
          imageClass: "image-48",
          mainImage: {
            imageUrl: item.fullPlayerImageUrl,
            imageClass: "border-1",
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