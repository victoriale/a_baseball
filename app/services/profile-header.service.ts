import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';

import {GlobalSettings} from '../global/global-settings';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {DataItem, ProfileHeaderData} from '../modules/profile-header/profile-header.module';
import {TitleInputData} from '../components/title/title.component';

declare var moment: any;

interface PlayerProfileHeaderData {
  description: string;
  info: {
    profileImage: string; //NEED
    backgroundImage: string; //NEED

    teamId: number;
    teamName: string;
    playerId: number;
    playerName: string;
    playerFirstName: string;
    playerLastName: string;
    roleStatus: string; //??
    active: string;
    uniformNumber: number;
    position: Array<string>;
    depth: string; // 'starter'
    height: string;
    weight: number;
    birthDate: string;
    city: string;
    area: string;
    country: string;
    heightInInches: number;
    age: number;
    salary: string; // or number??
    personKey: number;
    pub1PlayerId: number;
    pub1TeamId: number;
    pub2Id: number;
    pub2TeamId: number;
    lastUpdate: Date;
  };
  stats: {
    //Pitcher stats
      eventsStarted: number;
      runsAllowed: number;
      inningsPitched: number;
      era: number;
      wins: number;
      losses: number;
      saves: number;
      shutouts: number;
      gamesComplete: number;
      homeRunsAllowed: number;
      earnedRuns:  number;
      wildPitch:  number;
    //Batter stats
      average: string;
      runsScored: number;
      rbi: number;
      atBats: number;
      totalBases: number;
      sluggingPercentage: number;
      doubles: number;
      triples: number;
      homeRuns: number;
      onBasePercentage: number;
      stolenBases: number;
      stolenBasesCaught: number;
      onBasePlusSlugging: number;
      plateAppearances: number;
    //Both stats
      hits: number;
      basesOnBalls: number;
      strikeouts: number;
  }
}

interface TeamProfileHeaderData {
    description: string;
    stats: {
      profileImage: string; //NEED
      backgroundImage: string; //NEED
      city: string; //NEED
      state: string; //NEED
      lastUpdated: Date; //NEED

      teamId: number;
      teamName: string;
      seasonId: string;
      totalWins: string;
      totalLosses: string;
      batting: {
        average: string;
        runsScored: string;
        homeRuns: string;
      };
      pitching: {
        era: string;
      };
      conference: {
        rank: string;
        name: string;
      };
      division: {
        rank: string;
        wins: string;
        losses: string;
        winningPercentage: string;
        eventsPlayed: number;
        gamesBack: number;
        name: string;
      };
      streak: {
        type: string; //win or loss
        count: number;
      };
    };
}

interface LeagueProfileHeaderData {
  lastUpdated: Date; //NEED
  leagueName: string; //NEED
  city: string; //NEED
  state: string; //NEED
  foundedIn: string;  //NEED // year in [YYYY]
  backgroundImage: string; //NEED
  profileImage: string; //NEED
  totalTeams: string;
  totalPlayers: string;
  totalDivisions: string;
  totalLeagues: string;
}

@Injectable()
export class ProfileHeaderService {
  constructor(public http: Http){}

  getPlayerProfile(playerId: number): Observable<PlayerProfileHeaderData> {
    let url = GlobalSettings.getApiUrl() + '/player/profileHeader/' + playerId;
    // console.log("player profile url: " + url);
    return this.http.get(url)
        .map(res => res.json())
        .map(data => data.data);
  }

  getTeamProfile(teamId: number): Observable<TeamProfileHeaderData> {
    let url = GlobalSettings.getApiUrl() + '/team/profileHeader/' + teamId;
    // console.log("team profile url: " + url);
    return this.http.get(url)
        .map(res => res.json())
        .map(data => data.data);
  }

  getMLBProfile(): Observable<LeagueProfileHeaderData> {
    let url = GlobalSettings.getApiUrl() + '/league/profileHeader';
    // console.log("mlb profile url: " + url);
    return this.http.get(url)
        .map(res => res.json())
        .map(data => data.data);
  }

  getTeamPageHeader(teamId: number): Observable<any> {
    let url = GlobalSettings.getApiUrl() + '/team/profileHeader/' + teamId;
    return this.http.get(url)
        .map(res => res.json())
        .map(data => this.convertTeamPageHeader(data.data.stats));
  }

  private convertTeamPageHeader(data){
    var headerData = {
      data:{
        imageURL: '/app/public/mainLogo.png', //TODO
        text1: 'Last Updated:', //TODO
        text2: 'United States',
        text3: data.teamName + " " + data.seasonId + " Draft History",
        icon: 'fa fa-map-marker',
        hasHover : true,
      },
      error: "Sorry, the "+data.teamName+" do not currently have any data for the "+data.seasonId+" draft history"
    }
    return headerData;
  }

  convertToPlayerProfileHeader(data: PlayerProfileHeaderData): ProfileHeaderData {
    console.log(data);
    if (!data.info) {
      return null;
    }
    
    data.info.backgroundImage = GlobalSettings.getImageUrl(data.info.backgroundImage);
    data.info.profileImage = GlobalSettings.getImageUrl(data.info.profileImage);
    
    var description = data.description;
    var dataPoints: Array<DataItem>;
    var isPitcher = data.info.position.filter(value => value === "P").length > 0;

    if ( isPitcher ) {
      dataPoints = [
        {
          label: "Wins/Losses",
          labelCont: "for the current season",
          value: data.stats.wins + " - " + data.stats.losses
        },
        {
          label: "Innings Pitched",
          labelCont: "for the current season",
          value: data.stats.inningsPitched.toString()
        },
        {
          label: "Strikeouts",
          labelCont: "for the current season",
          value: data.stats.strikeouts.toString()
        },
        {
          label: "Earned Run Average",
          labelCont: "for the current season",
          value: data.stats.earnedRuns.toString()
        }
      ];
    }
    else {
      dataPoints = [
        {
          label: "Home Runs",
          labelCont: "for the current season",
          value: data.stats.homeRuns.toString()
        },
        {
          label: "Batting Average",
          labelCont: "for the current season",
          value: data.stats.average
        },
        {
          label: "RBIs",
          labelCont: "for the current season",
          value: data.stats.rbi.toString()
        },
        {
          label: "Hits",
          labelCont: "for the current season",
          value: data.stats.hits.toString()
        }
      ];
    }
    var header: ProfileHeaderData = {
      profileName: data.info.playerName,
      profileImageUrl: data.info.profileImage,
      backgroundImageUrl: data.info.backgroundImage,
      profileTitleFirstPart: data.info.playerFirstName,
      profileTitleLastPart: data.info.playerLastName,
      lastUpdatedDate: data.info.lastUpdate,
      description: description,
      topDataPoints: [
        {
          label: "Team",
          value: data.info.teamName,
          routerLink: MLBGlobalFunctions.formatTeamRoute(data.info.teamName,data.info.teamId.toString())
        },
        {
          label: "Jersey Number",
          value: data.info.uniformNumber.toString()
        },
        {
          label: "Position",
          value: data.info.position.join(",")
        }
      ],
      bottomDataPoints: dataPoints
    }
    return header;
  }

  convertToTeamProfileHeader(data: TeamProfileHeaderData): ProfileHeaderData {
    var description = data.description;
    var stats = data.stats;

    if (!stats) {
      return null;
    }
    
    data.stats.backgroundImage = GlobalSettings.getImageUrl(data.stats.backgroundImage);
    data.stats.profileImage = GlobalSettings.getImageUrl(data.stats.profileImage);
    
    var teamName = stats.teamName ? stats.teamName : "N/A";
    var city = stats.city ? stats.city : "N/A";
    var state = stats.state ? stats.state : "N/A";
    
    //TODO-CJP: get from API
    var lastSpaceIndex = teamName.lastIndexOf(" ");
    var firstPart = lastSpaceIndex >= 0 ? teamName.substring(0, lastSpaceIndex) : "";
    var lastPart = lastSpaceIndex >= 0 ? teamName.substring(lastSpaceIndex+1) : teamName;

    var header: ProfileHeaderData = {
      profileName: stats.teamName,
      profileImageUrl: stats.profileImage,
      backgroundImageUrl: stats.backgroundImage,
      profileTitleFirstPart: firstPart,
      profileTitleLastPart: lastPart,
      lastUpdatedDate: stats.lastUpdated,
      description: description,
      topDataPoints: [
        {
          label: "Division",
          value: stats.division ? stats.division.name : null
        },
        {
          label: "Rank",
          value: stats.division ? stats.division.rank : null
        },
        {
          label: "Record",
          value: stats.totalWins + " - " + stats.totalLosses
        }
      ],
      bottomDataPoints: [
        {
          label: "Batting Average",
          labelCont: "for the current season",
          value: stats.batting ? stats.batting.average : null
        },
        {
          label: "Runs",
          labelCont: "for the current season",
          value: stats.batting ? stats.batting.runsScored : null
        },
        {
          label: "Home Runs",
          labelCont: "for the current season",
          value: stats.batting ? stats.batting.homeRuns : null
        },
        {
          label: "Earned Run Average",
          labelCont: "for the current season",
          value: stats.pitching ? stats.pitching.era : null
        }
      ]
    }
    return header;
  }

  convertToLeagueProfileHeader(data: LeagueProfileHeaderData): ProfileHeaderData {
    //The MLB consists of [30] teams and [####] players. These teams and players are divided across [two] leagues and [six] divisions.
    var city = data.city != null ? data.city : "N/A";
    var state = data.state != null ? data.state : "N/A";
    
    data.backgroundImage = GlobalSettings.getImageUrl(data.backgroundImage);
    data.profileImage = GlobalSettings.getImageUrl(data.profileImage);

    var description = "The MLB consists of " + GlobalFunctions.formatNumber(data.totalTeams) +
                      " teams and " + GlobalFunctions.formatNumber(data.totalPlayers) + " players. " +
                      "These teams and players are divided across " + GlobalFunctions.formatNumber(data.totalLeagues) +
                      " leagues and " + GlobalFunctions.formatNumber(data.totalDivisions) + " divisions.";

    var header: ProfileHeaderData = {
      profileName: "MLB",
      profileImageUrl: data.profileImage,
      backgroundImageUrl: data.backgroundImage,
      profileTitleFirstPart: "",
      profileTitleLastPart: "Major League Baseball",
      lastUpdatedDate: data.lastUpdated,
      description: description,
      topDataPoints: [
        {
          label: "League Headquarters",
          value: city + ", " + state
        },
        {
          label: "Founded In",
          value: data.foundedIn
        }
      ],
      bottomDataPoints: [
        {
          label: "Total Teams:",
          value: data.totalTeams
        },
        {
          label: "Total Players:",
          value: data.totalPlayers
        },
        {
          label: "Total Divisions",
          value: data.totalDivisions
        },
        {
          label: "Total Leagues",
          value: data.totalLeagues
        }
      ]
    }
    return header;
  }
}
