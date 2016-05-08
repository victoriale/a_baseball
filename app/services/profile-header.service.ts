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
  lastUpdated: Date; //NEED   
  info: {    
    profileImage: string; //NEED
    backgroundImage: string; //NEED
    yearsPlayed: number; //NEED
    startDate: string; //NEED
    
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
    profileImage: string; //NEED
    backgroundImage: string; //NEED
    city: string; //NEED
    state: string; //NEED
    lastUpdated: Date; //NEED   
    venue: string; //NEED
    
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
}

interface LeagueProfileHeaderData {
  lastUpdated: Date;
  leagueName: string;
  city: string;
  state: string;
  foundedIn: string; // year in [YYYY]
  backgroundImage: string;
  profileImage: string;
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
        .map(data => data.data.stats);
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
    if (!data.info) {
      return null;
    }    
    // [Player Name] started his MLB career on [Month] [Day], [Year] for [Team Name], 
    // accumulating [##] years in the MLB.  
    // [Player Name] was born in [City], [State] on [Month] [Day], [Year] 
    // and is [##] years old, with a height of [##] and weighing in at [##]lbs.
    
    var formattedYearsPlayed = data.info.yearsPlayed == 1 ? "one year" :  data.info.yearsPlayed + " years";    
    var formattedAge = data.info.age == 1 ? "one year" :  data.info.age + " years";  
    var formattedBirthDate = GlobalFunctions.formatLongDate(data.info.birthDate); 
    var formattedHeight = MLBGlobalFunctions.formatHeight(data.info.height); 
    var formattedWeight = data.info.weight ? data.info.weight : "N/A";
    var formattedCity = data.info.city ? data.info.city : "N/A";
    var formattedCountry = data.info.country ? data.info.country : "N/A";
    var formattedStartDate = GlobalFunctions.formatLongDate(data.info.startDate);
    
    var description = data.info.playerName + " started his MLB career on " + formattedStartDate +
                      " for " + data.info.teamName + " accumulating " + formattedYearsPlayed + " in the MLB. " +
                      data.info.playerName + " was born in " + formattedCity + ", " + formattedCountry +
                      " on " + formattedBirthDate + " and is " + formattedAge + " old with a height of " +
                       formattedHeight + " and weighing in at " + formattedWeight + "lbs.";
                      
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
      lastUpdatedDate: data.lastUpdated,
      description: description,
      topDataPoints: [
        {
          label: "Team",
          value: data.info.teamName,
          routerLink: ["Team-page", { teamID: data.info.teamId }]          
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
    //The [Atlanta Braves] play in [Turner Field] located in [Atlanta, GA]. The [Atlanta Braves] are part of the [NL East].
    var teamName = data.teamName ? data.teamName : "N/A";
    var venue = data.venue ? data.venue : "N/A";
    var city = data.city ? data.city : "N/A";
    var state = data.state ? data.state : "N/A";
    var divisionLongName = data.division && data.conference ? data.conference.name + " " + data.division.name : "N/A";
    
    var description = "The " + teamName + " play in " + venue + " located in " + city + ", " + state + ". " + 
                      "The " + teamName + " are part of the " + divisionLongName + " division.";
                          
    var header: ProfileHeaderData = {
      profileName: data.teamName,
      profileImageUrl: data.profileImage,
      backgroundImageUrl: data.backgroundImage,
      profileTitleFirstPart: city + ", " + state,
      profileTitleLastPart: data.teamName,
      lastUpdatedDate: data.lastUpdated,
      description: description,
      topDataPoints: [
        {
          label: "Division",
          value: data.division ? data.division.name : null   
        },
        {
          label: "Rank",
          value: data.division ? data.division.rank : null
        },
        {
          label: "Record",
          value: data.totalWins + " - " + data.totalLosses
        }
      ],
      bottomDataPoints: [
        {
          label: "Batting Average",
          labelCont: "for the current season",
          value: data.batting ? data.batting.average : null
        },
        {
          label: "Runs",
          labelCont: "for the current season",
          value: data.batting ? data.batting.runsScored : null
        },
        {
          label: "Home Runs",
          labelCont: "for the current season",
          value: data.batting ? data.batting.homeRuns : null
        },
        {
          label: "Earned Run Average",
          labelCont: "for the current season",
          value: data.pitching ? data.pitching.era : null
        }
      ]
    }
    return header;
  }
  
  convertToLeagueProfileHeader(data: LeagueProfileHeaderData): ProfileHeaderData {
    //The MLB consists of [30] teams and [####] players. These teams and players are divided across [two] leagues and [six] divisions.
    var city = data.city != null ? data.city : "N/A";
    var state = data.state != null ? data.state : "N/A";
    
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