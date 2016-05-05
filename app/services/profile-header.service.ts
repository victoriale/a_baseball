import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';

import {DataItem, ProfileHeaderData} from '../modules/profile-header/profile-header.module';

export interface PlayerProfileInfo {
    profileImage: string; //NEED
    backgroundImage: string; //NEED
    yearsPlayed: number; //NEED
    
    teamId: number;
    teamName: string;
    playerId: number;
    playerName: string;
    playerFirstName: string;
    playerLastName: string;
    roleStatus: string; //??
    active: string;
    uniformNumber: number;
    position: string;
    depth: string; // 'starter'
    height: string;
    weight: number;
    birthDate: string;
    city: string;
    area: string;
    country: string;
    heightInInches: number;
    age: number;
    salary: string; // or number??
    personKey: number;
    pub1PlayerId: number;
    pub1TeamId: number;
    pub2Id: number;
    pub2TeamId: number;  
}

export interface PlayerProfileStats {
  //Pitcher stats
    eventsStarted: number;
    runsAllowed: number;
    inningsPitched: number;
    era: number;
    wins: number;
    losses: number;
    saves: number;
    shutouts: number;
    gamesComplete: number;
    homeRunsAllowed: number;
    earnedRuns:  number;
    wildPitch:  number;
  //Batter stats
    average: string;
    runsScored: number;
    rbi: number;
    atBats: number;
    totalBases: number;
    sluggingPercentage: number;
    doubles: number;
    triples: number;
    homeRuns: number;
    onBasePercentage: number;
    stolenBases: number;
    stolenBasesCaught: number;
    onBasePlusSlugging: number;
    plateAppearances: number;
  //Both stats
    hits: number;
    basesOnBalls: number;
    strikeouts: number;
}

export interface PlayerProfileHeaderData {
  lastUpdated: Date; //NEED   
  info: PlayerProfileInfo;
  stats: PlayerProfileStats;
}

@Injectable()
export class ProfileHeaderService {
  private _apiUrl: string = 'http://dev-homerunloyal-api.synapsys.us';

  constructor(public http: Http){}

  getPlayerProfile(playerId: number): Observable<ProfileHeaderData> {
    let url = this._apiUrl + '/player/profileHeader/' + playerId;
    return this.http.get(url)
        .map(res => res.json())
        .map(data => this.convertToPlayerProfileHeader(data.data));
  }
  
  private convertToPlayerProfileHeader(data: PlayerProfileHeaderData): ProfileHeaderData {
    // [Player Name] started his MLB career on [Month] [Day], [Year] for [Team Name], 
    // accumulating [##] years in the MLB.  
    // [Player Name] was born in [City], [State] on [Month] [Day], [Year] 
    // and is [##] years old, with a height of [##] and weighing in at [##]lbs.
    
    var startDateStr = "[TBA]";//TODO-CJP: get start date from api
    var description = data.info.playerName + " started his MLB career on " + startDateStr +
                      " for " + data.info.teamName + " accumulating " + data.info.yearsPlayed;
                      
    var dataPoints: Array<DataItem>;    
    
    if ( data.info.position === "P" ) {
      dataPoints = [
        {
          label: "Wins/Losses",
          labelCont: "for the current season",
          value: data.stats.wins + " - " + data.stats.losses
        },
        {
          label: "Innings Pitched",
          labelCont: "for the current season",
          value: data.stats.inningsPitched.toString()
        },
        {
          label: "Strikeouts",
          labelCont: "for the current season",
          value: data.stats.strikeouts.toString()
        },
        {
          label: "Earned Run Average",
          labelCont: "for the current season",
          value: data.stats.earnedRuns.toString()
        }
      ];      
    }
    else {
      dataPoints = [
        {
          label: "Home Runs",
          labelCont: "for the current season",
          value: data.stats.homeRuns.toString()
        },
        {
          label: "Batting Average",
          labelCont: "for the current season",
          value: data.stats.average
        },
        {
          label: "RBIs",
          labelCont: "for the current season",
          value: data.stats.rbi.toString()
        },
        {
          label: "Hits",
          labelCont: "for the current season",
          value: data.stats.hits.toString()
        }
      ];
    }
    
    var header: ProfileHeaderData = {
      profileName: data.info.playerName,
      profileImageUrl: data.info.profileImage, //TODO-CJP
      backgroundImageUrl: data.info.backgroundImage, //TODO-CJP
      profileTitleFirstPart: data.info.playerFirstName,
      profileTitleLastPart: data.info.playerLastName,
      lastUpdatedDate: data.lastUpdated,
      description: description,
      topDataPoints: [
        {
          label: "Team",
          value: data.info.teamName,
          routerLink: ["Team-page", { teamId: data.info.teamId }]          
        },
        {
          label: "Jersey Number",
          value: data.info.uniformNumber.toString()
        },
        {
          label: "Position",
          value: data.info.position
        }
      ],
      bottomDataPoints: dataPoints
    }
    return header;
  }
}