import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';

import {GlobalSettings} from '../global/global-settings';
import {DataItem, ProfileHeaderData} from '../modules/profile-header/profile-header.module';
import {TitleInputData} from '../components/title/title.component';

interface PlayerProfileHeaderData {
  lastUpdated: Date; //NEED
  info: {
    profileImage: string; //NEED
    backgroundImage: string; //NEED
    yearsPlayed: number; //NEED

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

@Injectable()
export class ProfileHeaderService {
  constructor(public http: Http){}

  getPlayerProfile(playerId: number): Observable<ProfileHeaderData> {
    let url = GlobalSettings.getApiUrl() + '/player/profileHeader/' + playerId;
    return this.http.get(url)
        .map(res => {
          console.log("got data from " + url + ", converting to json: " + res);
          return res.json()
        })
        .map(data => {
          console.log("got json, converting to model");
          return this.convertToPlayerProfileHeader(data.data)
        });
  }

  getTeamProfile(teamId: number): Observable<ProfileHeaderData> {
    let url = GlobalSettings.getApiUrl() + '/team/profileHeader/' + teamId;
    return this.http.get(url)
        .map(res => res.json())
        .map(data => this.convertToTeamProfileHeader(data.data.stats));
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

  private convertToPlayerProfileHeader(data: PlayerProfileHeaderData): ProfileHeaderData {
    if ( data.info == null || data.stats == null ) {
      return null;
    }

    // [Player Name] started his MLB career on [Month] [Day], [Year] for [Team Name],
    // accumulating [##] years in the MLB.
    // [Player Name] was born in [City], [State] on [Month] [Day], [Year]
    // and is [##] years old, with a height of [##] and weighing in at [##]lbs.

    var yearsPlayed = data.info.yearsPlayed == 1 ? "one year" :  data.info.yearsPlayed + " years";
    var formattedAge = data.info.age == 1 ? "one year" :  data.info.age + " years";
    var formatedBirthDate = data.info.birthDate; //TODO-CJP: Format birthdate
    var formattedHeight = data.info.height != null ? data.info.height : "N/A";
    var formattedWeight = data.info.weight != null ? data.info.weight : "N/A";
    var startDateStr = "[TBA]";//TODO-CJP: get start date from api
    var description = data.info.playerName + " started his MLB career on " + startDateStr +
                      " for " + data.info.teamName + " accumulating " + yearsPlayed + " in the MLB." +
                      data.info.playerName + " was born in " + data.info.city + ", " + data.info.country +
                      " on " + formatedBirthDate + " and is " + formattedAge + " old with a height of " +
                       formattedHeight.replace(/(\d+)-(\d)/, "$1'$2\"") + " and weighing in at " + formattedWeight + "lbs.";

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
      profileImageUrl: data.info.profileImage, //TODO-CJP
      backgroundImageUrl: data.info.backgroundImage, //TODO-CJP
      profileTitleFirstPart: data.info.playerFirstName,
      profileTitleLastPart: data.info.playerLastName,
      lastUpdatedDate: data.lastUpdated,
      description: description,
      topDataPoints: [
        {
          label: "Team",
          value: data.info.teamName,
          routerLink: ["Team-page", { teamId: data.info.teamId }]
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

  private convertToTeamProfileHeader(data: TeamProfileHeaderData): ProfileHeaderData {
    //The [Atlanta Braves] play in [Turner Field] located in [Atlanta, GA]. The [Atlanta Braves] are part of the [NL East].
    var teamName = data.teamName != null ? data.teamName : "N/A";
    var venue = data.venue != null ? data.venue : "N/A";
    var city = data.city != null ? data.city : "N/A";
    var state = data.state != null ? data.state : "N/A";
    var divisionLongName = data.division != null && data.conference != null ? data.conference.name + " " + data.division.name : "N/A";

    var description = "The " + teamName + " play in " + venue + " located in " + city + ", " + state + ". " +
                      "The " + teamName + " are part of the " + divisionLongName + " division.";

    var header: ProfileHeaderData = {
      profileName: data.teamName,
      profileImageUrl: data.profileImage, //TODO-CJP
      backgroundImageUrl: data.backgroundImage, //TODO-CJP
      profileTitleFirstPart: city + ", " + state,
      profileTitleLastPart: data.teamName,
      lastUpdatedDate: data.lastUpdated,
      description: description,
      topDataPoints: [
        {
          label: "Division",
          value: data.division != null ? data.division.name : null
        },
        {
          label: "Rank",
          value: data.division != null ? data.division.rank : null
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
          value: data.batting != null ? data.batting.average : null
        },
        {
          label: "Runs",
          labelCont: "for the current season",
          value: data.batting != null ? data.batting.runsScored : null
        },
        {
          label: "Home Runs",
          labelCont: "for the current season",
          value: data.batting != null ? data.batting.homeRuns : null
        },
        {
          label: "Earned Run Average",
          labelCont: "for the current season",
          value: data.pitching != null ? data.pitching.era : null
        }
      ],
    }
    return header;
  }
}
