import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';
import {MLBPageParameters} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Gradient} from '../global/global-gradient';
import {SeasonStatsService} from './season-stats.service';

import {ComparisonModuleData} from '../modules/comparison/comparison.module';
import {ComparisonBarInput} from '../components/comparison-bar/comparison-bar.component';
import {ComparisonBarList} from './common-interfaces';

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
  position: Array<string>;
  height: string;
  weight: number;
  age: number;
  yearsExperience: number;
  statistics: { [seasonId: string]: SeasonStats };
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

export class SeasonStats {
  isCurrentSeason: boolean;
  batHomeRuns: number;
  batAverage: number;
  batRbi: number;
  batSluggingPercentage: number;
  batHits: number;
  batBasesOnBalls: number;
  batOnBasePercentage: number;
  batDoubles: number;
  batTriples: number;
  pitchEra: number;
  pitchWins: number;
  pitchLosses: number;
  pitchStrikeouts: number;
  pitchInningsPitched: number;
  pitchBasesOnBalls: number;
  pitchWhip: number;
  pitchSaves: number;
  pitchIpa: number;
  pitchHits: number;
  pitchEarnedRuns: number;
  pitchHomeRunsAllowed: number;
}

export interface ComparisonStatsData {
  playerOne: PlayerData;
  playerTwo: PlayerData;
  bestStatistics: { [seasonId: string]: SeasonStats };
  worstStatistics: { [seasonId: string]: SeasonStats };
  data: { [year: string]: any };
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
          console.log("Error loading team list for comparison module", err);
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
      if ( newTeamId != teamData.teamId || !teamData.playerList || teamData.playerList.length <= 1 ) {
        teamData.teamId = newTeamId;
        teamData.playerList = [];
        this._service.getPlayerList(newTeamId).subscribe(data => {
          teamData.playerList = data;
          //TODO - widen dropdown to
          // teamData.playerList[1].value += "Something longer than ever";
          listLoaded(teamData.playerList);
        },
        err => {
          console.log("Error loading player list for " + newTeamId + " for the comparison module", err);
        })
      }
      else {
        listLoaded(teamData.playerList);
      }
    }

    loadPlayer(index: number, teamId: string, playerId: string, statsLoaded: Function) {
      if ( index > 2 ) { // only two items should be in player lists
        index = index % 2;
      }
      this._service.getSinglePlayerStats(index, this.data, teamId, playerId).subscribe(bars => {
        statsLoaded(bars);
      },
      err => {
        console.log("Error loading player comparison stats", err);
      });
    }
}

@Injectable()
export class ComparisonStatsService {
  private _apiUrl: string = GlobalSettings.getApiUrl();

  private pitchingFields = [
    "pitchWins",
    "pitchInningsPitched",
    "pitchStrikeouts",
    "pitchEra",
    // "pitchSaves",
    "pitchHits",
    "pitchEarnedRuns",
    "pitchHomeRunsAllowed",
    "pitchBasesOnBalls"
  ];

  private battingFields = [
    "batHomeRuns", "batAverage", "batRbi",
    "batHits", "batBasesOnBalls", "batOnBasePercentage",
    "batDoubles", "batTriples"
  ];

  constructor(public http: Http) { }

  getInitialPlayerStats(pageParams: MLBPageParameters): Observable<ComparisonModuleData> {
    var teamId = pageParams.teamId != null ? pageParams.teamId.toString() : null;
    var playerId = pageParams.playerId != null ? pageParams.playerId.toString() : null;
    return this.callPlayerComparisonAPI(teamId, playerId, data => {
      if ( data == null ) {
        console.log("Error: No valid comparison data for " + (pageParams.playerId != null ? " player " + playerId + " in " : "") + " team " + teamId);
        return null;
      }
      data.playerOne.statistics = this.formatPlayerData(data.playerOne.playerId, data.data);
      data.playerTwo.statistics = this.formatPlayerData(data.playerTwo.playerId, data.data);
      data.bestStatistics = this.formatPlayerData("statHigh", data.data);
      data.worstStatistics = this.formatPlayerData("statLow", data.data);
      data.bars = this.createComparisonBars(data);

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

  getSinglePlayerStats(index:number, existingData: ComparisonStatsData, teamId: string, playerId: string): Observable<ComparisonBarList> {
    return this.callPlayerComparisonAPI(teamId, playerId, apiData => {
      apiData.playerOne.statistics = this.formatPlayerData(apiData.playerOne.playerId, apiData.data);
      if ( index == 0 ) {
        existingData.playerOne = apiData.playerOne;
      }
      else {
        existingData.playerTwo = apiData.playerOne;
      }
      return this.createComparisonBars(existingData);
    });
  }

  getPlayerList(teamId: string): Observable<Array<{key: string, value: string, class: string}>> {
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
    // console.log("teams url: " + teamsUrl);
    return this.http.get(teamsUrl)
      .map(res => res.json())
      .map(data => {
        return this.formatTeamList(data.data);
    });
  }

  callPlayerComparisonAPI(teamId: string, playerId: string, dataLoaded: Function) {
    let url = this._apiUrl + "/player/comparison/";

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

//    console.log("getting player stats: " + url);
    return this.http.get(url)
      .map(res => res.json())
      .map(data => {
        return dataLoaded(data.data);
      });
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

  private formatPlayerPositionList(description:string, playerList: Array<any>) {
    var dropdownList = [];

    if ( playerList && playerList.length > 0 ) {
      dropdownList.push({ key: "", value: description, class: "dropdown-grp-lbl", preventSelection: true });
      Array.prototype.push.apply(dropdownList, playerList.map(player => {
        if ( player.playerId ) return {key: player.playerId, value: player.playerName, class: "dropdown-grp-item", preventSelection: false};
        else return {key: player.player_id, value: player.player_name, class: "dropdown-grp-item"};
      }));
    }

    return dropdownList;
  }

  private formatPlayerData(playerId: string, data: { [seasonId: string]: any }):{ [seasonId: string]: SeasonStats } {
    var stats: { [seasonId: string]: SeasonStats } = {};
    for ( var seasonId in data ) {
      var seasonData = data[seasonId]; //
      var seasonStats = new SeasonStats();
      var isValidStats = false;

      for ( var key in seasonData ) {
        var value = seasonData[key];
        if ( key == "isCurrentSeason" ) {
          seasonStats.isCurrentSeason = value;
        }
        else if ( value != null ) {
          if ( value["statHigh"] != null ) {
            isValidStats = true;
          }
          seasonStats[key] = value[playerId] != null ? Number(value[playerId]) : null;
        }
        else {
          seasonStats[key] = null;
        }
      }
      if ( isValidStats ) {
        stats[seasonId] = seasonStats;
      }
    }
    return stats;
  }

  private createComparisonBars(data: ComparisonStatsData): ComparisonBarList {
    var fields = data.playerOne.position[0].charAt(0) == "P" ? this.pitchingFields : this.battingFields;
    var colors = Gradient.getColorPair(data.playerOne.teamColors, data.playerTwo.teamColors);
    data.playerOne.mainTeamColor = colors[0];
    data.playerTwo.mainTeamColor = colors[1];

    var bars: ComparisonBarList = {};
    for ( var seasonId in data.bestStatistics ) {
      var bestStats = data.bestStatistics[seasonId];
      var worstStats = data.worstStatistics[seasonId];
      var playerOneStats = data.playerOne.statistics[seasonId];
      var playerTwoStats = data.playerTwo.statistics[seasonId];
      var seasonBarList = [];

      for ( var i = 0; i < fields.length; i++ ) {
        var key = fields[i];
        var title = ComparisonStatsService.getKeyDisplayTitle(key);
        seasonBarList.push({
          title: title,
          data: [{
            value: playerOneStats != null ? this.getNumericValue(key, playerOneStats[key]) : null,
            // color: data.playerOne.mainTeamColor
            color: '#BC1624'
          },
          {
            value: playerTwoStats != null ? this.getNumericValue(key, playerTwoStats[key]) : null,
            // color: data.playerTwo.mainTeamColor,
            color: '#444444'
          }],
          minValue: worstStats != null ? this.getNumericValue(key, worstStats[key]) : null,
          maxValue: bestStats != null ? this.getNumericValue(key, bestStats[key]) : null,
          qualifierLabel: SeasonStatsService.getQualifierLabel(key)
        });
      }

      bars[seasonId] = seasonBarList;
    }
    return bars;
  }

  static getKeyDisplayTitle(key: string): string {
    switch (key) {
      case "batHomeRuns": return "Home Runs";
      case "batAverage": return "Batting Average";
      case "batRbi": return "RBIs";
      case "batSluggingPercentage": return "Slugging Percentage";
      case "batHits": return "Hits";
      case "batBasesOnBalls": return "Walks";
      case "batOnBasePercentage": return "On Base Percentage";
      case "batDoubles": return "Doubles";
      case "batTriples": return "Triples";
      case "pitchEra": return "Earned Run Average";
      case "pitchWins": return "Wins";
      case "pitchLosses": return "Losses";
      case "pitchStrikeouts": return "Strikeouts";
      case "pitchInningsPitched": return "Innings Pitched";
      case "pitchBasesOnBalls": return "Walks Thrown";
      case "pitchWhip": return "WHIP";
      case "pitchSaves": return "Saves";
      case "pitchIpa": return "IPA";
      case "pitchHits": return "Hits Against Pitcher";
      case "pitchEarnedRuns": return "Earned Runs Against Pitcher";
      case "pitchHomeRunsAllowed": return "Home Runs Against Pitcher";
      default: return null;
    }
  }

  private getNumericValue(key: string, value: string): number {
    if ( value == null ) return null;

    var num = Number(value);
    switch (key) {
      case "batAverage": return Number(num.toFixed(3));
      case "batOnBasePercentage": return Number(num.toFixed(3));
      case "pitchEra": return Number(num.toFixed(2));
      default: return num;
    }
  }
}
