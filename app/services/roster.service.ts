import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';

export interface TeamRosterData {
  playerName: string,
  teamImageUrl: string,
  lastUpdatedDate: Date,
  position: string,
  height: number,
  weight: number,
  age: number,
  salary: number
}

export interface RosterTableData {
  title: string;
  rows: Array<TeamRosterData>,
}

@Injectable()
export class RosterService {
  private _apiUrl: string = 'http://api2.joyfulhome.com';

  //Team Profile
  private _defaultData: Array<TeamRosterData> = [{
    playerName: "Aaa",
    teamImageUrl: "/app/public/profile_placeholder.png",
    lastUpdatedDate: new Date(),
    position: "[XX]",
    height: 5.11,
    weight: 100,
    age: 6,
    salary: 500000
  },{
    playerName: "Baa",
    teamImageUrl: "/app/public/profile_placeholder.png",
    lastUpdatedDate: new Date(),
    position: "[XX]",
    height: 6.5,
    weight: 200,
    age: 6,
    salary: 1
  }];

  constructor(public http: Http){}

  getLeagueData(teamId?:number): Observable<Array<RosterTableData>> {
    var tabsData: Array<RosterTableData> = [{
       title: "[Data Point 1]",
       rows: this._defaultData
    },{
      title: "[Data Point 2]",
       rows: this._defaultData
    },{
      title: "[Data Point 3]",
       rows: this._defaultData
    },{
      title: "[Data Point 4]",
       rows: this._defaultData
    },{
      title: "[Data Point 5]",
       rows: this._defaultData
    }];
    return Observable.of(tabsData);
  }
}
