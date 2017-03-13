import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
// import {ComparisonBarList} from './common-interfaces';

import {SliderCarousel, SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
import {CircleImageData} from '../components/images/image-data';
import {ComparisonBarInput} from '../components/comparison-bar/comparison-bar.component';
import {SeasonStatsModuleData, SeasonStatsTabData} from '../modules/season-stats/season-stats.module';

import {Season, MLBPageParameters} from '../global/global-interface';
import {TeamSeasonStatsData, MLBSeasonStatsTabData, MLBSeasonStatsTableModel, MLBSeasonStatsTableData} from './season-stats-page.data';
import {TableTabData} from '../components/season-stats/season-stats.component';

export interface SeasonStatsPlayerData {
  teamId: string;
  teamName: string;
  teamFirstName: string;
  teamLastName: string;
  playerId: string;
  playerName: string;
  playerFirstName: string;
  playerLastName: string;
  roleStatus: string;
  active: string;
  position: Array<string>;
  playerHeadshot: string;
  teamLogo: string;
  lastUpdate: string;
  liveImage: string;
  lastUpdateTimestamp: string;
}

// Interfaces to help convert API data into a ComparisonBarList that can be
// used to build the comparison bars in the module.
interface APISeasonStatsData {
  playerInfo: SeasonStatsPlayerData
  stats: { [year: string]: SeasonStats };
}

interface SeasonStats {
  leader: {[field:string]:DataPoint};
  average: {[field:string]:string};
  player: {[field:string]:string};
  worst: {[field:string]:DataPoint};
}

interface DataPoint {
  statValue: string;
  players: Array<SimplePlayerData>;
}

interface SimplePlayerData {
  firstName: string;
  playerLastName: string;
  playerId: string;
  teamId: string;
  teamName: string;
  teamLastName: string;
  playerHeadshot: string;
}

@Injectable()
export class SeasonStatsService {
  private _apiUrl: string = GlobalSettings.getApiUrl();

  private pitchingFields = ["pitchWins", "pitchInningsPitched", "pitchStrikeouts", "pitchEra", "pitchHits"];

  private battingFields = ["batHomeRuns", "batAverage", "batRbi", "batHits", "batBasesOnBalls"];

  constructor(public http: Http) { }

  setToken(){
    var headers = new Headers();
    return headers;
  }

  private getLinkToPage(playerId: number, playerName: string): Array<any> {
    return ["Season-stats-page", {
      playerId: playerId,
      fullName: GlobalFunctions.toLowerKebab(playerName)
    }];
  }

  getPlayerStats(playerId: number): Observable<SeasonStatsModuleData> {
    let url = this._apiUrl + "/player/seasonStats/" + playerId;
//     console.log("player stats: " + url);

    return this.http.get(url)
      .map(res => res.json())
      .map(data => this.formatData(data));
  }

  private formatData(data: APISeasonStatsData): SeasonStatsModuleData {
    if ( !data || !data.playerInfo ) {
      return null;
    }

    var fields = data.playerInfo.position[0].charAt(0) == "P" ? this.pitchingFields : this.battingFields;
    let playerInfo = data.playerInfo;
    let stats = data.stats;

    //Check to see if the position list contains pitcher abbreviation
    //in order to select the appropriate fields
    let isPitcher = playerInfo.position.filter(item => item == "P").length > 0;
    var seasonStatTabs = [];
    var curYear = new Date().getFullYear();

    //Load 4 years worth of data, starting from current year
    for ( var year = curYear; year > curYear-4; year-- ) {
      var strYear = year.toString();
      seasonStatTabs.push(this.getTabData(strYear, data, playerInfo.playerName, isPitcher, year == curYear));
    }
    //Load "Career Stats" data
    seasonStatTabs.push(this.getTabData("Career", data, playerInfo.playerName, isPitcher));
    return {
      tabs: seasonStatTabs,
      profileName: playerInfo.playerName,
      carouselDataItem: SeasonStatsService.getCarouselData(playerInfo, curYear.toString()),
      pageRouterLink: this.getLinkToPage(Number(playerInfo.playerId), playerInfo.playerName),
      playerInfo: playerInfo
    };
  }

  private getBarData(stats: SeasonStats, isCareer: boolean, isPitcher: boolean): Array<ComparisonBarInput> {
    if(stats.player !== undefined){ //catch if no data for season
    let statsToInclude = isPitcher ? this.pitchingFields : this.battingFields;
    let bars: Array<ComparisonBarInput> = [];

    for ( var index in statsToInclude ) {
      var fieldName = statsToInclude[index];
      var infoBox = null;

      //catch no stat data
      var worstValue = stats.worst[fieldName] != undefined ? stats.worst[fieldName] : null;
      var leaderValue = stats.leader[fieldName] != undefined ? stats.leader[fieldName] : null;
      var playerValue = stats.player[fieldName] != undefined ? stats.player[fieldName] : null;
      var dataPoints = [];

      //Set up data points
      if ( isCareer ) {
        dataPoints = [{
          value: this.formatValue(fieldName, playerValue),
          color: '#BC1624'
        }];
      }
      else {
        var avgValue = stats.average[fieldName] != null ? stats.average[fieldName] : 'N/A';
        var infoIcon = 'fa-info-circle';
        dataPoints = [{
          value: this.formatValue(fieldName, playerValue),
          color: '#BC1624',
          fontWeight: '800'
        },
        {
          value: this.formatValue(fieldName, avgValue),
          color: '#444444',
        }];

        //Set up info box only for non-career tabs
        if ( leaderValue == null ) {
          console.log("Error - leader value is null for " + fieldName);
        }
        else if ( leaderValue.players && leaderValue.players.length > 0 ) {
          var firstPlayer = leaderValue.players[0];
          var playerName = firstPlayer.firstName + ' ' + firstPlayer.playerLastName;
          var linkToPlayer = MLBGlobalFunctions.formatPlayerRoute(firstPlayer.teamName, playerName, firstPlayer.playerId);
          infoBox = [{
              teamName: firstPlayer.teamLastName,
              playerName: playerName,
              infoBoxImage : {
                imageClass: "image-40",
                mainImage: {
                  imageUrl: GlobalSettings.getImageUrl(firstPlayer.playerHeadshot, GlobalSettings._imgSmLogo),
                  imageClass: "border-1",
                  urlRouteArray:  linkToPlayer,
                  hoverText: "<i class='fa fa-mail-forward infobox-list-fa'></i>",
                },
              },
              routerLinkPlayer: linkToPlayer,
              routerLinkTeam: MLBGlobalFunctions.formatTeamRoute(firstPlayer.teamName, firstPlayer.teamId),
            }];
        }
      }

      bars.push({
        title: this.getKeyDisplayTitle(fieldName),
        data: dataPoints,
        minValue: worstValue != null ? Number(this.formatValue(fieldName, worstValue.statValue)) : null,
        maxValue: leaderValue != null ? Number(this.formatValue(fieldName, leaderValue.statValue)) : null,
        info: infoIcon != null ? infoIcon : null,
        infoBoxDetails: infoBox,
        qualifierLabel: SeasonStatsService.getQualifierLabel(fieldName)
      });
    }
    return bars;
    }
  }


  private getTabData(seasonId: string, data: APISeasonStatsData, playerName: string, isPitcher: boolean, isCurrYear?: boolean): SeasonStatsTabData {
    var legendValues;
    var subTitle;
    var tabTitle;
    var longSeasonName; // for display in the carousel and module title
    var isCareer = seasonId.toLowerCase() == "career";
    var bars: Array<ComparisonBarInput> = this.getBarData(data.stats[seasonId.toLowerCase()], isCareer, isPitcher);

    if ( isCareer ) {
      tabTitle = "Career Stats";
      subTitle = tabTitle;
      longSeasonName = "Career";
      legendValues = [
          { title: playerName,    color: '#BC2027' },
          { title: "Stat High",  color: "#E1E1E1" }
      ];
    }
    else {
      if ( isCurrYear ) {
        tabTitle = "Current Season";
        subTitle = tabTitle;
        longSeasonName = tabTitle;
      }
      else {
        tabTitle = seasonId;
        subTitle = seasonId + " Season";
        longSeasonName = subTitle;
      }
      legendValues = [
          { title: playerName,    color: '#BC2027' },
          { title: 'MLB Average', color: '#444444' },
          { title: "MLB Leader",  color: "#E1E1E1" }
      ];
    }

    return {
      longSeasonName: longSeasonName,
      tabTitle: tabTitle,
      comparisonLegendData: {
        legendTitle: [
          { text: subTitle, class: 'text-heavy' },
          { text: ' Stats' }
        ],
        legendValues: legendValues
      },
      tabData: bars
    };
  }

  static getCarouselData(playerInfo: SeasonStatsPlayerData, longSeasonName: string): SliderCarouselInput {
    if ( !playerInfo ) {
      return null;
    }
    var teamRoute = MLBGlobalFunctions.formatTeamRoute(playerInfo.teamName, playerInfo.teamId);
    var teamRouteText = {
      route: teamRoute,
      text: playerInfo.teamName,
      class: 'text-heavy'
    };
    var playerRouteText = {
      text: playerInfo.playerName
    };
    return SliderCarousel.convertToCarouselItemType1(1, {
      backgroundImage: GlobalSettings.getBackgroundImageUrl(playerInfo.liveImage),
      copyrightInfo: GlobalSettings.getCopyrightInfo(),
      subheader: [longSeasonName + " Stats Report"],
      profileNameLink: playerRouteText,
      description: ["Team: ", teamRouteText],
      lastUpdatedDate: GlobalFunctions.formatUpdatedDate(playerInfo.lastUpdate),
      circleImageUrl: GlobalSettings.getImageUrl(playerInfo.playerHeadshot, GlobalSettings._imgLgLogo),
      circleImageRoute: null, //? the single item on the player profile page, so no link is needed
      // subImageUrl: GlobalSettings.getImageUrl(data.playerInfo.teamLogo, GlobalSettings._imgLgLogo),
      // subImageRoute: teamRoute
    });
  }

  static getQualifierLabel(key: string): string {
    switch (key) {
      case "pitchBasesOnBalls":
      case "pitchHits":
      case "pitchEra":
      case "pitchEarnedRuns":
      case "pitchHomeRunsAllowed":
        return "A lower number indicates a stronger performance.";

      default:
        return null;
    }
  }

  private getKeyDisplayTitle(key: string): string {
    switch (key) {
      case "batHomeRuns": return "Home Runs (HR)";
      case "batAverage": return "Batting Average (BA)";
      case "batRbi": return "Runs Batted In (RBI)";
      case "batHits": return "Hits (H)";
      case "batBasesOnBalls": return "Walks (BB)";

      case "pitchWins": return "Wins";
      case "pitchInningsPitched": return "Innings Pitched (IP)";
      case "pitchStrikeouts": return "Strike Outs (SO)";
      case "pitchEra": return "ERA";
      case "pitchHits": return "Hits";
      default: return null;
    }
  }

  private formatValue(fieldName: string, value: string): string {
    if ( value == null ) {
      return null;
    }
    switch (fieldName) {
      case "batAverage":           return Number(value).toFixed(3);
      case "pitchInningsPitched":  return Number(value).toFixed(1);
      case "pitchEra":             return Number(value).toFixed(2);

      case "batHomeRuns":
      case "batRbi":
      case "batHits":
      case "batBasesOnBalls":
      case "pitchWins":
      case "pitchStrikeouts":
      case "pitchHits":
      default: return Number(value).toFixed(0);
    }
  }
}

@Injectable()
export class SeasonStatsPageService {
  constructor(public http: Http, private _mlbFunctions: MLBGlobalFunctions){}

  getPageTitle( pageParams: MLBPageParameters, playerName: string): string {
    let pageTitle = "Season Stats";
    if ( playerName ) {
      pageTitle = "Season Stats - " + playerName;
    }
    return pageTitle;
  }

  initializeAllTabs(pageParams: MLBPageParameters): Array<MLBSeasonStatsTabData> {
    let tabs: Array<MLBSeasonStatsTabData> = [];
    var curYear = new Date().getFullYear();
    var year = curYear;
    var playerName = pageParams['playerName'];
    var possessivePlayer = GlobalFunctions.convertToPossessive(playerName);
    //create tabs for season stats from current year of MLB and back 3 years
    for ( var i = 0; i < 4; i++ ){
      let title = year == curYear ? 'Current Season' : year.toString();
      let tabName = possessivePlayer + " " + title + " Stats";
      tabs.push(new MLBSeasonStatsTabData(title, tabName, null, year.toString(), i==0));
      year--;
    }
    //also push in last the career stats tab
    let title = 'Career Stats';
    let tabName = possessivePlayer + " Career Stats";
    tabs.push(new MLBSeasonStatsTabData(title, tabName, null, 'career', false));
    return tabs;
  }

  getSeasonStatsTabData(seasonStatsTab: MLBSeasonStatsTabData, pageParams: MLBPageParameters, onTabsLoaded: Function, maxRows?: number){
      var playerId = pageParams.playerId;
      //example url: http://dev-homerunloyal-api.synapsys.us/player/statsDetail/96652
      let url = GlobalSettings.getApiUrl() + "/player/statsDetail/" + playerId;
      seasonStatsTab.isLoaded = false;
      seasonStatsTab.hasError = false;

      this.http.get(url)
          .map(res => res.json())
          .map(data => this.setupTabData(seasonStatsTab, data.data, pageParams.teamId, maxRows))
          .subscribe(data => {
            seasonStatsTab.isLoaded = true;
            seasonStatsTab.hasError = false;
            seasonStatsTab.sections = data;
            onTabsLoaded(data);
          },
          err => {
            seasonStatsTab.isLoaded = true;
            seasonStatsTab.hasError = true;
            console.log("Error getting season stats data", err);
          });
  }

  private setupTabData(seasonStatsTab: MLBSeasonStatsTabData, apiData: any, playerId: number, maxRows: number): any{
    let seasonTitle;
    let sectionTable;
    var sections : Array<MLBSeasonStatsTableData> = [];
    var totalRows = 0;
    var seasonKey = seasonStatsTab.year;
    var tableData = {};
    //run through each object in the api and set the title of only the needed season for the table regular and post season
    for(var season in apiData){
      switch(season){
        case 'regularSeason':
          seasonTitle = "Regular Season";
          break;
        case 'postSeason':
          seasonTitle = "Post Season";
          break;
        default:
          break;
      }
      // we only care about the tables that meet the switch cases being regular and post season
      if(seasonTitle != null){
        //set the section table to season
        sectionTable = apiData[season];
        //section Table now need to be set to sectionYear which are each of the different stats for each season of that [YEAR] being 'total' and 'average' NOTE: 'total' is being sent back as 'stat'
        if(seasonKey == 'career'){
          let sectionTitle;
          var sectionStat;
          //look for the career total and grab all the stats for the players career
          for(var statType in sectionTable[seasonKey]){
            switch(statType){
              case 'averages':
              sectionStat = "Average";
              sectionTitle = seasonTitle + " " + sectionStat;
              break;
              case 'stats':
              sectionStat = "Total";
              sectionTitle = seasonTitle + " " + sectionStat;
              break;
              default:
              break;
            }
            //run through each object in the api and set the title of only the needed section for the table averages and stats 'total'
            if(sectionTitle != null){
              let sectionData = [];
              for(var year in sectionTable){//grab all season data and push them into a single array for career stats tab
                sectionTable[year][statType].playerInfo = apiData.playerInfo;
                sectionTable[year][statType].teamInfo = sectionTable[year].teamInfo != null ? sectionTable[year].teamInfo : {};
                if(year != 'career'){
                  sectionData.push(sectionTable[year][statType]);
                }
              }
              sectionTable['career'][statType]['seasonId'] = 'Career';
              sectionTable['career'][statType]['sectionStat'] = sectionStat;
              sectionData.push(sectionTable['career'][statType]);

              //sort by season id and put career at the end
              sections.push(this.setupTableData(sectionTitle, seasonKey, sectionData, maxRows));
            }//END OF SECTION TITLE IF STATEMENT
          }//END OF SEASON YEAR FOR LOOP

        }else{
          var sectionYear = sectionTable[seasonKey];
          if(sectionYear != null){// check if there are even stats for the season existing
            let sectionTitle;
            for(var statType in sectionYear){
              switch(statType){
                case 'averages':
                sectionTitle = seasonTitle + " " + "Average";
                break;
                case 'stats':
                sectionTitle = seasonTitle + " " + "Total";
                break;
                default:
                break;
              }
              //run through each object in the api and set the title of only the needed section for the table averages and stats 'total'
              if(sectionTitle != null){
                let sectionData = sectionYear[statType];
                sectionData.playerInfo = apiData.playerInfo;
                sectionData.teamInfo = sectionYear.teamInfo != null ? sectionYear.teamInfo : {};
                sections.push(this.setupTableData(sectionTitle, seasonKey, sectionData, maxRows));
              }//END OF SECTION TITLE IF STATEMENT
            }//END OF SEASON YEAR FOR LOOP
          }//end of season year if check
        }//end of season key check
      }//END OF SEASON TITLE IF STATEMENT
    }//END OF SEASON FOR LOOP
    // this.convertAPIData(apiData.regularSeason, tableData);
    return sections;
  }

  private setupTableData(season, year, rows: Array<any>, maxRows: number): MLBSeasonStatsTableData {
    var tableName;
    let self = this;
    //convert object coming in into array
    if(year == 'career'){
      var rowArray = rows;
    }else{
      var rowArray = [];
      rowArray.push(rows);
    }
    tableName = season;
    var table = new MLBSeasonStatsTableModel(rowArray, true);// set if pitcher to true

    return new MLBSeasonStatsTableData(tableName, season, year, table);
  }

  private getKeyValue(key: string, data): string {
    if(data[key] == null){
      data[key] = {};
    }
    switch (key) {
      case "batHomeRuns": return data[key];
      case "batAverage": return data[key];
      case "batRbi": return data[key];
      case "batHits": return data[key];
      case "batBasesOnBalls": return data[key];
      case "batOnBasePercentage": return data[key];
      case "batRunsScored": return data[key];
      case "batSluggingPercentage": return data[key];

      case "pitchWins": return data[key];
      case "pitchInningsPitched": return data[key];
      case "pitchStrikeouts": return data[key];
      case "pitchEra": return data[key];
      case "pitchHits": return data[key];
      case "pitchLosses": return data[key];
      case "pitchEarnedRuns": return data[key];
      case "pitchBasesOnBalls": return data[key];
      case "pitchWhip": return data[key];
      default: return '0';
    }
  }
}
