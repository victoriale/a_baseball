import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';
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

export interface TeamPlayers {
  pitchers: Array<PlayerData>;
  catchers: Array<PlayerData>;
  fielders: Array<PlayerData>;
  batters: Array<PlayerData>;  
}

export interface DataPoint {
  [playerId: string]: number
} 

export interface SeasonStats {
  isCurrentSeason: boolean;
  batHomeRuns: DataPoint;
  batAverage: DataPoint;
  batRbi: DataPoint;
  batSluggingPercentage: DataPoint;
  batHits: DataPoint;
  batBasesOnBalls: DataPoint;
  batOnBasePercentage: DataPoint;
  batDoubles: DataPoint;
  batTriples: DataPoint;
  pitchEra: DataPoint;
  pitchWins: DataPoint;
  pitchLosses: DataPoint;
  pitchStrikeouts: DataPoint;
  pitchInningsPitched: DataPoint;
  pitchBasesOnBalls: DataPoint;
  pitchWhip: DataPoint;
  pitchSaves: DataPoint;
  pitchIpa: DataPoint;
  pitchHits: DataPoint;
  pitchEarnedRuns: DataPoint;
  pitchHomeRunsAllowed: DataPoint;
}

export interface ComparisonStatsData {
  playerOne: PlayerData;

  playerTwo: PlayerData;

  data: { [year: string]: SeasonStats };
  
  bars: { [year: string]: Array<ComparisonBarInput> };
}

@Injectable()
export class ComparisonStatsService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  
  private pitchingFields = [
    "pitchWins", "pitchInningsPitched", "pitchStrikeouts",
    "pitchEra", "pitchHits", "pitchEarnedRuns", 
    "pitchHomeRunsAllowed", "pitchBasesOnBalls"    
  ];
  
  private battingFields = [
    "batHomeRuns", "batAverage", "batRbi",
    "batHits", "batBasesOnBalls", "batOnBasePercentage",
    "batDoubles", "batTriples"
  ];

  constructor(public http: Http) { }

  getPlayerStats(pageParams: MLBPageParameters): Observable<ComparisonStatsData> {
    let url = this._apiUrl + "/player/comparison/";
    let teamsUrl = this._apiUrl + "/team/comparisonTeamList";
    
    if ( pageParams.playerId ) {
      //http://dev-homerunloyal-api.synapsys.us/player/comparison/player/95622
      url += "player/" + pageParams.playerId;
    }
    else if ( pageParams.teamId ) {
      //http://dev-homerunloyal-api.synapsys.us/player/comparison/team/2800
      url += "team/" + pageParams.teamId;      
    }
    else {
      //http://dev-homerunloyal-api.synapsys.us/player/comparison/league
      url += "league";
    }
    
    // console.log("getting player stats: " + url);
    var playerStatsObservable = this.http.get(url)
      .map(res => res.json())
      .map(data => {
        return this.formatData(data.data);
      });
      
    var teamListObservable = this.http.get(teamsUrl)
      .map(res => res.json())
      .map(data => {
        return this.formatTeamList(data.data);;
    });
    
    return Observable.forkJoin(playerStatsObservable, teamListObservable);
  }
  
  /*
  teamItem {
    teamId: string;
    teamFirstName: string;
    teamLastName: string;
    teamLogo: string;
  }
  */
  private formatTeamList(teamList) {
    return teamList.map(team => {
      var teamName = team.teamFirstName + " " + team.teamLastName;
      return {key: team.teamId, value: teamName};
    });
  }
  
  //TODO-CJP: figure out if pitcher or not
  private formatData(data: ComparisonStatsData): ComparisonStatsData {    
    var bars: { [year: string]: Array<ComparisonBarInput> } = {};    
    var fields = data.playerOne.position[0] == "Pitcher" ? this.pitchingFields : this.battingFields;
    
    data.playerOne.mainTeamColor = data.playerOne.teamColors[0];
    data.playerTwo.mainTeamColor = data.playerTwo.teamColors[0];
    if ( Gradient.areColorsClose(data.playerOne.teamColors[0], data.playerTwo.teamColors[0]) ) {
      if ( data.playerTwo.teamColors.length >= 2) {
        data.playerTwo.mainTeamColor = data.playerTwo.teamColors[1];
      } else if ( data.playerOne.teamColors.length >=2 ) {
        data.playerOne.mainTeamColor = data.playerOne.teamColors[1];
      }
    }
    
    for ( var seasonId in data.data ) {
      var seasonStatData = data.data[seasonId];
      var seasonBarList = [];
      
      for ( var i = 0; i < fields.length; i++ ) {
        var key = fields[i];
        var dataPoint: DataPoint = seasonStatData[key];
        if ( !dataPoint ) {
          console.log("no data point for " + key);
          break;
        }
        
        var title = this.getKeyDisplayTitle(key);
        if ( !title ) {
          console.log("no title for " + title);
          break;
        }
        
        seasonBarList.push({
          title: title,
          data: [{
            value: dataPoint[data.playerOne.playerId],
            color: data.playerOne.mainTeamColor
          }, 
          {
            value: dataPoint[data.playerTwo.playerId],
            color: data.playerTwo.mainTeamColor
          }],
          maxValue: dataPoint['statHigh']
        });
      }
      
      bars[seasonId] = seasonBarList;
    }
    
    data.bars = bars;
    return data;
  }
  
  private getKeyDisplayTitle(key: string): string {
    switch (key) {
      case "batHomeRuns": return "Home Runs";
      case "batAverage": return "Batting Average";
      case "batRbi": return "RBIs";
      // case "batSluggingPercentage": return "";
      case "batHits": return "Hits";
      case "batBasesOnBalls": return "Walks";
      case "batOnBasePercentage": return "On Base Percentage";
      case "batDoubles": return "Doubles";
      case "batTriples": return "Triples";
      case "pitchEra": return "Earned Run Average";
      case "pitchWins": return "Wins";
      // case "pitchLosses": return "";
      case "pitchStrikeouts": return "Strikeouts";
      case "pitchInningsPitched": return "Innings Pitched";
      case "pitchBasesOnBalls": return "Walks";
      // case "pitchWhip": return "";
      // case "pitchSaves": return "";
      // case "pitchIpa": return "";
      case "pitchHits": return "Hits";
      case "pitchEarnedRuns": return "Earned Runs";
      case "pitchHomeRunsAllowed": return "Home Runs";
      default: return null;      
    }
  }
}