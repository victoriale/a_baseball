import {TableModel, TableColumn, CellData} from '../components/custom-table/table-data.component';
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

    var playerRoute = MLBGlobalFunctions.formatPlayerRoute(playerData.teamName,playerData.playerName,playerData.playerId.toString());
    var playerRouteText = {
      route: playerRoute,
      text: playerData.playerName
    }
    var teamRoute = MLBGlobalFunctions.formatTeamRoute(playerData.teamName, playerData.teamId);
    var teamRouteText = {
      route: teamRoute,
      text: playerData.teamName,
      class: 'text-heavy'
    }

    return SliderCarousel.convertToCarouselItemType1(index, {
      backgroundImage: GlobalSettings.getBackgroundImageUrl(playerData.liveImage, GlobalSettings._imgProfileMod),
      copyrightInfo: GlobalSettings.getCopyrightInfo(),
      subheader: [item.seasonId + " Season Stats Report"],
      profileNameLink: playerRouteText,
      description: ["Team: ", teamRouteText],
      lastUpdatedDate: GlobalFunctions.formatUpdatedDate(playerData.lastUpdate),
      circleImageUrl: GlobalSettings.getImageUrl(playerData.playerHeadshot, GlobalSettings._imgLgLogo),
      circleImageRoute: playerRoute
      // subImageUrl: GlobalSettings.getImageUrl(playerData.teamLogo),
      // subImageRoute: teamRoute
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

  setSelectedKey(key: string) {
    this.selectedKey = key;
  }

  getSelectedKey(): string {
    return this.selectedKey;
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

  getCellData(item:TeamSeasonStatsData, column:TableColumn):CellData {
    var display = "";
    var sort = null;
    var link = undefined;
    var isTotalColumn = item['sectionStat'] != null;

    switch (column.key) {
      case "year":
        display = item.seasonId;
        sort = item.seasonId;
        break;

      case "team":
        if ( isTotalColumn ) {
          display = (item['sectionStat'] == "Average" ? "Total Average" : "Total").toUpperCase() + ":";
        }
        else {
          display = item.teamInfo.teamName;
          link = MLBGlobalFunctions.formatTeamRoute(item.teamInfo.teamName,item.teamInfo.teamId);
        }
        sort = item.teamInfo.teamName;
        break;

      case "wl":
        display = item.pitchWins != null && Number(item.pitchLosses) != null ? Number(item.pitchWins).toFixed(0) + "/" + Number(item.pitchLosses).toFixed(0) : null;
        var wins = item.pitchWins + "";
        var losses = item.pitchLosses + "";
        sort = ('00000' + wins).substr(wins.length) + "/" + ('00000' + losses).substr(losses.length); //pad with zeros
        break;

      case "ip":
        display = item.pitchInningsPitched != null ? Number(item.pitchInningsPitched).toFixed(1) : null;
        sort = Number(item.pitchInningsPitched);
        break;

      case "so":
        display = item.pitchStrikeouts != null ? Number(item.pitchStrikeouts).toFixed(0) : null;
        sort = Number(item.pitchStrikeouts);
        break;

      case "era":
        display = item.pitchEra != null ? Number(item.pitchEra).toFixed(2) : null;
        sort = Number(item.pitchEra);
        break;

      case "ph":
        display = item.pitchHits != null ? Number(item.pitchHits).toFixed(0) : null;
        sort = Number(item.pitchHits);
        break;

      case "er":
        display = item.pitchEarnedRuns != null ? Number(item.pitchEarnedRuns).toFixed(0) : null;
        sort = Number(item.pitchEarnedRuns);
        break;

      case "pbb":
        display = item.pitchBasesOnBalls != null ? Number(item.pitchBasesOnBalls).toFixed(0) : null;
        sort = Number(item.pitchBasesOnBalls);
        break;

      case "whip":
        display = item.pitchWhip != null ? Number(item.pitchWhip).toFixed(2) : null;
        sort = Number(item.pitchWhip);
        break;

      case "r":
        display = item.batHomeRuns != null ? Number(item.batHomeRuns).toFixed(2) : null;
        sort = Number(item.batHomeRuns);
      break;

      case "h":
        display = item.batHits != null ? Number(item.batHits).toFixed(2) : null;
        sort = Number(item.batHits);
        break;

      case "hr":
        display = item.batHomeRuns != null ? Number(item.batHomeRuns).toFixed(2) : null;
        sort = Number(item.batHomeRuns);
        break;

      case "rbi":
        display = item.batRbi != null ? Number(item.batRbi).toFixed(2) : null;
        sort = Number(item.batRbi);
        break;

      case "bb":
        display = item.batBasesOnBalls != null ? Number(item.batBasesOnBalls).toFixed(0) : null;
        sort = Number(item.batBasesOnBalls);
        break;

      case "avg":
        display = item.batAverage != null ? Number(item.batAverage).toFixed(2) : null;
        sort = Number(item.batAverage);
        break;

      case "obp":
        display = item.batOnBasePercentage != null ? Number(item.batOnBasePercentage).toFixed(2) : null;
        sort = Number(item.batOnBasePercentage);
        break;

      case "slg":
        display = item.batSluggingPercentage != null ? Number(item.batSluggingPercentage).toFixed(2) : null;
        sort = Number(item.batSluggingPercentage);
        break;
    }
    display = display != null ? display : "N/A";
    if ( isTotalColumn ) {
      sort = null; // don't sort total column
    }
    return new CellData(display, sort, link);
  }
}
