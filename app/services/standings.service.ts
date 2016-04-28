import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';

export interface TeamStandingsData {
  teamName: string,
  teamImageUrl: string,
  conferenceName: string,
  divisionName: string,
  lastUpdatedDate: Date,
  // rank: number,
  totalWins: number,
  totalLosses: number,
  winPercentage: number,
  streakType: string,
  streakCount: number,
  batRunsScored: number,
  pitchRunsAllowed: number,
  gamesBack: number
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
      teamName: "Atlanta Braves",
      teamImageUrl: "none.jpg",
      totalWins: 4,
      totalLosses: 17,
      batRunsScored: 69,
      pitchRunsAllowed: 113,
      streakType: "loss",
      streakCount: 8,
      conferenceName: "National",
      divisionName: "East",
      winPercentage: 0.19,
      gamesBack: 10.5,
      lastUpdatedDate: new Date()
  },
  {
      teamName: "Minnesota Twins",
      teamImageUrl: "none.jpg",
      totalWins: 7,
      totalLosses: 15,
      batRunsScored: 77,
      pitchRunsAllowed: 97,
      streakType: "loss",
      streakCount: 1,
      conferenceName: "American",
      divisionName: "Central",
      winPercentage: 0.318,
      gamesBack: 9,
      lastUpdatedDate: new Date()
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