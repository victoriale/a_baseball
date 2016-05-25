import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';
import {MLBPageParameters} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Gradient} from '../global/global-gradient';

import {ComparisonModuleData} from '../modules/comparison/comparison.module';
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

export interface ComparisonBarList {
  [year: string]: Array<ComparisonBarInput>
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
  bars: ComparisonBarList;
}

export class MLBComparisonModuleData implements ComparisonModuleData {
    data: ComparisonStatsData;
    
    teamList: Array<{key: string, value: string}>;
    
    playerLists: Array<{
      teamId: string,
      playerList: Array<{key: string, value: string}>
    }>;
    
    constructor(private _service: ComparisonStatsService) {}
    
    loadTeamList(listLoaded: Function) {
      if ( this.teamList == null ) {
        throw new Error("teamList has not been initialized");
      }
      // there will be at most two teams in the list on inital load,
      // so the list should only be reloaded if there are two or fewer 
      // teams in the list
      if ( !this.teamList || this.teamList.length <= 2 ) {
        this._service.getTeamList().subscribe(data => {
          this.teamList = data;
          listLoaded(this.teamList);
        }, 
        err => {
          console.log("Error loading team list for comparison module: " + err);
        })
      }
      else {
        listLoaded(this.teamList);
      }
    }
    
    loadPlayerList(index: number, newTeamId: string, listLoaded: Function) {
      if ( this.playerLists == null || this.playerLists.length < 2) {
        throw new Error("playerLists has not been initialized or does not have enough items");
      }
      if ( index > 2 ) { // only two items should be in player lists
        index = index % 2;
      }
      var teamData = this.playerLists[index];
      console.log("teamData: " + teamData);
      if ( teamData.playerList ) {
        console.log("  playerList: " + teamData.playerList.length);
      }
      if ( newTeamId != teamData.teamId || !teamData.playerList || teamData.playerList.length <= 1 ) {
        teamData.teamId = newTeamId;
        teamData.playerList = [];
        this._service.getPlayerList(newTeamId).subscribe(data => {          
          teamData.playerList = data;
          listLoaded(teamData.playerList);
        }, 
        err => {
          console.log("Error loading player list for " + newTeamId + " for the comparison module: " + err);
        })
      }
      else {
        listLoaded(teamData.playerList);
      }      
    }
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

  getInitialPlayerStats(pageParams: MLBPageParameters): Observable<ComparisonModuleData> {
    return this.callPlayerComparisonAPI(pageParams.teamId, pageParams.playerId, data => {
      // var data = apiData.data;
      data.bars = this.formatData(data);
      
      var team1Data = {
        teamId: data.playerOne.teamId,
        playerList: [{key: data.playerOne.playerId, value: data.playerOne.playerName}]
      };
              
      var team2Data = {
        teamId: data.playerTwo.teamId,
        playerList: [{key: data.playerTwo.playerId, value: data.playerTwo.playerName}]
      };
      
      var moduleData = new MLBComparisonModuleData(this);        
      moduleData.data = data;
      moduleData.teamList = [
          {key: data.playerOne.teamId, value: data.playerOne.teamName},
          {key: data.playerTwo.teamId, value: data.playerTwo.teamName}
      ];
      moduleData.playerLists = [
        team1Data,
        team2Data
      ];
      return moduleData;
    });
  }

  getPlayerStats(playerId: string): Observable<ComparisonBarList> {
    return this.callPlayerComparisonAPI(null, Number(playerId), data => {
        return this.formatData(data.data);
      });
  }

  getPlayerList(teamId: string): Observable<Array<{key: string, value: string}>> {
    //http://dev-homerunloyal-api.synapsys.us/team/comparisonRoster/2800
    let playersUrl = this._apiUrl + "/team/comparisonRoster/" + teamId;
    return this.http.get(playersUrl)
      .map(res => res.json())
      .map(data => {
        return this.formatPlayerList(data.data);;
    });
  }

  getTeamList(): Observable<Array<{key: string, value: string}>> {
    let teamsUrl = this._apiUrl + "/team/comparisonTeamList";      
    return this.http.get(teamsUrl)
      .map(res => res.json())
      .map(data => {
        return this.formatTeamList(data.data);;
    });
  }
  
  private callPlayerComparisonAPI(teamId: number, playerId: number, dataLoaded: Function) {
    let url = this._apiUrl + "/player/comparison/";
    let teamsUrl = this._apiUrl + "/team/comparisonTeamList";
    
    if ( playerId ) {
      //http://dev-homerunloyal-api.synapsys.us/player/comparison/player/95622
      url += "player/" + playerId;
    }
    else if ( teamId ) {
      //http://dev-homerunloyal-api.synapsys.us/player/comparison/team/2800
      url += "team/" + teamId;      
    }
    else {
      //http://dev-homerunloyal-api.synapsys.us/player/comparison/league
      url += "league";
    }
    
    // console.log("getting player stats: " + url);
    return this.http.get(url)
      .map(res => res.json())
      .map(data => dataLoaded(data.data));    
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
  
  private formatPlayerList(playerList: TeamPlayers) {
    var list = [];
    Array.prototype.push.apply(list, this.formatPlayerPositionList("Pitchers", playerList.pitchers));
    Array.prototype.push.apply(list, this.formatPlayerPositionList("Catchers", playerList.catchers));
    Array.prototype.push.apply(list, this.formatPlayerPositionList("Fielders", playerList.fielders));
    Array.prototype.push.apply(list, this.formatPlayerPositionList("Batters", playerList.batters));
    return list;
  }
  
  private formatPlayerPositionList(description:string, playerList: Array<PlayerData>) {
    var dropdownList = [];
    
    if ( playerList && playerList.length > 0 ) {
      dropdownList.push({ key: "", value: description, class: "dropdown-grp-lbl" });
      Array.prototype.push.apply(dropdownList, playerList.map(player => {
        return {key: player.playerId, value: player.playerName, class: "dropdown-grp-item"};
      }));
    }
    
    return dropdownList;
  }
  
  private formatData(data: ComparisonStatsData): ComparisonBarList {   
    //TODO-CJP: figure out if pitcher or not - should users be allowed to compare pitchers vs batters?  
    var fields = data.playerOne.position[0] == "Pitcher" ? this.pitchingFields : this.battingFields;
    
    var bars: { [year: string]: Array<ComparisonBarInput> } = {};    
    
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
    
    return bars;      
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