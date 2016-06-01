import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
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
  teamColors: Array<string>
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
  [playerId: string]: number
}

export interface ComparisonBarList {
  [year: string]: Array<ComparisonBarInput>
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
        for( var playerStat in leader){
          var s = {
            title: this.getKeyDisplayTitle(playerStat),
            data: [{
              value: Number(this.getKeyValue(playerStat, seasonStatsPlayer)).toFixed(1),
              color: '#BC1624',
            },
            {
              value: Number(this.getKeyValue(playerStat, average)).toFixed(1),
              color: '#555555',
            }],
            minValue: Number(this.getKeyValue(playerStat, worst)['statValue']).toFixed(1),
            maxValue: Number(this.getKeyValue(playerStat, leader)['statValue']).toFixed(1),
            info: 'fa-info-circle',
          }
          playerBarStats.push(s);
        }
      }
      if( curYear - 4 < Number(year) || year != 'career'){
        seasonStatTab.push({
          tabTitle: displayTab,
          tabData: playerBarStats
        });
      }
    }
    seasonStatTab.sort();
    seasonStatTab.reverse();
    //TODO still need data for career stats
    // seasonStatTab.push({
    //   tabTitle: "Career Stats",
    //   tabData: playerBarStats
    // })
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
