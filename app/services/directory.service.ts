import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';

import {GlobalSettings} from '../global/global-settings';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {DirectoryProfileItem, DirectoryItems} from '../modules/directory/directory.data';

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
  divisionName: string;
  conferenceName: string;
  lastUpdated: string;
  resultCount: number;
  pageCount: number;
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
  position: Array<string>;
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
  startDate: string;
  lastUpdate: string;
  resultCount: number;
  pageCount: number;
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
    url += "/" + searchParams.listingsLimit + "/" + searchParams.page;
    // console.log("player directory: " + url);
    return this.http.get(url)
        .map(res => res.json())
        .map(data => {
          var items = data.data;
          var firstItem = items.length > 0 ? items[0] : null;
          return {
            totalItems: firstItem ? firstItem.resultCount : 0,
            items: items.map(value => this.convertPlayerDataToDirectory(value))
          }
        });
  }

  getTeamData(searchParams: DirectorySearchParams): Observable<DirectoryItems> {
    let url = GlobalSettings.getApiUrl() + '/directory/teams';
    if ( searchParams.startsWith ) {
      url += "/" + searchParams.startsWith;
    }
    url += "/" + searchParams.listingsLimit + "/" + searchParams.page;
    // console.log("team directory: " + url);
    return this.http.get(url)
        .map(res => res.json())
        .map(data => {
          var items = data.data;
          var firstItem = items.length > 0 ? items[0] : null;
          return {
            totalItems: firstItem ? firstItem.resultCount : 0,
            items: data.data.map(value => this.convertTeamDataToDirectory(value))
          }
        });
  }

  //"<a href=''>[Team Name]</a>  |  League:  [American or National]  |  Division: [Division]",
  //"[City], [State]  <i class=\"fa fa-angle-right\"></i>  Stadium: [Stadium Name]"
  convertTeamDataToDirectory(data: MLBTeamDirectoryData): DirectoryProfileItem {
    var location = "N/A";
    if ( data.teamCity && data.teamState ) {
      location = data.teamCity + ", " + data.teamState;
    }
    
    var venue = "N/A";
    if ( data.teamVenue ) {
      venue = data.teamVenue;
    }
    return {
      lastUpdated: data.lastUpdated,
      mainDescription: [
        {
          route: MLBGlobalFunctions.formatTeamRoute(data.teamName, data.teamId),
          text: data.teamName
        },
        {
          text: "League: " + (data.conferenceName ? data.conferenceName : "N/A")
        },
        {
          text: "Division: "  + (data.divisionName ? data.divisionName : "N/A")
        }
      ],
      subDescription: [
        location,
        "Stadium: " + venue
      ]
    };
  }

  //"Last updated: [Day of the week], [Month] [Day], [YYYY]  |   [Timestamp]" +
  //"[Player Name]  |  [Associated Team]  |  Position:  [Position]" +
  //"[City], [State]    Rookie Year: {Rookie Year]"
  convertPlayerDataToDirectory(data: MLBPlayerDirectoryData): DirectoryProfileItem {
    var location = "N/A";
    if ( data.city && data.area ) {
      location = data.city + ", " + GlobalFunctions.stateToAP(data.area);
    }
    
    var positions = "N/A";
    if ( data.position && data.position.length > 0 ) {
      positions = data.position.join(", ");
    }
    
    return {
      lastUpdated: data.lastUpdate,
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
          text: "Position: " + positions
        }
      ],
      subDescription: [
        location,
        "Rookie Year: " + (data.startDate != null ? data.startDate : "N/A")
      ]
    };
  }
}
