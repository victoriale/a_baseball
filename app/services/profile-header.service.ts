import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';

import {GlobalSettings} from '../global/global-settings';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {DataItem, ProfileHeaderData} from '../modules/profile-header/profile-header.module';
import {TitleInputData} from '../components/title/title.component';
import {Division, Conference, MLBPageParameters} from '../global/global-interface';

declare var moment: any;

interface PlayerProfileHeaderData {
  description: string;
  profileImage: string;
  info: {
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
    depth: string;
    height: string;
    weight: number;
    birthDate: string;
    city: string;
    area: string;
    country: string;
    heightInInches: number;
    age: number;
    salary: number;
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

interface TeamProfileData {
  pageParams: MLBPageParameters;
  fullProfileImageUrl: string;
  fullBackgroundImageUrl: string;
  headerData: TeamProfileHeaderData
}

interface TeamProfileHeaderData {
    description: string;
    profileImage: string;
    stats: {
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
  // leagueName: string; //NEED
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

  getTeamProfile(teamId: number): Observable<TeamProfileData> {
    let url = GlobalSettings.getApiUrl() + '/team/profileHeader/' + teamId;
    // console.log("team profile url: " + url);
    return this.http.get(url)
        .map(res => res.json())
        .map(data => {
          var headerData: TeamProfileHeaderData = data.data;
          var confKey = "";
          var divKey = "";
          if ( headerData.stats ) {
            if ( headerData.stats.conference && headerData.stats.conference.name ) {
              confKey = headerData.stats.conference.name.toLowerCase();
            }
            if ( headerData.stats.division && headerData.stats.division.name ) {
              divKey = headerData.stats.division.name.toLowerCase();
            }
          }
          return {
            pageParams: {
              teamId: headerData.stats.teamId,
              teamName: headerData.stats.teamName,
              division: Division[divKey],
              conference: Conference[confKey],
            },
            fullBackgroundImageUrl: GlobalSettings.getImageUrl(headerData.stats.backgroundImage),
            fullProfileImageUrl: GlobalSettings.getImageUrl(headerData.profileImage),
            headerData: headerData
          };
        });
  }

  getMLBProfile(): Observable<LeagueProfileHeaderData> {
    let url = GlobalSettings.getApiUrl() + '/league/profileHeader';
    // console.log("mlb profile url: " + url);
    return this.http.get(url)
        .map(res => res.json())
        .map(data => data.data);
  }

  convertTeamPageHeader(data: TeamProfileData) {
    console.log(data);
    var description = data.headerData.description;
    var stats = data.headerData.stats;

    if (!stats) {
      return null;
    }

    var headerData = {
      data:{
        imageURL: data.fullProfileImageUrl, //TODO
        text1: 'Last Updated:', //TODO
        text2: 'United States',
        text3: stats.teamName + " " + stats.seasonId + " Draft History",
        icon: 'fa fa-map-marker',
        hasHover : true,
      },
      error: "Sorry, the " + stats.teamName + " do not currently have any data for the " + stats.seasonId + " draft history"
    }
    return headerData;
  }

  convertToPlayerProfileHeader(data: PlayerProfileHeaderData): ProfileHeaderData {
    if (!data.info) {
      return null;
    }

    data.info.backgroundImage = GlobalSettings.getImageUrl(data.info.backgroundImage);
    data.profileImage = GlobalSettings.getImageUrl(data.profileImage);

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
      profileImageUrl: data.profileImage,
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

  convertToTeamProfileHeader(data: TeamProfileData): ProfileHeaderData {
    var description = data.headerData.description;
    var stats = data.headerData.stats;

    if (!stats) {
      return null;
    }

    var teamName = stats.teamName ? stats.teamName : "N/A";
    var city = stats.city ? stats.city : "N/A";
    var state = stats.state ? stats.state : "N/A";

    //TODO-CJP: get from API
    var lastSpaceIndex = teamName.lastIndexOf(" ");
    var firstPart = lastSpaceIndex >= 0 ? teamName.substring(0, lastSpaceIndex) : "";
    var lastPart = lastSpaceIndex >= 0 ? teamName.substring(lastSpaceIndex+1) : teamName;

    var header: ProfileHeaderData = {
      profileName: stats.teamName,
      profileImageUrl: data.fullProfileImageUrl,
      backgroundImageUrl: data.fullBackgroundImageUrl,
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
