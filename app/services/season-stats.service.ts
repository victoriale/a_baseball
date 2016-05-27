import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {MLBPageParameters} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Gradient} from '../global/global-gradient';

import {ComparisonBarInput} from '../components/comparison-bar/comparison-bar.component';

//TODO: unify player/team data interface
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
}

export interface DataPoint {
  [playerId: string]: number
}

export interface SeasonStats {
  isCurrentSeason: boolean;
  wins: DataPoint;
  strikeouts: DataPoint;
  era: DataPoint;
  hits: DataPoint;
  homeRuns: DataPoint;
  batAverage: DataPoint;
  rbi: DataPoint;
  basesOnBalls: DataPoint;
}
export interface SeasonStatsData {
  playerInfo: PlayerData;

  mlbInfo: PlayerData;

  data: { [year: string]: SeasonStats };

  bars: { [year: string]: Array<ComparisonBarInput> };
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

  getPlayerStats(pageParams: MLBPageParameters): Observable<SeasonStatsData> {
    var headers = this.setToken();
    let url = this._apiUrl + "/player/seasonStats/" + pageParams.playerId;
    // console.log("url", url);
    return this.http.get(url, {
      headers: headers
    })
    .map(res => res.json())
    .map(data => {
      return this.formatData(data);
    });
  }

  private formatData(data: SeasonStatsData): SeasonStatsData {
    for(var seasonId in data.data){
      // console.log("season id", seasonId);
      var seasonStatData = data.data[seasonId];
      var seasonBarList = [];
    }
    return data;
  }

  private getKeyDisplayTitle(key: string): string {
    switch (key) {
      //PITCHERS
      case "wins": return "Wins";
      case "inningsPitched": return "Innings Pitched (IP)";
      case "strikeouts": return "Strikeouts (SO)";
      case "era": return "ERA";
      case "hits": return "Hits";
      //BATTERS
      case "homeRuns": return "Home Runs (HR)";
      case "batAverage": return "Batting Average (BA)";
      case "rbi": return "Runs Batted In (RBI)";
      case "basesOnBalls": return "Walks (BB)";
      default: return null;
    }
  }
}
