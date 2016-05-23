import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';
import {MLBPageParameters} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';

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
    
    console.log("getting player stats: " + url);
    return this.http.get(url)
      .map(res => res.json())
      .map(data => {
        return this.formatData(data.data);
      });
    // return Observable.of(this.formatData(this.sampleData.data, seasonId));
  }

  getTeamList(): Observable<Array<{key: string, value: string}>> {
    //http://dev-homerunloyal-api.synapsys.us/team/comparisonTeamList
    /*
    teamItem {
      teamId: string;
      teamFirstName: string;
      teamLastName: string;
      teamLogo: string;
    }
    */
    let url = this._apiUrl + "/team/comparisonTeamList";
    console.log("getting team list: " + url);
    return this.http.get(url)
      .map(res => res.json())
      .map(data => {
        return this.formatTeamList(data.data);;
    });
  }
  
  private formatTeamList(teamList) {
    return teamList.map(team => {
      var teamName = team.teamFIrstName + " " + team.teamLastName;
      return {key: team.teamId, value: teamName};
    });
  }
  
  //TODO-CJP: figure out if pitcher or not
  private formatData(data: ComparisonStatsData): ComparisonStatsData {    
    var bars: { [year: string]: Array<ComparisonBarInput> } = {};
    
    for ( var seasonId in data.data ) {
      var seasonStatData = data.data[seasonId];
      var seasonBarList = [];
      
      for ( var i = 0; i < this.battingFields.length; i++ ) {
        var key = this.battingFields[i];
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
            color: data.playerOne.teamColors[0]
          }, 
          {
            value: dataPoint[data.playerTwo.playerId],
            color: data.playerTwo.teamColors[0]
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

  sampleData = {
    "success": true,
    "message": "",
    "data": {
      "playerOne": {
        "playerName": "Eric Hosmer",
        "playerId": 94939,
        "playerHeadshot": "/mlb/players/headshots/09afb2db-7a56-48c6-bd9a-34f52ca9a554.jpg",
        "teamLogo": "/mlb/logos/team/MLB_Kansas_City_Royals_Logo.jpg",
        "teamName": "Kansas City Royals",
        "teamId": 2806,
        "teamColors": ["#004687", "#C09A5B"],
        "uniformNumber": 35,
        "position": "3",
        "height": "6-4",
        "weight": 225,
        "age": 26,
        "yearsExperience": 1
      },
      "playerTwo": {
        "playerName": "Brock Holt",
        "playerId": 95131,
        "playerHeadshot": "/mlb/players/headshots/c27ca19d-50c7-4214-83a6-df763128c64d.jpg",
        "teamLogo": "/mlb/logos/team/MLB_Boston_Red_Sox_Logo.jpg",
        "teamName": "Boston Red Sox",
        "teamId": 2791,
        "teamColors": ["#BD3039","#0D2B56"],
        "uniformNumber": 12,
        "position": "7,8,9,3,4,5,6",
        "height": "5-10",
        "weight": 180,
        "age": 27,
        "yearsExperience": 1
      },
      "data": {
        "2011": {
          "isCurrentSeason": false,
          "batHomeRuns": {
            "94939": 19
          },
          "batAverage": {
            "94939": ".291"
          },
          "batRbi": {
            "94939": 77
          },
          "batSluggingPercentage": {
            "94939": ".461"
          },
          "batHits": {
            "94939": 151
          },
          "batBasesOnBalls": {
            "94939": 34
          },
          "batOnBasePercentage": {
            "94939": ".340"
          },
          "batDoubles": {
            "94939": 27
          },
          "batTriples": {
            "94939": 2
          },
          "pitchEra": {
            "94939": null
          },
          "pitchWins": {
            "94939": null
          },
          "pitchLosses": {
            "94939": null
          },
          "pitchStrikeouts": {
            "94939": null
          },
          "pitchInningsPitched": {
            "94939": null
          },
          "pitchBasesOnBalls": {
            "94939": null
          },
          "pitchWhip": {
            "94939": null
          },
          "pitchSaves": {
            "94939": null
          },
          "pitchIpa": {
            "94939": null
          },
          "pitchHits": {
            "94939": null
          },
          "pitchEarnedRuns": {
            "94939": null
          },
          "pitchHomeRunsAllowed": {
            "94939": null
          }
        },
        "2012": {
          "isCurrentSeason": false,
          "batHomeRuns": {
            "94939": 14,
            "95131": 0
          },
          "batAverage": {
            "94939": ".232",
            "95131": ".292"
          },
          "batRbi": {
            "94939": 60,
            "95131": 3
          },
          "batSluggingPercentage": {
            "94939": ".359",
            "95131": ".354"
          },
          "batHits": {
            "94939": 124,
            "95131": 19
          },
          "batBasesOnBalls": {
            "94939": 56,
            "95131": 4
          },
          "batOnBasePercentage": {
            "94939": ".309",
            "95131": ".343"
          },
          "batDoubles": {
            "94939": 22,
            "95131": 2
          },
          "batTriples": {
            "94939": 2,
            "95131": 1
          },
          "pitchEra": {
            "94939": null,
            "95131": null
          },
          "pitchWins": {
            "94939": null,
            "95131": null
          },
          "pitchLosses": {
            "94939": null,
            "95131": null
          },
          "pitchStrikeouts": {
            "94939": null,
            "95131": null
          },
          "pitchInningsPitched": {
            "94939": null,
            "95131": null
          },
          "pitchBasesOnBalls": {
            "94939": null,
            "95131": null
          },
          "pitchWhip": {
            "94939": null,
            "95131": null
          },
          "pitchSaves": {
            "94939": null,
            "95131": null
          },
          "pitchIpa": {
            "94939": null,
            "95131": null
          },
          "pitchHits": {
            "94939": null,
            "95131": null
          },
          "pitchEarnedRuns": {
            "94939": null,
            "95131": null
          },
          "pitchHomeRunsAllowed": {
            "94939": null,
            "95131": null
          }
        },
        "2013": {
          "isCurrentSeason": false,
          "batHomeRuns": {
            "94939": 17,
            "95131": 0,
            "statHigh": 53
          },
          "batAverage": {
            "94939": ".301",
            "95131": ".203",
            "statHigh": ".342"
          },
          "batRbi": {
            "94939": 78,
            "95131": 11,
            "statHigh": 144
          },
          "batSluggingPercentage": {
            "94939": ".444",
            "95131": ".237",
            "statHigh": ".634"
          },
          "batHits": {
            "94939": 186,
            "95131": 12,
            "statHigh": 211
          },
          "batBasesOnBalls": {
            "94939": 51,
            "95131": 7,
            "statHigh": 135
          },
          "batOnBasePercentage": {
            "94939": ".357",
            "95131": ".319",
            "statHigh": ".436"
          },
          "batDoubles": {
            "94939": 34,
            "95131": 2,
            "statHigh": 56
          },
          "batTriples": {
            "94939": 2,
            "95131": 0,
            "statHigh": 11
          },
          "pitchEra": {
            "94939": null,
            "95131": null,
            "statHigh": 1.94595
          },
          "pitchWins": {
            "94939": null,
            "95131": null,
            "statHigh": 23
          },
          "pitchLosses": {
            "94939": null,
            "95131": null,
            "statHigh": 4
          },
          "pitchStrikeouts": {
            "94939": null,
            "95131": null,
            "statHigh": 277
          },
          "pitchInningsPitched": {
            "94939": null,
            "95131": null,
            "statHigh": 276.2
          },
          "pitchBasesOnBalls": {
            "94939": null,
            "95131": null,
            "statHigh": 29
          },
          "pitchWhip": {
            "94939": null,
            "95131": null,
            "statHigh": 0.932
          },
          "pitchSaves": {
            "94939": null,
            "95131": null,
            "statHigh": 51
          },
          "pitchIpa": {
            "94939": null,
            "95131": null,
            "statHigh": 7.137
          },
          "pitchHits": {
            "94939": null,
            "95131": null,
            "statHigh": 111
          },
          "pitchEarnedRuns": {
            "94939": null,
            "95131": null,
            "statHigh": 42
          },
          "pitchHomeRunsAllowed": {
            "94939": null,
            "95131": null,
            "statHigh": 7
          }
        },
        "2014": {
          "isCurrentSeason": false,
          "batHomeRuns": {
            "94939": 11,
            "95131": 4,
            "statHigh": 42
          },
          "batAverage": {
            "94939": ".279",
            "95131": ".281",
            "statHigh": ".341"
          },
          "batRbi": {
            "94939": 70,
            "95131": 29,
            "statHigh": 119
          },
          "batSluggingPercentage": {
            "94939": ".412",
            "95131": ".381",
            "statHigh": ".581"
          },
          "batHits": {
            "94939": 156,
            "95131": 126,
            "statHigh": 225
          },
          "batBasesOnBalls": {
            "94939": 44,
            "95131": 33,
            "statHigh": 113
          },
          "batOnBasePercentage": {
            "94939": ".336",
            "95131": ".333",
            "statHigh": ".410"
          },
          "batDoubles": {
            "94939": 38,
            "95131": 23,
            "statHigh": 53
          },
          "batTriples": {
            "94939": 2,
            "95131": 5,
            "statHigh": 12
          },
          "pitchEra": {
            "94939": null,
            "95131": null,
            "statHigh": 2.1327
          },
          "pitchWins": {
            "94939": null,
            "95131": null,
            "statHigh": 22
          },
          "pitchLosses": {
            "94939": null,
            "95131": null,
            "statHigh": 4
          },
          "pitchStrikeouts": {
            "94939": null,
            "95131": null,
            "statHigh": 277
          },
          "pitchInningsPitched": {
            "94939": null,
            "95131": null,
            "statHigh": 269
          },
          "pitchBasesOnBalls": {
            "94939": null,
            "95131": null,
            "statHigh": 16
          },
          "pitchWhip": {
            "94939": null,
            "95131": null,
            "statHigh": 0.876
          },
          "pitchSaves": {
            "94939": null,
            "95131": null,
            "statHigh": 53
          },
          "pitchIpa": {
            "94939": null,
            "95131": null,
            "statHigh": 7.317
          },
          "pitchHits": {
            "94939": null,
            "95131": null,
            "statHigh": 124
          },
          "pitchEarnedRuns": {
            "94939": null,
            "95131": null,
            "statHigh": 42
          },
          "pitchHomeRunsAllowed": {
            "94939": null,
            "95131": null,
            "statHigh": 5
          }
        },
        "2015": {
          "isCurrentSeason": false,
          "batHomeRuns": {
            "94939": 19,
            "95131": 2,
            "statHigh": 47
          },
          "batAverage": {
            "94939": ".289",
            "95131": ".282",
            "statHigh": ".338"
          },
          "batRbi": {
            "94939": 110,
            "95131": 44,
            "statHigh": 131
          },
          "batSluggingPercentage": {
            "94939": ".442",
            "95131": ".382",
            "statHigh": ".649"
          },
          "batHits": {
            "94939": 192,
            "95131": 127,
            "statHigh": 205
          },
          "batBasesOnBalls": {
            "94939": 64,
            "95131": 45,
            "statHigh": 143
          },
          "batOnBasePercentage": {
            "94939": ".355",
            "95131": ".348",
            "statHigh": ".459"
          },
          "batDoubles": {
            "94939": 35,
            "95131": 27,
            "statHigh": 45
          },
          "batTriples": {
            "94939": 5,
            "95131": 6,
            "statHigh": 15
          },
          "pitchEra": {
            "94939": null,
            "95131": null,
            "statHigh": 1.75176
          },
          "pitchWins": {
            "94939": null,
            "95131": null,
            "statHigh": 24
          },
          "pitchLosses": {
            "94939": null,
            "95131": null,
            "statHigh": 4
          },
          "pitchStrikeouts": {
            "94939": null,
            "95131": null,
            "statHigh": 320
          },
          "pitchInningsPitched": {
            "94939": null,
            "95131": null,
            "statHigh": 248.2
          },
          "pitchBasesOnBalls": {
            "94939": null,
            "95131": null,
            "statHigh": 28
          },
          "pitchWhip": {
            "94939": null,
            "95131": null,
            "statHigh": 0.847
          },
          "pitchSaves": {
            "94939": null,
            "95131": null,
            "statHigh": 50
          },
          "pitchIpa": {
            "94939": null,
            "95131": null,
            "statHigh": 6.944
          },
          "pitchHits": {
            "94939": null,
            "95131": null,
            "statHigh": 141
          },
          "pitchEarnedRuns": {
            "94939": null,
            "95131": null,
            "statHigh": 46
          },
          "pitchHomeRunsAllowed": {
            "94939": null,
            "95131": null,
            "statHigh": 8
          }
        },
        "2016": {
          "isCurrentSeason": true,
          "batHomeRuns": {
            "94939": 6,
            "95131": 3,
            "statHigh": 13
          },
          "batAverage": {
            "94939": ".336",
            "95131": ".260",
            "statHigh": ".400"
          },
          "batRbi": {
            "94939": 17,
            "95131": 19,
            "statHigh": 34
          },
          "batSluggingPercentage": {
            "94939": ".536",
            "95131": ".385",
            "statHigh": ".658"
          },
          "batHits": {
            "94939": 47,
            "95131": 27,
            "statHigh": 56
          },
          "batBasesOnBalls": {
            "94939": 13,
            "95131": 12,
            "statHigh": 41
          },
          "batOnBasePercentage": {
            "94939": ".392",
            "95131": ".350",
            "statHigh": ".468"
          },
          "batDoubles": {
            "94939": 8,
            "95131": 4,
            "statHigh": 17
          },
          "batTriples": {
            "94939": 1,
            "95131": 0,
            "statHigh": 4
          },
          "pitchEra": {
            "94939": null,
            "95131": null,
            "statHigh": 1.2857
          },
          "pitchWins": {
            "94939": null,
            "95131": null,
            "statHigh": 8
          },
          "pitchLosses": {
            "94939": null,
            "95131": null,
            "statHigh": 0
          },
          "pitchStrikeouts": {
            "94939": null,
            "95131": null,
            "statHigh": 77
          },
          "pitchInningsPitched": {
            "94939": null,
            "95131": null,
            "statHigh": 62
          },
          "pitchBasesOnBalls": {
            "94939": null,
            "95131": null,
            "statHigh": 4
          },
          "pitchWhip": {
            "94939": null,
            "95131": null
          },
          "pitchSaves": {
            "94939": null,
            "95131": null,
            "statHigh": 14
          },
          "pitchIpa": {
            "94939": null,
            "95131": null
          },
          "pitchHits": {
            "94939": null,
            "95131": null,
            "statHigh": 22
          },
          "pitchEarnedRuns": {
            "94939": null,
            "95131": null,
            "statHigh": 8
          },
          "pitchHomeRunsAllowed": {
            "94939": null,
            "95131": null,
            "statHigh": 1
          }
        },
        "careerStats": {
          "batHits": {
            "94939": 826,
            "95131": 311
          },
          "batAverage": {
            "94939": 0.282586,
            "95131": 0.274978
          },
          "batRunsScored": {
            "94939": 388,
            "95131": 156
          },
          "batRbi": {
            "94939": 385,
            "95131": 107
          },
          "batAtBats": {
            "94939": 2923,
            "95131": 1131
          },
          "batTotalBases": {
            "94939": 1264,
            "95131": 420
          },
          "batSluggingPercentage": {
            "94939": 0.432432,
            "95131": 0.371353
          },
          "batBasesOnBalls": {
            "94939": 250,
            "95131": 102
          },
          "batStrikeouts": {
            "94939": 505,
            "95131": 232
          },
          "batDoubles": {
            "94939": 159,
            "95131": 58
          },
          "batTriples": {
            "94939": 15,
            "95131": 12
          },
          "batHomeRuns": {
            "94939": 83,
            "95131": 9
          },
          "batOnBasePercentage": {
            "94939": 0.339111,
            "95131": 0.334955
          },
          "batStolenBases": {
            "94939": 52,
            "95131": 23
          },
          "batStolenBasesCaught": {
            "94939": 16,
            "95131": 3
          },
          "batOnBasePlusSlugging": {
            "94939": 0.771544,
            "95131": 0.706308
          },
          "batPlateAppearances": {
            "94939": 3206,
            "95131": 1251
          },
          "errors": {
            "94939": 41,
            "95131": 23
          },
          "assists": {
            "94939": null,
            "95131": null
          },
          "putouts": {
            "94939": null,
            "95131": null
          },
          "doublePlays": {
            "94939": null,
            "95131": null
          },
          "triplePlays": {
            "94939": null,
            "95131": null
          },
          "eventsPlayed": {
            "94939": 765,
            "95131": 317
          },
          "pitchEventsStarted": {
            "94939": null,
            "95131": null
          },
          "pitchRunsAllowed": {
            "94939": null,
            "95131": null
          },
          "pitchBasesOnBalls": {
            "94939": null,
            "95131": null
          },
          "pitchInningsPitched": {
            "94939": null,
            "95131": null
          },
          "pitchStrikeouts": {
            "94939": null,
            "95131": null
          },
          "pitchEra": {
            "94939": null,
            "95131": null
          },
          "pitchWins": {
            "94939": null,
            "95131": null
          },
          "pitchLosses": {
            "94939": null,
            "95131": null
          },
          "pitchSaves": {
            "94939": null,
            "95131": null
          },
          "pitchShutouts": {
            "94939": null,
            "95131": null
          },
          "pitchGamesComplete": {
            "94939": null,
            "95131": null
          },
          "pitchHomeRunsAllowed": {
            "94939": null,
            "95131": null
          },
          "pitchHits": {
            "94939": null,
            "95131": null
          },
          "pitchEarnedRuns": {
            "94939": null,
            "95131": null
          },
          "pitchWildPitch": {
            "94939": null,
            "95131": null
          }
        }
      }
    }
  }
}