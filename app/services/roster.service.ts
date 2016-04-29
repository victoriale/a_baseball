import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';

export interface TeamRosterData {
  playerName: string,
  playerPos: string,
  playerHeight: string,
  playerWeight: number,
  playerAge: number,
  playerSalary: string,
  lastUpdatedDate: Date,
  playerImageUrl: string,
}

export interface RosterTableData {
  title: string;
  rows: Array<TeamRosterData>,
}

@Injectable()
export class RosterService {
  // private _apiUrl: string = 'http://api2.joyfulhome.com';

  //Team Profile
  private _defaultData: Array<TeamRosterData> = [{
      playerImageUrl: "/app/public/profile_placeholder.png",
      playerName: "Twilight",
      playerPos: "MA",
      playerHeight: "6ft00",
      playerWeight: 200,
      playerAge: 21,
      playerSalary: "9 Bil.",
      lastUpdatedDate: new Date()
  },
  {
      playerImageUrl: "/app/public/profile_placeholder.png",
      playerName: "Pinky Pie",
      playerPos: "PA",
      playerHeight: "7ft00",
      playerWeight: 300,
      playerAge: 50,
      playerSalary: "8 Bil.",
      lastUpdatedDate: new Date()
  },{
      playerImageUrl: "/app/public/profile_placeholder.png",
      playerName: "Rainbow Dash",
      playerPos: "FL",
      playerHeight: "8ft00",
      playerWeight: 100,
      playerAge: 25,
      playerSalary: "7 Bil.",
      lastUpdatedDate: new Date()
  }];
  private _defaultData2: Array<TeamRosterData> = [{
      playerImageUrl: "/app/public/profile_placeholder.png",
      playerName: "Victoria Le",
      playerPos: "MA",
      playerHeight: "6ft00",
      playerWeight: 200,
      playerAge: 21,
      playerSalary: "9 Bil.",
      lastUpdatedDate: new Date()
  },
  {
      playerImageUrl: "/app/public/profile_placeholder.png",
      playerName: "Larry Pham",
      playerPos: "PA",
      playerHeight: "7ft00",
      playerWeight: 300,
      playerAge: 50,
      playerSalary: "8 Bil.",
      lastUpdatedDate: new Date()
  },{
      playerImageUrl: "/app/public/profile_placeholder.png",
      playerName: "Lutz Lais",
      playerPos: "FL",
      playerHeight: "8ft00",
      playerWeight: 100,
      playerAge: 25,
      playerSalary: "7 Bil.",
      lastUpdatedDate: new Date()
  }];

  constructor(public http: Http){}

  getTeamRosterData(teamId?:number): Observable<Array<RosterTableData>> {
    var tabsData: Array<RosterTableData> = [{
       title: "Tab 1",
       rows: this._defaultData
    },{
       title: "Tab 2",
       rows: this._defaultData2
    },{
       title: "Tab 3",
       rows: this._defaultData
    },{
       title: "Tab 4",
       rows: this._defaultData
    },{
       title: "Tab 5",
       rows: this._defaultData
    }
  ];
    return Observable.of(tabsData);
  }
}
