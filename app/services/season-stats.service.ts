import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {MLBPageParameters} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';

import {ComparisonBarInput} from '../components/comparison-bar/comparison-bar.component';
import {SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
import {CircleImageData} from '../components/images/image-data';

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
        if( stats[year].leader !== undefined){
          let leader = stats[year].leader;
          let average = stats[year].average;
          let seasonStatsPlayer = stats[year].player;
          let worst = stats[year].worst;
          var playerBarStats = [];
          var leaderLists = [];
          for( var playerStat in leader ){
            var avgValue = this.getKeyValue(playerStat, average);
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
                color: '#555555',
              }],
              minValue: worst !== undefined ? Number(worstValue['statValue']).toFixed(1) : null,
              maxValue: leader != null ? Number(leaderValue['statValue']).toFixed(1) : null,
              info: 'fa-info-circle',
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
          // console.log("player bar", playerBarStats);
      }
      if( curYear - 4 < Number(year) || year == 'career' ){
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
      default: return null;
    }
  }
}
