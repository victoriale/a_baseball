import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';

import {ComparisonBarInput} from '../components/comparison-bar/comparison-bar.component';
import {SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
import {CircleImageData} from '../components/images/image-data';

import {Season, MLBPageParameters} from '../global/global-interface';
import {TeamSeasonStatsData, MLBSeasonStatsTabData, MLBSeasonStatsTableModel, MLBSeasonStatsTableData} from './season-stats-page.data';
import {TableTabData} from '../components/season-stats/season-stats.component';
export interface PlayerData {
  playerName: string;
  playerId: string;
  playerHeadshot: string;
  teamLogo: string;
  teamName: string;
  teamId: string;
  teamColors: Array<string>;
  mainTeamColor: string;
  uniformNumber: number;
  position: string;
  height: string;
  weight: number;
  age: number;
  yearsExperience: number;
  liveImage: string;
  lastUpdated: string;
}

export interface DataPoint {
  [playerId: string]: number;
}

export interface ComparisonBarList {
  [year: string]: Array<ComparisonBarInput>;
}

export interface SeasonStats {
  batHomeRuns: number;
  batAverage: number;
  batRbi: number;
  batHits: number;
  pitchBasesOnBalls: number;
  pitchWins: number;
  pitchInningsPitched: number;
  pitchStrikeouts: number;
  pitchEra: number;
  pitchHits: number;
  statValue: string;
  leader: SeasonStatsData;
  average: SeasonStatsData;
  player: SeasonStatsData;
  worst: any;
}
export interface SeasonStatsData {
  playerInfo: PlayerData;
  tabs: any;
  // playerInfo: PlayerData;
  stats: { [year: string]: SeasonStats };
  bars: ComparisonBarList;
}
@Injectable()
export class SeasonStatsService {
  private _apiUrl: string = GlobalSettings.getApiUrl();

  private pitchingFields = ["pitchWins", "pitchInningsPitched", "pitchStrikeouts", "pitchEra", "pitchHits"];

  private battingFields = ["batHomeRuns", "batAverage", "batRbi", "batHits", "pitchBasesOnBalls"];

  constructor(public http: Http) { }

  setToken(){
    var headers = new Headers();
    return headers;
  }

  getPlayerStats(playerId: number): Observable<ComparisonBarList> {
    return this.callPlayerStatsAPI(playerId, data => {
        return this.formatData(data);
      });
  }

  private callPlayerStatsAPI(playerId: number, dataLoaded: Function) {
    let url = this._apiUrl + "/player/seasonStats/" + playerId;
    return this.http.get(url)
      .map(res => res.json())
      .map(data => dataLoaded(data.data));
  }

  private formatData(data: SeasonStatsData) {
    var fields = data.playerInfo.position[0].charAt(0) == "P" ? this.pitchingFields : this.battingFields;
    let playerInfo = data.playerInfo;
    let stats = data.stats;
    var seasonStatTab = [];
    var curYear = new Date().getFullYear();

    try{
      for(var year in stats){
        var displayTab = '';
        if(Number(year) == curYear){
          displayTab = 'Current Season';
        }else if(year == 'career'){
          displayTab = 'Career Stats';
        }else{
          displayTab = year;
        }
        if( stats[year].leader !== undefined ){
          let leader = stats[year].leader;
          var average = year != 'career' ? stats[year].average : null;
          let seasonStatsPlayer = stats[year].player;
          let worst = stats[year].worst;
          var playerBarStats = [];
          var leaderLists = [];
          for( var i = 0; i < fields.length; i++ ){
            var key = fields[i];
            var title = this.getKeyDisplayTitle(key);
            var avgValue = year != 'career' ? this.getKeyValue(key, average) : 0;
            var infoIcon = year != 'career' ? 'fa-info-circle' : null;
            var worstValue = this.getKeyValue(key, worst);
            var leaderValue = this.getKeyValue(key, leader);
            var playerValue = Number(this.getKeyValue(key, seasonStatsPlayer)).toFixed(0);
            var career = [];
            if( year != 'career' ){
              career = [{
                value: playerValue,
                color: '#BC1624',
                fontWeight: '800'
              },
              {
                value: average != null ? Number(avgValue).toFixed(0) : null,
                color: '#444444',
              }]
            } else {
              career = [{
                value: playerValue,
                color: '#BC1624',
              }]
            }
            for( var index = 0; index < leaderValue['players'].length; index++ ){

              var s = {
                title: title,
                data: career,
                minValue: worst !== undefined ? Number(worstValue['statValue']).toFixed(0) : null,
                maxValue: leader != null ? Number(leaderValue['statValue']).toFixed(0) : null,
                info: infoIcon != null ? infoIcon : null,
                infoBoxDetails: [{
                  teamName: leaderValue['players'][index].teamName,
                  playerName: leaderValue['players'][index].firstName + ' ' + leaderValue['players'][index].playerLastName,
                  infoBoxImage : {
                    imageClass: "image-40",
                    mainImage: {
                      imageUrl: GlobalSettings.getImageUrl(leaderValue['players'][index].playerHeadshot),
                      imageClass: "border-1",
                      urlRouteArray:  MLBGlobalFunctions.formatPlayerRoute(leaderValue['players'][index].teamName,leaderValue['players'][index].firstName + ' ' + leaderValue['players'][index].playerLastName, leaderValue['players'][index].playerId),
                      hoverText: "<i style='font-size: 18px;' class='fa fa-mail-forward'></i>",
                    },
                  },
                  routerLinkPlayer: MLBGlobalFunctions.formatPlayerRoute(leaderValue['players'][index].teamName,leaderValue['players'][index].firstName + ' ' + leaderValue['players'][index].playerLastName, leaderValue['players'][index].playerId),
                  routerLinkTeam: MLBGlobalFunctions.formatTeamRoute(leaderValue['players'][index].teamName, leaderValue['players'][index].teamId),
                }],
              }
            }

            playerBarStats.push(s);
          }
      }
      if( curYear - 4 < Number(year) || year != 'career' ){
        seasonStatTab.push({
          tabTitle: displayTab,
          tabData: playerBarStats
        });
      }
     }// forloop ends
    } catch ( error ){
        console.log("season stat error message: ", error);
    }
    seasonStatTab.sort();
    seasonStatTab.reverse();
    if(year == 'career'){
      seasonStatTab.push({
        tabTitle: "Career Stats",
        tabData: playerBarStats
      })
    }//TODO

    return {
      playerInfo: playerInfo,
      tabs: seasonStatTab
    };
  }

  private getKeyDisplayTitle(key: string): string {
    switch (key) {
      case "batHomeRuns": return "Home Runs (HR)";
      case "batAverage": return "Batting Average (BA)";
      case "batRbi": return "Runs Batted In (RBI)";
      case "batHits": return "Hits";
      case "batBasesOnBalls": return "Walks (BB)";

      case "pitchWins": return "Wins";
      case "pitchInningsPitched": return "Innings Pitched (IP)";
      case "pitchStrikeouts": return "Strike Outs (SO)";
      case "pitchEra": return "ERA";
      case "pitchHits": return "Hits";
      default: return null;
    }
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

      case "pitchWins": return data[key];
      case "pitchInningsPitched": return data[key];
      case "pitchStrikeouts": return data[key];
      case "pitchEra": return data[key];
      case "pitchHits": return data[key];
      default: return '0';
    }
  }
}
@Injectable()
export class SeasonStatsPageService {
  constructor(public http: Http, private _globalFunctions: GlobalFunctions, private _mlbFunctions: MLBGlobalFunctions){}

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
    //create tabs for season stats from current year of MLB and back 3 years
    for ( var i = 0; i < 4; i++ ){
      tabs.push(new MLBSeasonStatsTabData(year.toString(), null, year.toString(), i==0));
      year--;
    }
    //also push in last the career stats tab
    tabs.push(new MLBSeasonStatsTabData('Career Stats', null, 'career', false));
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
    //TODO need to put these objects into a working enviroment for regular season and years
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
          //look for the career total and grab all the stats for the players career
          for(var statType in sectionTable[seasonKey]){
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
              let sectionData = [];
              for(var year in sectionTable){//grab all season data and push them into a single array for career stats tab
                sectionData['playerInfo'] = apiData.playerInfo;
                sectionTable[year][statType]['teamInfo'] = sectionTable[year].teamInfo != null ? sectionTable[year].teamInfo : {};
                if(year != 'career'){
                  sectionData.push(sectionTable[year][statType]);
                }
              }
              sectionTable['career'][statType]['seasonId'] = 'Career';
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
                sectionData['playerInfo'] = apiData.playerInfo;
                sectionData['teamInfo'] = sectionYear.teamInfo != null ? sectionYear.teamInfo : {};
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

  private setupTableData(season, year, rows: Array<any>, maxRows: number): Array<MLBSeasonStatsTableData> {
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
    // console.log(key, data);
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
  // TODO groupname sample: Regular Season Total
  // private formatGroupName(season: Season, year: number, makeDivisionBold?: boolean): string {
  //   return "YYYY";
  // }
}
