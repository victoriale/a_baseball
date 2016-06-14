import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';

import {GlobalFunctions} from "../global/global-functions";
import {GlobalSettings} from "../global/global-settings";

export interface DailyUpdateData {
  type: string;
  lastUpdateDate: string;
  chart: DailyUpdateChart;
  fullBackgroundImageUrl: string;
  seasonStats: Array<{name: string, value: string, icon: string}>
}

export interface DailyUpdateChart {
  categories: Array<string>;  
  dataSeries: Array<{name: string, values: Array<any>}>;
}

interface DataSeries {
  name: string,
  key: string
}

interface APIDailyUpdateData {
  lastUpdatedDate: string;
  backgroundImage: string,
  pitcher: boolean;
  seasonStats: Array<any>,
  recentGames: Array<APIGameData>
}

interface APIGameData {
  eventId: string,
  startDateTime: string,
  siteId: string,
  teamId: string,
  teamName: string,
  teamRuns: string,
  opponentTeamId: string,
  opponentTeamName: string,
  opponentRuns: string,
  startDateTimestamp: number;
}

@Injectable()
export class DailyUpdateService {  
  constructor(public http: Http){}

  getTeamDailyUpdate(teamId: number): Observable<DailyUpdateData> {
    //http://dev-homerunloyal-api.synapsys.us/team/dailyUpdate/2800
    let url = GlobalSettings.getApiUrl() + '/team/dailyUpdate/' + teamId;

    return this.http.get(url)
        .map(res => res.json())
        .map(data => this.formatTeamData(data.data, teamId));
  }
  
  private formatTeamData(data: APIDailyUpdateData, teamId: number): DailyUpdateData {
    if ( !data ) {
      throw new Error("Error! Data is null from Team Daily Update API");
    }

    //Setting up season stats
    var stats = [];
    if ( data.seasonStats && data.seasonStats.length > 0 ) {
      var apiSeasonStats = data.seasonStats[0];
      var record = "N/A";
      if ( apiSeasonStats.totalWins != null && apiSeasonStats.totalLosses != null ) {
        record = apiSeasonStats.totalWins + "-" + apiSeasonStats.totalLosses;
      }
      stats = [
        { 
          name: "Win Loss Record", 
          value: record,
          icon: "fa-trophy" 
        },
        { 
          name: "Hits", 
          value: apiSeasonStats.batHits != null ? apiSeasonStats.batHits : "N/A", //TODO: get hits from API
          icon: "fa-home" //TODO: use 'baseball and bat' icon 
        },
        { 
          name: "Earned Runs Average", 
          value: apiSeasonStats.pitchEra != null ? Number(apiSeasonStats.pitchEra).toFixed(2) + "%" : "N/A",
          icon: "fa-home" //TODO: use 'batter swinging' icon 
        },
        { 
          name: "Runs Batted In", 
          value: apiSeasonStats.batRbi != null ? Number(apiSeasonStats.batRbi) : "N/A",
          icon: "fa-home" //TODO: get 'batter standing' icon 
        }
      ]
    }

    //Setting up chart info
    var seriesOne = {
        name: "Runs For",
        key: "teamRuns"
    };
    var seriesTwo = {
        name: "Runs Against",
        key: "opponentRuns"
    };
    var chart:DailyUpdateChart = this.getChart(data, seriesOne, seriesTwo);

    return {
      lastUpdateDate: data.lastUpdatedDate ? GlobalFunctions.formatUpdatedDate(data.lastUpdatedDate) : "",
      fullBackgroundImageUrl: GlobalSettings.getImageUrl(data.backgroundImage),
      type: "Team",
      seasonStats: stats,
      chart: chart
    };
  }
  

  getPlayerDailyUpdate(playerId: number): Observable<DailyUpdateData> {
    //http://dev-homerunloyal-api.synapsys.us/player/dailyUpdate/2800
    let url = GlobalSettings.getApiUrl() + '/player/dailyUpdate/' + playerId;

    return this.http.get(url)
        .map(res => res.json())
        .map(data => this.formatPlayerData(data.data, playerId));
  }
  
  private formatPlayerData(data: APIDailyUpdateData, playerId: number): DailyUpdateData {
    if ( !data ) {
      throw new Error("Error! Data is null from Player Daily Update API");
    }
    //Setting up season stats
    var stats = [];
    if ( data.seasonStats && data.seasonStats.length > 0 ) {
      var apiSeasonStats = data.seasonStats[0];
      stats = data.pitcher ? this.getPitcherStats(apiSeasonStats) : this.getBatterStats(apiSeasonStats);
    }

    //Setting up chart info
    var seriesOne;
    var seriesTwo;
    if ( data.pitcher ) {
      seriesOne = {
        name: "Earned Runs",
        key: "pitchEarnedRuns"
      };
      seriesTwo = {
        name: "Hits",
        key: "pitchHits"
      };
    }
    else {
      seriesOne = {
        name: "Runs",
        key: "batRunsScored"
      };
      seriesTwo = {
        name: "Hits",
        key: "batHits"
      };
    }
    var chart:DailyUpdateChart = this.getChart(data, seriesOne, seriesTwo);

    return {
      lastUpdateDate: data.lastUpdatedDate ? GlobalFunctions.formatUpdatedDate(data.lastUpdatedDate) : "",
      fullBackgroundImageUrl: GlobalSettings.getImageUrl(data.backgroundImage),
      type: "Player",
      seasonStats: stats,
      chart: chart
    };
  }

  private getPitcherStats(apiSeasonStats) {    
    var record = "N/A";
    if ( apiSeasonStats.pitchWins != null && apiSeasonStats.pitchLosses != null ) {
      record = apiSeasonStats.pitchWins + "-" + apiSeasonStats.pitchLosses;
    }

    return [
        { 
          name: "Win Loss Record", 
          value: record,
          icon: "fa-trophy"
        },
        { 
          name: "Innings Pitched", 
          value: apiSeasonStats.pitchInningsPitched != null ? apiSeasonStats.pitchInningsPitched : "N/A",
          icon: "fa-home" //TODO: get 'baseball field' icon
        },
        { 
          name: "Strike Outs", 
          value: apiSeasonStats.pitchStrikeouts != null ? apiSeasonStats.pitchStrikeouts : "N/A",
          icon: "fa-home" //TODO: get '2 baseball bats' icon
        },
        { 
          name: "Earned Runs Average", 
          value: apiSeasonStats.pitchEra != null ? Number(apiSeasonStats.pitchEra).toFixed(2) : "N/A",
          icon: "fa-home" //TODO: use 'batter swinging' icon 
        }
      ]
  }

  private getBatterStats(apiSeasonStats) {
    var batOnBasePercentage = "N/A";
    if ( apiSeasonStats.batOnBasePercentage != null ) {
      var value = Number(apiSeasonStats.batOnBasePercentage) * 100; 
      batOnBasePercentage = value.toFixed(0) + "%";
    }
    
    var batAverage = "N/A";
    if ( apiSeasonStats.batOnBasePercentage != null ) {
      var value = Number(apiSeasonStats.batAverage) * 100; 
      batAverage = value.toFixed(0) + "%";
    }

    return [
        { 
          name: "Home Runs", 
          value: apiSeasonStats.batHomeRuns != null ? apiSeasonStats.batHomeRuns : "N/A",
          icon: "fa-home" //TODO: get 'homeplate' icon 
        },
        { 
          name: "Batting Average", 
          value: batAverage,
          icon: "fa-home" //TODO: get 'baseball and bat' icon 
        },
        { 
          name: "Runs Batted In", 
          value: apiSeasonStats.batRbi != null ? apiSeasonStats.batRbi : "N/A",
          icon: "fa-home" //TODO: get 'batter standing' icon 
        },
        { 
          name: "On Base Percentage", 
          value: batOnBasePercentage,
          icon: "fa-percent" 
        }
      ]
  }

  private getChart(data: APIDailyUpdateData, seriesOne: DataSeries, seriesTwo: DataSeries) {
    var chart:DailyUpdateChart = {
        categories: [],
        dataSeries: [{
          name: seriesOne.name,
          values: []
        },
        {
          name: seriesTwo.name,
          values: []
        }]
    };
    if ( data.recentGames ) {
      data.recentGames.forEach((item, index) => {
        chart.categories.push("vs " + item.opponentTeamName); //TODO: Should this link to the team?

        //TODO: What to do about null values?
        chart.dataSeries[0].values.push(item[seriesOne.key] != null ? Number(item[seriesOne.key]) : null);
        chart.dataSeries[1].values.push(item[seriesTwo.key] != null ? Number(item[seriesTwo.key]) : null);
      });

      for ( var i = chart.dataSeries[0].values.length; i < 4; i++ ) {
        chart.categories.push("N/A");
        chart.dataSeries[0].values.push(null);
        chart.dataSeries[1].values.push(null);
      }
    } 
    return chart;
  }
}