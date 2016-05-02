import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';
import {Conference, Division} from '../global/global-interface';
import {StandingsTableData, TeamStandingsData} from './standings.data';

@Injectable()
export class StandingsService {
  private _apiUrl: string = 'http://dev-homerunloyal-api.synapsys.us/standings/pct-low-high/'; 
// '[API]/standings/{ordering}/{conference}/{division}'
  
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

  getData(conference: Conference, division: Division): Observable<StandingsTableData> {
    let url = this._apiUrl;
    let title = "Standings";
    
    if ( conference !== undefined ) {
      url += Conference[conference] + "/";
      
      if ( division !== undefined ) {
        url += Division[division] + "/";        
      }
    }
    
    return this.http.get(url)
        .map(res => res.json())
        .map(data => this.createTableModel(data.data));
  }

  getDefaultData(conference: Conference, division: Division): Observable<StandingsTableData> {
    return Observable.of(this.createTableModel(this._defaultData));
  }
  
  createTableModel(data: Array<TeamStandingsData>): StandingsTableData {
    //TODO-CJP: create subtitle string
    return new StandingsTableData("", data);
  }
}