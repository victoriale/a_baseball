import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {MLBPageParameters} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Gradient} from '../global/global-gradient';

import {ComparisonBarInput} from '../components/comparison-bar/comparison-bar.component';
import {SeasonStatsModuleData} from '../modules/season-stats/season-stats.module';

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
  wins: DataPoint;
  strikeouts: DataPoint;
  era: DataPoint;
  hits: DataPoint;
  homeRuns: DataPoint;
  batAverage: DataPoint;
  rbi: DataPoint;
  basesOnBalls: DataPoint;
}
export interface SeasonStatsStatsData {
  playerInfo: PlayerData;
  // playerInfo: PlayerData;
  stats: { [year: string]: SeasonStats };
  bars: ComparisonBarList;
}
export class MLBSeasonStatsModuleData implements SeasonStatsModuleData {
    data: SeasonStatsStatsData;

    teamList: Array<{key: string, value: string}>;

    playerLists: Array<{
      teamId: string,
      playerList: Array<{key: string, value: string}>
    }>;

    constructor(private _service: SeasonStatsService) {}

    loadTeamList(listLoaded: Function) {
      if ( this.teamList == null ) {
        throw new Error("teamList has not been initialized");
      }

      if ( !this.teamList || this.teamList.length <= 2 ) {
        this._service.getTeamList().subscribe(data => {
          this.teamList = data;
          listLoaded(this.teamList);
        },
        err => {
          console.log("Error loading team list for season stats module: " + err);
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
          listLoaded(teamData.playerList);
        },
        err => {
          console.log("Error loading player list for " + newTeamId + " for the season stats module: " + err);
        })
      }
      else {
        listLoaded(teamData.playerList);
      }
    }
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
  getInitialPlayerStats(pageParams: MLBPageParameters): Observable<SeasonStatsModuleData> {
    return this.callPlayerComparisonAPI(pageParams.teamId, pageParams.playerId, data => {
      // var data = apiData.data;
      data.bars = this.formatData(data);

      var team1Data = {
        teamId: data.playerInfo.teamId,
        playerList: [{key: data.playerInfo.playerId, value: data.playerInfo.playerName}]
      };

      var team2Data = {
        teamId: data.playerInfo.teamId,
        playerList: [{key: data.playerInfo.playerId, value: data.playerInfo.playerName}]
      };

      var moduleData = new MLBSeasonStatsModuleData(this);
      moduleData.data = data;
      moduleData.teamList = [
          {key: data.playerInfo.teamId, value: data.playerInfo.teamName},
          {key: data.playerInfo.teamId, value: data.playerInfo.teamName}
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
    let url = this._apiUrl + "/player/seasonStats/";
    let teamsUrl = this._apiUrl + "/team/comparisonTeamList";

    if ( playerId ) {
      //http://dev-homerunloyal-api.synapsys.us/player/seasonStats/96652
      url += playerId;
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
  private formatTeamList(teamList) {
    return teamList.map(team => {
      var teamName = team.teamFirstName + " " + team.teamLastName;
      return {key: team.teamId, value: teamName};
    });
  }
  private formatPlayerList(playerList: TeamPlayers) {
    var list = [];
    Array.prototype.push.apply(list, this.formatPlayerPositionList("P", playerList.pitchers));
    Array.prototype.push.apply(list, this.formatPlayerPositionList("C", playerList.catchers));
    Array.prototype.push.apply(list, this.formatPlayerPositionList("F", playerList.fielders));
    Array.prototype.push.apply(list, this.formatPlayerPositionList("B", playerList.batters));
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
  private formatData(data: SeasonStatsStatsData): ComparisonBarList {
    // console.log("format data", data);
    var fields = data.playerInfo.position[0] == "P" ? this.pitchingFields : this.battingFields;

    var bars: { [year: string]: Array<ComparisonBarInput> } = {};

    data.playerInfo.mainTeamColor = "#002B5C";
    if ( Gradient.areColorsClose("#E31937", "#002B5C") ) {
        data.playerInfo.mainTeamColor = "#E31937";
    }

    for ( var seasonId in data.stats ) {
      // console.log("season id", data.stats);
      var seasonStatData = data.stats[seasonId];
      var seasonBarList = [];

      for ( var i = 0; i < fields.length; i++ ) {
        var key = fields[i];
        var dataPoint: DataPoint = seasonStatData[key];
        if ( !dataPoint ) {
          // console.log("no data point for " + key);
          break;
        }

        var title = this.getKeyDisplayTitle(key);
        if ( !title ) {
          // console.log("no title for " + title);
          break;
        }

        seasonBarList.push({
          title: title,
          data: [{
            value: dataPoint[data.playerInfo.playerId],
            color: data.playerInfo.mainTeamColor
          },
          {
            value: dataPoint[data.playerInfo.playerId],
            color: data.playerInfo.mainTeamColor
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
      case "pitchWins": return "Wins";
      case "pitchInningsPitched": return "Innings Pitched (IP)";
      case "pitchStrikeouts": return "Strikeouts (SO)";
      case "pitchEra": return "ERA";
      case "batHits": return "Hits";
      case "batHomeRuns": return "Home Runs (HR)";
      case "batAverage": return "Batting Average (BA)";
      case "batRbi": return "Runs Batted In (RBI)";
      case "pitchBasesOnBalls": return "Walks (BB)";
      default: return null;
    }
  }
}
