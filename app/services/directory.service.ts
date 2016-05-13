import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';

import {GlobalSettings} from '../global/global-settings';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {DirectoryProfileItem, DirectoryItems} from '../modules/directory/directory.data';

declare var moment: any;

export enum DirectoryType {
  none,
  teams,
  players
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
  teamFirstName: string;
  teamLastName: string;
  teamCity: string;
  teamState: string;
  teamCountry: string;
  teamVenue: string;
  teamLogo: string;
  teamColorsHex: string;
  teamCurrentActivePlayers: string;
  pub2Id: string;
  twitterHandle: string;
  lastUpdated: string;
  
  // teamName: string;
  // teamId: string;
  // lastUpdated: Date;
  // league: string;
  // division: string;
  // city: string;
  // state: string;
  // venue: string;
}

interface MLBPlayerDirectoryData {
  teamId: string;
  teamName: string;
  playerId: string;
  playerName: string;
  playerFirstName: string;
  playerLastName: string;
  roleStatus: string;
  active: string;
  uniformNumber: string;
  position: string;
  depth: string;
  height: string;
  weight: string;
  birthDate: string;
  city: string;
  area: string;
  country: string;
  heightInInches: string;
  age: string;
  salary: string;
  personKey: string;
  pub1PlayerId: string;
  pub1TeamId: string;
  pub2Id: string;
  pub2TeamId: string;
  lastUpdate: string;    
  // playerName: string;
  // playerId: string;
  // teamName: string;
  // teamId: string;
  // lastUpdated: Date;
  // position: string;
  // city: string;
  // state: string;
  // rookieYear: string;
}

@Injectable()
export class DirectoryService {
  constructor(public http: Http){}

  getData(pageType: DirectoryType, searchParams: DirectorySearchParams): Observable<DirectoryItems> {
    switch ( pageType ) {
      case DirectoryType.players:
        return this.getPlayerData(searchParams);

      case DirectoryType.teams:
        return this.getTeamData(searchParams);
    }
    return null;
  }

  getPlayerData(searchParams: DirectorySearchParams): Observable<DirectoryItems> {
    let url = GlobalSettings.getApiUrl() + '/directory/players';
    if ( searchParams.startsWith ) {
      url += "/" + searchParams.startsWith;
    }
    // console.log("player directory: " + url);
    return this.http.get(url)
        .map(res => res.json())
        .map(data => {
          return {
            totalItems: data.data.length,
            items: data.data.map(value => this.convertPlayerDataToDirectory(value))
          }
        });
  }

  getTeamData(searchParams: DirectorySearchParams): Observable<DirectoryItems> {
    let url = GlobalSettings.getApiUrl() + '/directory/teams';
    if ( searchParams.startsWith ) {
      url += "/" + searchParams.startsWith;
    }
    // console.log("team directory: " + url);
    return this.http.get(url)
        .map(res => res.json())
        .map(data => {
          return {
            totalItems: data.data.length,
            items: data.data.map(value => this.convertTeamDataToDirectory(value))
          }
        });
  }

  //"<a href=''>[Team Name]</a>  |  League:  [American or National]  |  Division: [Division]",
  //"[City], [State]  <i class=\"fa fa-angle-right\"></i>  Stadium: [Stadium Name]"
  convertTeamDataToDirectory(data: MLBTeamDirectoryData): DirectoryProfileItem {
    return {
      lastUpdated: moment(data.lastUpdated),
      mainDescription: [
        {
          route: MLBGlobalFunctions.formatTeamRoute(data.teamName, data.teamId),
          text: data.teamName
        },
        {
          text: "League: N\A",// TODO-CJP + data..league
        },
        {
          text: "Division: N\A",// TODO-CJP + data.division
        }
      ],
      subDescription: [
        data.teamCity + ", " + data.teamState,
        "Stadium: " + data.teamVenue
      ]
    };
  }

  //"Last updated: [Day of the week], [Month] [Day], [YYYY]  |   [Timestamp]" +
  //"[Player Name]  |  [Associated Team]  |  Position:  [Position]" +
  //"[City], [State]    Rookie Year: {Rookie Year]"
  convertPlayerDataToDirectory(data: MLBPlayerDirectoryData): DirectoryProfileItem {
    return {
      lastUpdated: moment(data.lastUpdate),
      mainDescription: [
        {
          route: MLBGlobalFunctions.formatPlayerRoute(data.teamName, data.playerName, data.playerId),
          text: data.playerName
        },
        {
          route: MLBGlobalFunctions.formatTeamRoute(data.teamName, data.teamId),
          text: data.teamName
        },
        {
          text: "Position: " + data.position
        }
      ],
      subDescription: [
        data.city + ", " + data.country,
        "Rookie Year: " + "N/A" //TODO-CJP: set rookie year
      ]
    };
  }
}
