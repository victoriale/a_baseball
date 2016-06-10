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

  private pitchingFields = ["wins", "inningsPitched", "strikeouts", "era", "hits"];

  private battingFields = ["homeRuns", "batAverage", "rbi", "hits", "basesOnBalls"];

  constructor(public http: Http) { }

  setToken(){
    var headers = new Headers();
    return headers;
  }

  getPlayerStats(playerId: number): Observable<ComparisonBarList> {
    return this.callPlayerComparisonAPI(Number(playerId), data => {
        return this.formatData(data);
      });
  }

  private callPlayerComparisonAPI(playerId: number, dataLoaded: Function) {
    let url = this._apiUrl + "/player/seasonStats/" + playerId;
    return this.http.get(url)
      .map(res => res.json())
      .map(data => dataLoaded(data.data));
  }

  private formatData(data: SeasonStatsData) {
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
          let average = stats[year].average;
          let seasonStatsPlayer = stats[year].player;
          let worst = stats[year].worst;
          var playerBarStats = [];
          var leaderLists = [];
          for( var playerStat in leader ){
            var avgValue = year != 'career' ? this.getKeyValue(playerStat, average) : null;
            var infoIcon = year != 'career' ? 'fa-info-circle' : null;
            var worstValue = this.getKeyValue(playerStat, worst);
            var leaderValue = this.getKeyValue(playerStat, leader);
            var s = {
              title: this.getKeyDisplayTitle(playerStat),
              data: [{
                value: Number(this.getKeyValue(playerStat, seasonStatsPlayer)).toFixed(1),
                color: '#BC1624',
              },
              {
                value: average != null ? Number(avgValue).toFixed(1) : null,
                color: '#444444',
              }],
              minValue: worst !== undefined ? Number(worstValue['statValue']).toFixed(1) : null,
              maxValue: leader != null ? Number(leaderValue['statValue']).toFixed(1) : null,
              info: infoIcon != null ? infoIcon : null,
              infoBoxDetails: [{
                teamName: leaderValue['players'][0].teamName,
                playerName: leaderValue['players'][0].firstName + ' ' + leaderValue['players'][0].playerLastName,
                infoBoxImage : {
                  imageClass: "image-40",
                  mainImage: {
                    imageUrl: GlobalSettings.getImageUrl(leaderValue['players'][0].playerHeadshot),
                    imageClass: "border-1",
                    urlRouteArray:  MLBGlobalFunctions.formatPlayerRoute(leaderValue['players'][0].teamName,leaderValue['players'][0].firstName + ' ' + leaderValue['players'][0].playerLastName, leaderValue['players'][0].playerId),
                    hoverText: "<i style='font-size: 18px;' class='fa fa-mail-forward'></i>",
                  },
                },
                routerLinkPlayer: MLBGlobalFunctions.formatPlayerRoute(leaderValue['players'][0].teamName,leaderValue['players'][0].firstName + ' ' + leaderValue['players'][0].playerLastName, leaderValue['players'][0].playerId),
                routerLinkTeam: MLBGlobalFunctions.formatTeamRoute(leaderValue['players'][0].teamName, leaderValue['players'][0].teamId),
              }],
            }
            playerBarStats.push(s);
          }
      }
      if( curYear - 4 < Number(year) || year != 'career' ){
        seasonStatTab.push({
          tabTitle: displayTab,
          tabData: playerBarStats
        });
      }//TODO
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
      case "pitchBasesOnBalls": return "Walks (BB)";

      case "pitchWins": return "Wins";
      case "pitchInningsPitched": return "Innings Pitched (IP)";
      case "pitchStrikeouts": return "Strikeouts (SO)";
      case "pitchEra": return "ERA";
      case "pitchHits": return "Hits";
      default: return null;
    }
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
      case "pitchBasesOnBalls": return data[key];

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

  getPageTitle(pageParams: MLBPageParameters, playerName: string): string {
    let groupName = this.formatGroupName(pageParams.season, pageParams.year);
    let pageTitle = "Season Stats";
    if ( playerName ) {
      pageTitle = "Season Stats - " + playerName;
    }
    return pageTitle;
  }

  //TODO using standing's until season stats page api is avaiable
  initializeAllTabs(pageParams: MLBPageParameters): Array<MLBSeasonStatsTabData> {
    let tabs: Array<MLBSeasonStatsTabData> = [];
      tabs.push(this.createTab(true, pageParams.season, pageParams.year));
      tabs.push(this.createTab(false, pageParams.season));
      tabs.push(this.createTab(false));
    return tabs;
  }
  //TODO using standing api until season stats api is available
  getSeasonStatsTabData(seasonStatsTab: MLBSeasonStatsTabData, pageParams: MLBPageParameters, onTabsLoaded: Function, maxRows?: number){
      var playerId = "96652";
      // console.log("seasonStatsTab",seasonStatsTab, pageParams);
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
            console.log("Error getting season stats data");
          });
  }
  //TODO
  private createTab(selectTab: boolean, season?: Season, year?: number) {
    let title = this.formatGroupName(season, year, true);
    return new MLBSeasonStatsTabData(title, season, year, selectTab);
  }
  //TODO
  private setupTabData(seasonStatsTab: MLBSeasonStatsTabData, apiData: any, playerId: number, maxRows?: number): any{
    var sections : Array<MLBSeasonStatsTableData> = [];
    var totalRows = 0;
    var conferenceKey = Season[seasonStatsTab.season];
    var divisionKey = seasonStatsTab.year;
    var divData = conferenceKey && divisionKey ? apiData[conferenceKey][divisionKey] : [];
    sections.push(this.setupTableData(seasonStatsTab.season, seasonStatsTab.year, divData, maxRows, false));

    if ( playerId ) {
      sections.forEach(section => {
        section.tableData.selectedKey = playerId;
      });
    }
    return sections;
  }

  private setupTableData(season:Season, year:number, rows: Array<TeamSeasonStatsData>, maxRows: number, includeTableName: boolean): MLBSeasonStatsTableData {
    let groupName = this.formatGroupName(season, year, true);

    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      rows = rows.slice(0, maxRows);
    }

    //Set display values
    rows.forEach((value, index) => {
      value.groupName = groupName;
      value.displayDate = GlobalFunctions.formatUpdatedDate(value.lastUpdated, false);
      value.fullImageUrl = GlobalSettings.getImageUrl(value.imageUrl);
      if ( value.backgroundImage ) {
        value.fullBackgroundImageUrl = GlobalSettings.getImageUrl(value.backgroundImage);
      }

      //Make sure numbers are numbers.
      value.totalWins = Number(value.totalWins);
      value.totalLosses = Number(value.totalLosses);
      value.winPercentage = Number(value.winPercentage);
      value.gamesBack = Number(value.gamesBack);
      value.streakCount = Number(value.streakCount);
      value.batRunsScored = Number(value.batRunsScored);
      value.pitchRunsAllowed = Number(value.pitchRunsAllowed);

      if ( value.teamId === undefined || value.teamId === null ) {
        value.teamId = index;
      }
    });

    let tableName = this.formatGroupName(season, year, true);
    var table = new MLBSeasonStatsTableModel(rows);
    return new MLBSeasonStatsTableData(includeTableName ? tableName : "", season, year, table);
  }
  // TODO groupname sample: Regular Season Total
  private formatGroupName(season: Season, year: number, makeDivisionBold?: boolean): string {
    return "YYYY";
  }
}
