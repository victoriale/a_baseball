import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';
import {Conference, Division} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {StandingsTabData, StandingsTableData, TeamStandingsData} from './standings.data';
import {StandingsModule} from '../modules/standings/standings.module';
import {StandingsComponentData, TableTabData} from '../components/standings/standings.component';

@Injectable()
export class StandingsService {
  private _apiUrl: string = 'http://dev-homerunloyal-api.synapsys.us/standings/pct-low-high/';
// '[API]/standings/{ordering}/{conference}/{division}'

  //Team Profile
  private _defaultData: Array<TeamStandingsData> = [{
      teamName: "Atlanta Braves",
      teamImageUrl: "/app/public/profile_placeholder_large.png",
      teamKey: "",
      rank: 1,
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
      teamImageUrl: "/app/public/profile_placeholder_large.png",
      teamKey: "",
      rank: 2,
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

  constructor(public http: Http, private _mlbFunctions: MLBGlobalFunctions){}

//TODO-CJP: limit to five on module page.
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

  loadTabData(standingsData: StandingsComponentData, conference?: Conference, division?: Division) {
    this.getDefaultData(conference, division).subscribe(
      data => this.setupTabData(standingsData, conference, division, data),
      err => { console.log("Error getting standings data for " + Conference[conference] + " and division " + Division[division]); }
    );
  }

  setupTabData(standingsData: StandingsComponentData, conference: Conference, division: Division, table: StandingsTableData) {
    let groupName = this._mlbFunctions.formatGroupName(conference, division);
    table.rows.forEach(value => {
      value.groupName = groupName;
    });

    //Table tabs
    var sections = [
      {
        groupName: "", //only include group name if more than one section
        tableData: table
      }
    ];
    standingsData.tabs.push(new StandingsTabData(
      groupName + " Standings", //title
      standingsData.tabs.length === 0, //isActive
      sections
    ));
  }
}
