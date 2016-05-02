import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';
import {RosterTableData, TeamRosterData} from './roster.data';

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
    var tabsData: Array<RosterTableData> = [
      new RosterTableData("Tab 1", this._defaultData),
      new RosterTableData("Tab 2", this._defaultData),
      new RosterTableData("Tab 3", this._defaultData),
      new RosterTableData("Tab 4", this._defaultData),
      new RosterTableData("Tab 5", this._defaultData)
    ];
    return Observable.of(tabsData);
  }
}
