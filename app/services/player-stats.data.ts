import {TableModel, TableColumn, CellData} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';
import {StatsTableTabData} from '../components/player-stats/player-stats.component';
import {SliderCarousel, SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
import {Link} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';

export interface PlayerStatsData {
  teamName: string,
  teamId: string;
  teamLogo: string,
  playerName: string;
  playerFirstName: string;
  playerLastName: string;
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

  isTeamProfilePage: boolean;

  constructor(teamName: string, tabName: string, isPitcherTable: boolean, isActive: boolean, isTeamProfilePage: boolean, seasonBase?:string) {
    this.tabTitle = tabName;
    this.tableName = "<span class='text-heavy'>" + teamName + "</span> " + tabName + " Stats";
    this.isActive = isActive;
    this.isPitcherTable = isPitcherTable;
    this.isTeamProfilePage = isTeamProfilePage;
    if ( this.isPitcherTable ) {
      this.glossary = [
        {key: "W/L", value: "Wins/Losses"},
        {key: "BB", value: "Walks Pitched (Bases on Balls)"},
        {key: "IP", value: "Innings Pitched"},
        {key: "WHIP", value: "Walks + Hits per Inning Pitched"},
        {key: "SO", value: "Strikeouts"},
        {key: "SV", value: "Saves"},
        {key: "ERA", value: "Earned Run Average"}
      ];
    }
    else {
      this.glossary = [
        {key: "HR", value: "Homeruns"},
        {key: "BB", value: "Walks (Bases on Balls)"},
        {key: "BA", value: "Batting Average"},
        {key: "OBP", value: "On-Base Percentage"},
        {key: "RBI", value: "Runs Batted In"},
        {key: "SLG", value: "Slugging Percentage"},
        {key: "H", value: "Hits"}
      ];
    }
    var currYear = Number(seasonBase);
    var year = currYear;
    var ifCurrent;
    if(new Date().getFullYear() != year){
      ifCurrent = year.toString() + ' Season';
    } else {
      ifCurrent = 'Current Season';
    }
    for ( var i = 0; i < 5; i++ ) {
      this.seasonIds.push({
        key: year.toString(),
        value: i == 0 ? ifCurrent : year.toString() + " Season"
      });
      year--;
    }
  }

  convertToCarouselItem(item: PlayerStatsData, index:number): SliderCarouselInput {
    var description: Array<Link | string> = [];
    var tense = " has";
    var temporalInfo = "";
    var subHeaderYear = "Current ";
    if ( item.seasonId != this.seasonIds[0].key ) {
      subHeaderYear = item.seasonId + " ";
      tense = " had";
      temporalInfo = " in " + item.seasonId;
    }
    var playerRoute = MLBGlobalFunctions.formatPlayerRoute(item.teamName, item.playerName, item.playerId.toString());
    var playerLinkText = {
      route: playerRoute,
      text: item.playerName,
      class: 'text-heavy'

    }
    var teamRoute =this.isTeamProfilePage ? null : MLBGlobalFunctions.formatTeamRoute(item.teamName, item.teamId.toString());
    var teamLinkText = {
      route: teamRoute,
      text: item.teamName
    }
    if ( this.isPitcherTable ) {
      var strikeoutsText = item.pitchStrikeouts == "1" ? "Strikeout" : "Strikeouts";
      var winsText = item.pitchWins == "1" ? "Win" : "Wins";
      var savesText = item.pitchSaves == "1" ? "Save" : "Saves";
      description = [playerLinkText, tense + " a <span class='text-heavy'>" + (item.pitchEra != null ? item.pitchEra.toFixed(2) : "N/A") +
                    " ERA</span> with <span class='text-heavy'>" + item.pitchStrikeouts + " " + strikeoutsText +
                    "</span>, <span class='text-heavy'>" + item.pitchWins + " " + winsText +
                    "</span> and <span class='text-heavy'>" + item.pitchSaves + " " + savesText +
                    "</span>" + temporalInfo + "."];
    }
    else {
      var homeRunsText = item.batHomeRuns == "1" ? "Home Run" : "Home Runs";
      var rbiText = item.batRbi == "1" ? "RBI" : "RBIs";
      description = [playerLinkText, tense + " a <span class='text-heavy'>" + (item.batAverage != null ? item.batAverage.toPrecision(3) : "N/A") +
                    " Batting Average</span> with <span class='text-heavy'>" + item.batHomeRuns + " " + homeRunsText +
                    "</span>, <span class='text-heavy'>" + item.batRbi + " " + rbiText +
                    "</span> and a <span class='text-heavy'>" + (item.batSluggingPercentage != null ? item.batSluggingPercentage.toPrecision(3) : "N/A") +
                    " Slugging Percentage</span>" + temporalInfo + "."];
    }
    return SliderCarousel.convertToCarouselItemType1(index, {
      backgroundImage: item.fullBackgroundImageUrl,
      copyrightInfo: GlobalSettings.getCopyrightInfo(),
      subheader: [subHeaderYear, teamLinkText, " Player Stats"],
      profileNameLink: playerLinkText,
      description: description,
      lastUpdatedDate: item.displayDate,
      circleImageUrl: item.fullPlayerImageUrl,
      circleImageRoute: playerRoute
      // subImageUrl: item.fullTeamImageUrl,
      // subImageRoute: teamRoute
    });
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

  setSelectedKey(key: string) {
    this.selectedKey = key;
  }

  getSelectedKey(): string {
    return this.selectedKey;
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

  getCellData(item:PlayerStatsData, column:TableColumn):CellData {
    var display = null;
    var sort: any = null;
    var link: Array<any> = null;
    var imageUrl: string = null;
    switch (column.key) {
      case "name":
        display = item.playerName;
        sort = item.playerLastName + ", " + item.playerFirstName;
        link = MLBGlobalFunctions.formatPlayerRoute(item.teamName, item.playerName, item.playerId);
        imageUrl = item.fullPlayerImageUrl;
        break;

      //BATTING
      case "hr":
        if ( item.batHomeRuns != null ) {
          display = item.batHomeRuns;
          sort = Number(item.batHomeRuns);
        }
        break;

      case "ba":
        if ( item.batAverage != null ) {
          display = item.batAverage.toFixed(3);
          sort = Number(item.batAverage);
        }
        break;

      case "rbi":
        if ( item.batRbi != null ) {
          display = item.batRbi;
          sort = Number(item.batRbi);
        }
        break;

      case "h":
        if ( item.batHits != null ) {
          display = item.batHits;
          sort = Number(item.batHits);
        }
        break;

      case "bbb":
        if ( item.batBasesOnBalls != null ) {
          display = item.batBasesOnBalls;
          sort = Number(item.batBasesOnBalls);
        }
        break;

      case "obp":
        if ( item.batOnBasePercentage != null ) {
          display = item.batOnBasePercentage.toFixed(3);
          sort = Number(item.batOnBasePercentage);
        }
        break;

      case "slg":
        if ( item.batSluggingPercentage != null ) {
          display = item.batSluggingPercentage.toFixed(3);
          sort = Number(item.batSluggingPercentage);
        }
        break;

      //PITCHING
      case "wl":
        if ( item.pitchWins != null && item.pitchLosses != null ) {
          display = item.pitchWins + "-" + item.pitchLosses;
          var wins = item.pitchWins + "";
          var losses = item.pitchLosses + "";
          sort = ('00000' + wins).substr(wins.length) + "/" + ('00000' + losses).substr(losses.length); //pad with zeros
        }

        break;

      case "ip":
        if ( item.pitchInningsPitched != null ) {
          display = item.pitchInningsPitched.toString();
          sort = Number(item.pitchInningsPitched);
        }
        break;

      case "so":
        if ( item.pitchStrikeouts != null ) {
          display = item.pitchStrikeouts.toString();
          sort = Number(item.pitchStrikeouts);
        }
        break;

      case "era":
        if ( item.pitchEra != null ) {
          display = item.pitchEra.toFixed(2);
          sort = Number(item.pitchEra);
        }
        break;

      case "pbb":
        if ( item.pitchBasesOnBalls != null ) {
          display = item.pitchBasesOnBalls.toString();
          sort = Number(item.pitchBasesOnBalls);
        }
        break;

      case "whip":
        if ( item.whip != null ) {
          display = item.whip.toFixed(2);
          sort = Number(item.whip);
        }
        break;

      case "sv":
        if ( item.pitchSaves != null ) {
          display = item.pitchSaves.toString();
          sort = Number(item.pitchSaves);
        }
        break;
    }
    if ( display == null ) {
      display = "N/A";
    }
    return new CellData(display, sort, link, imageUrl);
  }
}
