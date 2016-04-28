import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';

export interface TeamStandingsData {
  teamName: string,
  teamImageUrl: string,
  lastUpdatedDate: Date,
  rank: number,
  wins: number,
  losses: number,
  winPercentage: number,
  groundBalls: number,
  runsSaved: number,
  runsAllowed: number,
  strikes: number
}

export interface StandingsTableData {
  title: string;
  rows: Array<TeamStandingsData>,
}

@Injectable()
export class StandingsService {
  private _apiUrl: string = 'http://api2.joyfulhome.com';
  
  //Team Profile
  private _defaultData: Array<TeamStandingsData> = [{
    teamName: "Aaa",
    teamImageUrl: "/app/public/profile_placeholder.png",
    lastUpdatedDate: new Date(),
    rank: 2,
    wins: 5,
    losses: 5,
    winPercentage: .50,
    groundBalls: 6,
    runsSaved: 3,
    runsAllowed: 20,
    strikes: 30
  },{
    teamName: "Baa",
    teamImageUrl: "/app/public/profile_placeholder.png",
    lastUpdatedDate: new Date(),
    rank: 1,
    wins: 8,
    losses: 2,
    winPercentage: .80,
    groundBalls: 10,
    runsSaved: 30,
    runsAllowed: 3,
    strikes: 15
  }];

  constructor(public http: Http){}

  getLeagueData(teamId?:number): Observable<Array<StandingsTableData>> {
    var tabsData: Array<StandingsTableData> = [{
       title: "All Division Standings", 
       rows: this._defaultData
    },{
       title: "American League Standings", 
       rows: this._defaultData
    },{
       title: "National League Standings", 
       rows: this._defaultData
    }];
    return Observable.of(tabsData);
  }
}