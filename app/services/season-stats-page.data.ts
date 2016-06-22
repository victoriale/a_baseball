import {TableModel, TableColumn} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';
import {TableTabData, TableComponentData} from '../components/season-stats/season-stats.component';
import {SliderCarousel, SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
import {Season} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';

export interface TeamInfo {
  teamName: string;
  teamId: string;
}
export interface PlayerInfo {
  playerName: string,
  playerId: string;
  lastUpdate: string;
  teamName: string;
  teamId: string;
  liveImage: string;
  playerHeadshot: string;
  teamLogo: string;
  position: string;
}

export interface TeamSeasonStatsData {
  teamInfo: TeamInfo;
  playerInfo: PlayerInfo;
  imageUrl: string,
  backgroundImage: string,
  conferenceName: string,
  divisionName: string,
  lastUpdated: string,
  rank: number,
  year: string,

  pitchWins: string,
  pitchLosses: string,
  pitchInningsPitched: string,
  pitchStrikeouts: string,
  pitchEra: string,
  pitchHits: string,
  pitchEarnedRuns: string,
  pitchBasesOnBalls: string,
  pitchWhip: string,

  batRunsScored: string,
  batHomeRuns: string,
  batHits: string,
  batRbi: string,
  batBasesOnBalls: string,
  batAverage: string,
  batOnBasePercentage: string,
  batSluggingPercentage: string,

  seasonId: string,
  /**
   * - Formatted from league and year values that generated the associated table
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

export interface seasonStatsData {
  regularSeasonAverage: Array<TeamSeasonStatsData>;
  postSeasonAverage: Array<TeamSeasonStatsData>;
  regularSeasonTotal: Array<TeamSeasonStatsData>;
  postSeasonTotal: Array<TeamSeasonStatsData>;
}

export class MLBSeasonStatsTableData implements TableComponentData<TeamSeasonStatsData> {
  groupName: string;

  tableData: MLBSeasonStatsTableModel;

  season: any;

  year: number;

  constructor(title: string, season: Season, year: number, table: MLBSeasonStatsTableModel) {
    this.groupName = title;
    this.season = season;
    this.year = year;
    this.tableData = table;
  }

}

export class MLBSeasonStatsTabData implements TableTabData<TeamSeasonStatsData> {

  playerId: string;

  tabName: string;

  title: string;

  isActive: boolean;

  isLoaded: boolean;

  hasError: boolean;

  sections: Array<MLBSeasonStatsTableData>;

  season: Season;

  year: string;

  constructor(title: string, tabName: string, season: Season, year: string, isActive: boolean) {
    this.title = title;
    this.tabName = tabName;
    this.season = season;
    this.year = year;
    this.isActive = isActive;
  }

  convertToCarouselItem(item: TeamSeasonStatsData, index:number): SliderCarouselInput {
    var playerData = item.playerInfo != null ? item.playerInfo : null;
    var dummyImg = "/app/public/no-image.png";

    var playerRoute = MLBGlobalFunctions.formatPlayerRoute(playerData.teamName,playerData.playerName,playerData.playerId.toString());
    var playerRouteText = {
      route: playerRoute,
      text: playerData.playerName
    }
    var teamRoute = MLBGlobalFunctions.formatTeamRoute(playerData.teamName, playerData.teamId);
    var teamRouteText = {
      route: teamRoute,
      text: playerData.teamName
    }

    return SliderCarousel.convertToSliderCarouselDescription(index, {
      backgroundImage: playerData.liveImage != null ? GlobalSettings.getImageUrl(playerData.liveImage) : dummyImg,
      subheader: [item.seasonId + " Season Stats Report"],
      profileNameLink: playerRouteText,
      description: ["Team: ", teamRouteText],
      lastUpdatedDate: GlobalFunctions.formatUpdatedDate(playerData.lastUpdate),
      circleImageUrl: GlobalSettings.getImageUrl(playerData.playerHeadshot),
      circleImageRoute: playerRoute,
      subImageUrl: GlobalSettings.getImageUrl(playerData.teamLogo),
      subImageRoute: teamRoute
    });
  }
}

export class MLBSeasonStatsTableModel implements TableModel<TeamSeasonStatsData> {
  columns: Array<TableColumn>;
  rows: Array<TeamSeasonStatsData>;
  selectedKey: string = "";
  isPitcher: boolean;
  constructor(rows: Array<TeamSeasonStatsData>, isPitcher: boolean){
    this.rows = rows;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
    else if ( rows.length > 0 ) {
      // this.selectedKey = rows[0].playerId;
    }
    isPitcher = this.rows[0]['playerInfo'].position[0].charAt(0) == "P" ? true : false;
    this.isPitcher = isPitcher;
    if(this.isPitcher){
      this.columns = [{
          headerValue: "Year",
          columnClass: "date-column",
          isNumericType: true,
          sortDirection: 1, //descending
          key: "year"
        },{
          headerValue: "Team",
          columnClass: "image-column",
          isNumericType: false,
          key: "team"
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
          isNumericType: true,
          key: "era"
        },{
          headerValue: "H",
          columnClass: "data-column",
          isNumericType: true,
          key: "ph"
        },{
          headerValue: "ER",
          columnClass: "data-column",
          isNumericType: true,
          key: "er"
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
        }]
    } else {
      this.columns = [{
        headerValue: "Year",
        columnClass: "date-column",
        isNumericType: true,
        key: "year"
      },{
        headerValue: "Team",
        columnClass: "image-column",
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
      }]
    };
  }
  setRowSelected(rowIndex:number) {
    if ( rowIndex >= 0 && rowIndex < this.rows.length ) {
      this.selectedKey = this.rows[rowIndex].playerInfo.playerId;
    }
    else {
      this.selectedKey = null;
    }
  }

  isRowSelected(item:TeamSeasonStatsData, rowIndex:number): boolean {
    return null;
  }

  getDisplayValueAt(item:TeamSeasonStatsData, column:TableColumn):string {
    var s = "";
    switch (column.key) {
      case "year":
        s = item.seasonId;
        break;

      case "team":
        let avgTotal = item['sectionStat'] != null && item['sectionStat'] == "Average" ? "Total Average" : "Total";
        s = item['sectionStat'] == null ? item.teamInfo.teamName : avgTotal.toUpperCase() + ":";
        break;

      case "wl":
        s = Number(item.pitchWins) != null && Number(item.pitchLosses) != null ? Number(item.pitchWins).toFixed(0) + "/" + Number(item.pitchLosses).toFixed(0) : null;
        break;

      case "ip":
        s = Number(item.pitchInningsPitched) != null ? Number(item.pitchInningsPitched).toFixed(1) : null;
        break;

      case "so":
        s = Number(item.pitchStrikeouts) != null ? Number(item.pitchStrikeouts).toFixed(0) : null;
        break;

      case "era":
        s = Number(item.pitchEra) != null ? Number(item.pitchEra).toFixed(2) : null;
        break;

      case "ph":
        s = Number(item.pitchHits) != null ? Number(item.pitchHits).toFixed(0) : null;
        break;

      case "er":
        s = Number(item.pitchEarnedRuns) != null ? Number(item.pitchEarnedRuns).toFixed(0) : null;
        break;

      case "pbb":
        s = Number(item.pitchBasesOnBalls) != null ? Number(item.pitchBasesOnBalls).toFixed(0) : null;
        break;

      case "whip":
        s = Number(item.pitchWhip) != null ? Number(item.pitchWhip).toFixed(2) : null;
        break;

      case "r":
      s = Number(item.batHomeRuns) != null ? Number(item.batHomeRuns).toFixed(2) : null;
      break;

      case "h":
        s = Number(item.batHits) != null ? Number(item.batHits).toFixed(2) : null;
        break;

      case "hr":
        s = Number(item.batHomeRuns) != null ? Number(item.batHomeRuns).toFixed(2) : null;
        break;

      case "rbi":
        s = Number(item.batRbi) != null ? Number(item.batRbi).toFixed(2) : null;
        break;

      case "bb":
        s = Number(item.batBasesOnBalls) != null ? Number(item.batBasesOnBalls).toFixed(0) : null;
        break;

      case "avg":
        s = Number(item.batAverage) != null ? Number(item.batAverage).toFixed(2) : null;
        break;

      case "obp":
        s = Number(item.batOnBasePercentage) != null ? Number(item.batOnBasePercentage).toFixed(2) : null;
        break;

      case "slg":
        s = Number(item.batSluggingPercentage) != null ? Number(item.batSluggingPercentage).toFixed(2) : null;
        break;
    }
    return s != null ? s : "N/A";
  }

  getSortValueAt(item:TeamSeasonStatsData, column:TableColumn):any {
    var o = null;
    switch (column.key) {
      case "year":
        o = item.seasonId;
        break;

      case "team":
        o = item.teamInfo.teamName;
        break;

      case "wl":
        var wins = item.pitchWins + "";
        var losses = item.pitchLosses + "";
        o = ('00000' + wins).substr(wins.length) + "/" + ('00000' + losses).substr(losses.length); //pad with zeros
        break;

      case "ip":
        o = item.pitchInningsPitched;
        break;

      case "so":
        o = item.pitchStrikeouts;
        break;

      case "era":
        o = item.pitchEra;
        break;

      case "ph":
        o = item.pitchHits;
        break;

      case "er":
        o = item.pitchEarnedRuns;
        break;

      case "pbb":
        o = item.pitchBasesOnBalls;
        break;

      case "whip":
        o = item.pitchWhip;
        break;

      case "r":
        o = item.batHomeRuns;
      break;

      case "h":
        o = item.batHits;
        break;

      case "hr":
        o = item.batHomeRuns;
        break;

      case "rbi":
        o = item.batRbi;
        break;

      case "bb":
        o = item.batBasesOnBalls;
        break;

      case "avg":
        o = item.batAverage;
        break;

      case "obp":
        o = item.batOnBasePercentage;

        break;

      case "slg":
        o = item.batSluggingPercentage;

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
    if ( column.key === "team") {
      return MLBGlobalFunctions.formatTeamRoute(item.teamInfo.teamName,item.teamInfo.teamId);
    }
    else {
      return undefined;
    }
  }

  hasRouterLinkAt(column:TableColumn):boolean {
    return column.key === "team";
  }
}
