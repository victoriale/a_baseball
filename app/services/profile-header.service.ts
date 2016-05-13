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

interface PlayerProfileData {
  pageParams: MLBPageParameters;
  fullProfileImageUrl: string;
  fullBackgroundImageUrl: string;
  headerData: PlayerProfileHeaderData
}

interface PlayerProfileHeaderData {
  description: string;
  info: {

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
    lastUpdate: string;
    playerHeadshot: string;
    backgroundImage: string;
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
      average: number;
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
    backgroundImage: string;
    lastUpdated: string;
    teamFirstName: string;
    teamLastName: string;
    stats: {
      teamId: number;
      teamName: string;
      seasonId: string;
      totalWins: number;
      totalLosses: number;
      batting: {
        average: number;
        runsScored: number;
        homeRuns: number;
      };
      pitching: {
        era: number;
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
  totalTeams: number;
  totalPlayers: number;
  totalDivisions: number;
  totalLeagues: number;
}

@Injectable()
export class ProfileHeaderService {
  constructor(public http: Http){}

  getPlayerProfile(playerId: number): Observable<PlayerProfileData> {
    let url = GlobalSettings.getApiUrl() + '/player/profileHeader/' + playerId;
    // console.log("player profile url: " + url);
    return this.http.get(url)
        .map(res => res.json())
        .map(data => {
          var headerData: PlayerProfileHeaderData = data.data;
          if (!headerData.info) {
            return null;
          }
          //Forcing values to be numbers (all stats values should be numbers)
          if ( headerData.stats ) {
            for ( var key in headerData.stats ) {
              headerData.stats[key] = Number(headerData.stats[key]);
            }
          }
          return {
            pageParams: {
              teamId: headerData.info.teamId,
              teamName: headerData.info.teamName,
              playerId: headerData.info.playerId,
              playerName: headerData.info.playerName
            },
            fullBackgroundImageUrl: GlobalSettings.getImageUrl(headerData.info.backgroundImage),
            fullProfileImageUrl: GlobalSettings.getImageUrl(headerData.info.playerHeadshot),
            headerData: headerData
          };
        });
  }

  getTeamProfile(teamId: number): Observable<TeamProfileData> {
    let url = GlobalSettings.getApiUrl() + '/team/profileHeader/' + teamId;
    // console.log("team profile url: " + url);
    return this.http.get(url)
        .map(res => res.json())
        .map(data => {
          var headerData: TeamProfileHeaderData = data.data;
          
          //Setting up conference and division values
          var confKey = "", divKey = "";
          if ( headerData.stats ) {
            if ( headerData.stats.conference && headerData.stats.conference.name ) {
              confKey = headerData.stats.conference.name.toLowerCase();
            }
            if ( headerData.stats.division && headerData.stats.division.name ) {
              divKey = headerData.stats.division.name.toLowerCase();
            }
          }
          
          //Forcing values to be numbers
          if ( headerData.stats.batting ) {
            headerData.stats.batting.average = Number(headerData.stats.batting.average); 
            headerData.stats.batting.runsScored = Number(headerData.stats.batting.runsScored); 
            headerData.stats.batting.homeRuns = Number(headerData.stats.batting.homeRuns);
          }  
          if ( headerData.stats.pitching ) {
            headerData.stats.pitching.era = Number(headerData.stats.pitching.era);
          } 
          return {
            pageParams: {
              teamId: headerData.stats.teamId,
              teamName: headerData.stats.teamName,
              division: Division[divKey],
              conference: Conference[confKey],
            },
            fullBackgroundImageUrl: GlobalSettings.getImageUrl(headerData.backgroundImage),
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
        .map(data => {
          var leagueData: LeagueProfileHeaderData = data.data;
          
          //Forcing values to be numbers
          leagueData.totalDivisions = Number(leagueData.totalDivisions);
          leagueData.totalLeagues = Number(leagueData.totalLeagues);
          leagueData.totalPlayers = Number(leagueData.totalPlayers);
          leagueData.totalTeams = Number(leagueData.totalTeams);
          
          return leagueData;
        });
  }

  convertTeamPageHeader(data: TeamProfileData) {
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

  convertToPlayerProfileHeader(data: PlayerProfileData): ProfileHeaderData {
    if (!data.headerData || !data.headerData.info) {
      return null;
    }
    
    var headerData = data.headerData;
    var stats = headerData.stats;
    var info = headerData.info;

    var description = headerData.description;
    var dataPoints: Array<DataItem>;
    var isPitcher = headerData.info.position.filter(value => value === "P").length > 0;

    if ( isPitcher ) {
      var formattedEra = null;
      if ( stats && stats.earnedRuns != null ) {
        if ( stats.earnedRuns > 1 ) {
          formattedEra = stats.earnedRuns.toPrecision(3);
        }
        else {        
          formattedEra = stats.earnedRuns.toPrecision(2);
        }
      }
      dataPoints = [
        {
          label: "Wins/Losses",
          labelCont: "for the current season",
          value: (stats && stats.wins != null && stats.losses != null ) ? stats.wins + " - " + stats.losses : null
        },
        {
          label: "Innings Pitched",
          labelCont: "for the current season",
          value: (stats && stats.inningsPitched != null) ? stats.inningsPitched.toString() : null
        },
        {
          label: "Strikeouts",
          labelCont: "for the current season",
          value: (stats && stats.strikeouts != null) ? stats.strikeouts.toString() : null
        },
        {
          label: "Earned Run Average",
          labelCont: "for the current season",
          value: formattedEra
        }
      ];
    }
    else {
      dataPoints = [
        {
          label: "Home Runs",
          labelCont: "for the current season",
          value: (stats && stats.homeRuns != null) ? stats.homeRuns.toString() : null
        },
        {
          label: "Batting Average",
          labelCont: "for the current season",
          value: (stats && stats.average != null) ? stats.average.toPrecision(3) : null
        },
        {
          label: "RBIs",
          labelCont: "for the current season",
          value: (stats && stats.rbi != null) ? stats.rbi.toString() : null
        },
        {
          label: "Hits",
          labelCont: "for the current season",
          value: (stats && stats.hits != null) ? stats.hits.toString() : null
        }
      ];
    }
    var header: ProfileHeaderData = {
      profileName: info.playerName,
      profileImageUrl: data.fullProfileImageUrl,
      backgroundImageUrl: data.fullBackgroundImageUrl,
      profileTitleFirstPart: info.playerFirstName,
      profileTitleLastPart: info.playerLastName,
      lastUpdatedDate: moment(info.lastUpdate),
      description: description,
      topDataPoints: [
        {
          label: "Team",
          value: info.teamName,
          routerLink: MLBGlobalFunctions.formatTeamRoute(info.teamName, info.teamId.toString())
        },
        {
          label: "Jersey Number",
          value: info.uniformNumber ? info.uniformNumber.toString() : null
        },
        {
          label: "Position",
          value: info.position ? info.position.join(",") : null
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

    var formattedEra = null;
    if ( stats.pitching ) {
      if ( stats.pitching.era > 1 ) {
        formattedEra = stats.pitching.era.toPrecision(3);
      }
      else {        
        formattedEra = stats.pitching.era.toPrecision(2);
      }
    }

    var header: ProfileHeaderData = {
      profileName: stats.teamName,
      profileImageUrl: data.fullProfileImageUrl,
      backgroundImageUrl: data.fullBackgroundImageUrl,
      profileTitleFirstPart: data.headerData.teamFirstName,
      profileTitleLastPart: data.headerData.teamLastName,
      lastUpdatedDate: moment(data.headerData.lastUpdated),
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
          value: stats.batting ? stats.batting.average.toPrecision(3) : null
        },
        {
          label: "Runs",
          labelCont: "for the current season",
          value: stats.batting ? stats.batting.runsScored.toString() : null
        },
        {
          label: "Home Runs",
          labelCont: "for the current season",
          value: stats.batting ? stats.batting.homeRuns.toString() : null
        },
        {
          label: "Earned Run Average",
          labelCont: "for the current season",
          value: formattedEra
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
          value: data.totalTeams != null ? data.totalTeams.toString() : null
        },
        {
          label: "Total Players:",
          value: data.totalPlayers != null ? data.totalPlayers.toString() : null
        },
        {
          label: "Total Divisions:",
          value: data.totalDivisions != null ? data.totalDivisions.toString() : null
        },
        {
          label: "Total Leagues:",
          value: data.totalLeagues != null ? data.totalLeagues.toString() : null
        }
      ]
    }
    return header;
  }
}
