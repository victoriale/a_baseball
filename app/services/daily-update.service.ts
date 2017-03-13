import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';

import {GlobalFunctions} from "../global/global-functions";
import {GlobalSettings} from "../global/global-settings";
import { MLBGlobalFunctions} from "../global/mlb-global-functions";

export interface DailyUpdateData {
  hasError: boolean;
  type: string;
  wrapperStyle: any;
  lastUpdateDate: string;
  chart: DailyUpdateChart;
  fullBackgroundImageUrl: string;
  seasonStats: Array<{name: string, value: string, icon: string}>;
  postGameArticle?: PostGameArticleData;
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
  lastUpdated: string;
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

interface PostGameArticleData {
  eventId: string,
  teamId: string,
  url?: Object,
  pubDate: string,
  headline: string,
  text: Array<any>,
  img: string
}

@Injectable()
export class DailyUpdateService {
  postGameArticleData: PostGameArticleData;

  constructor(public http: Http){}

  getErrorData(): DailyUpdateData {
    return {
      hasError: true,
      type: "",
      wrapperStyle: {},
      lastUpdateDate: "",
      chart: null,
      fullBackgroundImageUrl: "",
      seasonStats: []
    };
  }

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
          icon: "fa-batt-and-ball" //TODO: use 'baseball and bat' icon
        },
        {
          name: "Earned Runs Average",
          value: apiSeasonStats.pitchEra != null ? Number(apiSeasonStats.pitchEra).toFixed(2) : "N/A",
          icon: "fa-batter" //TODO: use 'batter swinging' icon
        },
        {
          name: "Runs Batted In",
          value: apiSeasonStats.batRbi != null ? Number(apiSeasonStats.batRbi) : "N/A",
          icon: "fa-batter-alt" //TODO: get 'batter standing' icon
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
    this.getPostGameArticle(data,'team');

    if ( chart ) {
        return {
          hasError: false,
          lastUpdateDate: data.lastUpdated ? GlobalFunctions.formatUpdatedDate(data.lastUpdated) : "",
          fullBackgroundImageUrl: GlobalSettings.getBackgroundImageUrl(data.backgroundImage, GlobalSettings._imgProfileMod),
          type: "Team",
          wrapperStyle: {},
          seasonStats: stats,
          chart: chart,
          postGameArticle: this.postGameArticleData
        };
    }
    else {
      return null;
    }
  }


  getPlayerDailyUpdate(playerId: number): Observable<DailyUpdateData> {
    //http://dev-homerunloyal-api.synapsys.us/player/dailyUpdate/2800
    let url = GlobalSettings.getApiUrl() + '/player/dailyUpdate/' + playerId;

   //console.log("getting daily update for player " + playerId + ": " + url);
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
    this.getPostGameArticle(data,'player');

    if(this.postGameArticleData.text && this.postGameArticleData.text.length>0){
      let tempText = this.postGameArticleData.text.join(" ");
      this.postGameArticleData.text = [tempText];
    }

    if ( chart ) {
      return {
        hasError: false,
        lastUpdateDate: data.lastUpdated ? GlobalFunctions.formatUpdatedDate(data.lastUpdated) : "",
        fullBackgroundImageUrl: GlobalSettings.getBackgroundImageUrl(data.backgroundImage, GlobalSettings._imgProfileMod),
        type: "Player",
        wrapperStyle: {'padding-bottom': '10px'},
        seasonStats: stats,
        chart: chart,
        postGameArticle: this.postGameArticleData
      };
    }
    else {
      return null;
    }
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
          icon: "fa-baseball-diamond" //TODO: get 'baseball field' icon
        },
        {
          name: "Strike Outs",
          value: apiSeasonStats.pitchStrikeouts != null ? apiSeasonStats.pitchStrikeouts : "N/A",
          icon: "fa-baseball-crest" //TODO: get '2 baseball bats' icon
        },
        {
          name: "Earned Runs Average",
          value: apiSeasonStats.pitchEra != null ? Number(apiSeasonStats.pitchEra).toFixed(2) : "N/A",
          icon: "fa-batter" //TODO: use 'batter swinging' icon
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
          icon: "fa-base-lg" //TODO: get 'homeplate' icon
        },
        {
          name: "Batting Average",
          value: batAverage,
          icon: "fa-batt-and-ball" //TODO: get 'baseball and bat' icon
        },
        {
          name: "Runs Batted In",
          value: apiSeasonStats.batRbi != null ? apiSeasonStats.batRbi : "N/A",
          icon: "fa-batter-alt" //TODO: get 'batter standing' icon
        },
        {
          name: "On Base Percentage",
          value: batOnBasePercentage,
          icon: "fa-percentage-alt"
        }
      ]
  }
  private getPostGameArticle(data: APIDailyUpdateData,type?:string) {
    let articleData = {};
    var postGameReport = data['postgame-report']['article'];

    articleData['eventId'] = postGameReport.event_id != null ? postGameReport.event_id : null;
    articleData['teamId'] = postGameReport.team_id != null ? postGameReport.team_id : null;
    articleData['playerId'] = postGameReport.player_id != null ? postGameReport.player_id : null;
    articleData['url'] = articleData['eventId'] != null ? ['Article-pages', {eventType: 'postgame-report', eventID: articleData['eventId']}] : ['Error-page'];
    articleData['pubDate'] = postGameReport.last_updated ? GlobalFunctions.formatGlobalDate(postGameReport.last_updated, 'timeZone') : null;
    articleData['headline'] = postGameReport.title != null ? postGameReport.title : null;
    articleData['text'] = postGameReport['teaser'] != null && postGameReport['teaser'].length > 0 ? [postGameReport['teaser']] : null;
    articleData['img'] = postGameReport['image_url'] != null ? MLBGlobalFunctions.getBackroundImageUrlWithStockFallback(postGameReport['image_url'], GlobalSettings._imgMdLogo) : null;
    articleData['type'] = type != null ? type : null;

    this.postGameArticleData = <PostGameArticleData>articleData;
  }

  private getChart(data: APIDailyUpdateData, seriesOne: DataSeries, seriesTwo: DataSeries) {
    if ( data.recentGames && data.recentGames.length > 0 ) { //there should be at least one game in order to show the module
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

      data.recentGames.forEach((item, index) => {
        chart.categories.push("vs " + item.opponentTeamName); //TODO: Should this link to the team?

        chart.dataSeries[0].values.push(item[seriesOne.key] != null ? Number(item[seriesOne.key]) : null);
        chart.dataSeries[1].values.push(item[seriesTwo.key] != null ? Number(item[seriesTwo.key]) : null);
      });
      return chart;
    }
    else {
      return null;
    }
  }
}
