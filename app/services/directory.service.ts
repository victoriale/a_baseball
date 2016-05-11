import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';

import {DirectoryProfileItem, DirectoryItems} from '../modules/directory/directory.data';

export enum DirectoryType {
  none,
  team,
  player
}

export interface DirectorySearchParams {
  startsWith: string;
  newlyAdded: boolean;
  listingsLimit: number;
  page: number;
}

//Where <T> is either <MLBTeamDirectoryData> or <MLBPlayerDirectoryData>
interface DirectoryListData<T> {
  totalItems: number;
  currentPage: number;
  items: Array<T>
}

interface MLBTeamDirectoryData {
  teamName: string;
  teamId: string;
  lastUpdated: Date;
  league: string;
  division: string;
  city: string;
  state: string;
  venue: string;
}

interface MLBPlayerDirectoryData {
  playerName: string;
  playerId: string;
  teamName: string;
  teamId: string;
  lastUpdated: Date;
  position: string;
  city: string;
  state: string;
  rookieYear: string;
}

@Injectable()
export class DirectoryService {
  private _apiUrl: string = 'http://api2.joyfulhome.com';

  private _defaultTeamData: Array<MLBTeamDirectoryData> = [
    {
      teamName: "[Team name]",
      teamId: "[Team key]",
      lastUpdated: new Date(),
      league: "[League]",
      division: "[Division]",
      city: "[City]",
      state: "[State]",
      venue: "[Venue]"
    },
    {
      teamName: "[Team name]",
      teamId: "[Team key]",
      lastUpdated: new Date(),
      league: "[League]",
      division: "[Division]",
      city: "[City]",
      state: "[State]",
      venue: "[Venue]"
    },
    {
      teamName: "[Team name]",
      teamId: "[Team key]",
      lastUpdated: new Date(),
      league: "[League]",
      division: "[Division]",
      city: "[City]",
      state: "[State]",
      venue: "[Venue]"
    },
    {
      teamName: "[Team name]",
      teamId: "[Team key]",
      lastUpdated: new Date(),
      league: "[League]",
      division: "[Division]",
      city: "[City]",
      state: "[State]",
      venue: "[Venue]"
    },
    {
      teamName: "[Team name]",
      teamId: "[Team key]",
      lastUpdated: new Date(),
      league: "[League]",
      division: "[Division]",
      city: "[City]",
      state: "[State]",
      venue: "[Venue]"
    }
  ];

  private _defaultPlayerData: Array<MLBPlayerDirectoryData> = [
    {
      playerName: "[Player Name]",
      playerId: "[Player key]",
      teamName: "[Team name]",
      teamId: "[Team key]",
      lastUpdated: new Date(),
      position: "[Position]",
      city: "[City]",
      state: "[State]",
      rookieYear: "[Rookie Year]"
    },
    {
      playerName: "[Player Name]",
      playerId: "[Player key]",
      teamName: "[Team name]",
      teamId: "[Team key]",
      lastUpdated: new Date(),
      position: "[Position]",
      city: "[City]",
      state: "[State]",
      rookieYear: "[Rookie Year]"
    },
    {
      playerName: "[Player Name]",
      playerId: "[Player key]",
      teamName: "[Team name]",
      teamId: "[Team key]",
      lastUpdated: new Date(),
      position: "[Position]",
      city: "[City]",
      state: "[State]",
      rookieYear: "[Rookie Year]"
    },
    {
      playerName: "[Player Name]",
      playerId: "[Player key]",
      teamName: "[Team name]",
      teamId: "[Team key]",
      lastUpdated: new Date(),
      position: "[Position]",
      city: "[City]",
      state: "[State]",
      rookieYear: "[Rookie Year]"
    },
    {
      playerName: "[Player Name]",
      playerId: "[Player key]",
      teamName: "[Team name]",
      teamId: "[Team key]",
      lastUpdated: new Date(),
      position: "[Position]",
      city: "[City]",
      state: "[State]",
      rookieYear: "[Rookie Year]"
    }
  ];

  constructor(public http: Http){}

  getData(pageType: DirectoryType, searchParams: DirectorySearchParams): Observable<DirectoryItems> {
    switch ( pageType ) {
      case DirectoryType.player:
        return this.getPlayerData(searchParams);

      case DirectoryType.team:
        return this.getTeamData(searchParams);
    }
    return null;
  }

  getPlayerData(searchParams: DirectorySearchParams): Observable<DirectoryItems> {
    let url = this._apiUrl + '/directory/player';
    return this.http.get(url)
        .map(res => res.json())
        .map(data => data.data);
  }

  getTeamData(searchParams: DirectorySearchParams): Observable<DirectoryItems> {
    let url = this._apiUrl + '/directory/team';
    return this.http.get(url)
        .map(res => res.json())
        .map(data => {
          return {
            totalItems: 10,
            items: data.data.map(value => this.convertTeamDataToDirectory(value))
          }
        });
  }

  getDefaultData(pageType: DirectoryType, searchParams: DirectorySearchParams): Observable<DirectoryItems> {
    switch ( pageType ) {
      case DirectoryType.player:
        return this.getDefaultPlayerData(searchParams);

      case DirectoryType.team:
        return this.getDefaultTeamData(searchParams);
    }
    return null;
  }

  getDefaultPlayerData(searchParams: DirectorySearchParams): Observable<DirectoryItems> {
    return Observable.of({
      totalItems: 10,
      items: this._defaultPlayerData.map(value => this.convertPlayerDataToDirectory(value))
    });
  }

  getDefaultTeamData(searchParams: DirectorySearchParams): Observable<DirectoryItems> {
    return Observable.of({
      totalItems: 10,
      items: this._defaultTeamData.map(value => this.convertTeamDataToDirectory(value))
    });
  }


  //"<a href=''>[Team Name]</a>  |  League:  [American or National]  |  Division: [Division]",
  //"[City], [State]  <i class=\"fa fa-angle-right\"></i>  Stadium: [Stadium Name]"
  convertTeamDataToDirectory(data: MLBTeamDirectoryData): DirectoryProfileItem {
    return {
      lastUpdated: data.lastUpdated,
      mainDescription: [
        {
          page: "Team-page",
          pageParams: { teamName:data.teamName, teamID: data.teamId },
          text: data.teamName
        },
        {
          text: "League: " + data.league
        },
        {
          text: "Division: " + data.division
        }
      ],
      subDescription: [
        data.city + ", " + data.state,
        "Stadium: " + data.venue
      ]
    };
  }

  //"Last updated: [Day of the week], [Month] [Day], [YYYY]  |   [Timestamp]" +
  //"[Player Name]  |  [Associated Team]  |  Position:  [Position]" +
  //"[City], [State]    Rookie Year: {Rookie Year]"
  convertPlayerDataToDirectory(data: MLBPlayerDirectoryData): DirectoryProfileItem {
    return {
      lastUpdated: data.lastUpdated,
      mainDescription: [
        {
          page: "Player-page", //TODO-CJP: change to Player-page
          pageParams: { playerID: data.playerId },
          text: data.playerName
        },
        {
          page: "Team-page",
          pageParams: { teamID: data.teamId },
          text: data.teamName
        },
        {
          text: "Position: " + data.position
        }
      ],
      subDescription: [
        data.city + ", " + data.state,
        "Rookie Year: " + data.rookieYear
      ]
    };
  }
}
