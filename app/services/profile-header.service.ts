import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';

import {GlobalSettings} from '../global/global-settings';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {DataItem, ProfileHeaderData} from '../modules/profile-header/profile-header.module';
import {TitleInputData} from '../components/title/title.component';
import {Division, Conference, MLBPageParameters} from '../global/global-interface';

declare var moment: any;

export interface IProfileData {
  profileName: string;
  profileId: string;
  profileType: string; // for MLB, this is 'team', 'player', or 'league';
}

interface PlayerProfileData extends IProfileData {
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
    draftTeam: string;
    draftYear: string;
    qualified: boolean;
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
    //  seasonBase
      seasonId: number;
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

interface TeamProfileData extends IProfileData {
  pageParams: MLBPageParameters;
  fullProfileImageUrl: string;
  fullBackgroundImageUrl: string;
  headerData: TeamProfileHeaderData;
  /**
   * @deprecated use profileName instead
   */
  teamName: string; //same as profileName
}

interface TeamProfileHeaderData {
    description: string;
    profileImage: string;
    backgroundImage: string;
    lastUpdated: string;
    teamFirstName: string;
    teamLastName: string;
    teamVenue: string;
    teamCity: string;
    teamState: string;
    seasonId: string;
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

interface LeagueProfileData extends IProfileData {
  headerData: LeagueProfileHeaderData;
}

interface LeagueProfileHeaderData {
  lastUpdated: string;
  city: string;
  state: string;
  foundingDate: string;
  foundedIn: string;  //NEED // year in [YYYY]
  backgroundImage: string; //PLACEHOLDER
  logo: string;
  profileNameShort:string;
  profileNameLong:string;
  totalTeams: number;
  totalPlayers: number;
  totalDivisions: number;
  totalLeagues: number;
  seasonId?:any;
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
              if(key == "seasonId"){
                headerData.stats[key] = headerData.stats[key];
              } else {
                headerData.stats[key] = Number(headerData.stats[key]);
              }
            }
          }
          return {
            pageParams: {
              teamId: headerData.info.teamId,
              teamName: headerData.info.teamName,
              playerId: headerData.info.playerId,
              playerName: headerData.info.playerName
            },
            fullBackgroundImageUrl: GlobalSettings.getBackgroundImageUrl(headerData.info.backgroundImage, GlobalSettings._imgProfileMod),
            fullProfileImageUrl: GlobalSettings.getImageUrl(headerData.info.playerHeadshot, GlobalSettings._imgProfileLogo),
            headerData: headerData,
            profileName: headerData.info.playerName,
            profileId: headerData.info.playerId.toString(),
            profileType: "player",
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
          var teamName = headerData.teamFirstName + " " + headerData.teamLastName;
          return {
            pageParams: {
              teamId: headerData.stats.teamId,
              teamName: headerData.stats.teamName,
              division: Division[divKey],
              conference: Conference[confKey],
              seasonId: headerData.seasonId
            },
            fullBackgroundImageUrl: GlobalSettings.getBackgroundImageUrl(headerData.backgroundImage, GlobalSettings._imgProfileMod),
            fullProfileImageUrl: GlobalSettings.getImageUrl(headerData.profileImage, GlobalSettings._imgProfileLogo),
            headerData: headerData,
            teamName: teamName,
            profileName: headerData.stats.teamName,
            profileId: headerData.stats.teamId.toString(),
            profileType: "team"
          };
        });
  }

  getMLBProfile(): Observable<LeagueProfileData> {
    let url = GlobalSettings.getApiUrl() + '/league/profileHeader';
    // console.log("mlb profile url: " + url);
    return this.http.get(url)
        .map(res => res.json())
        .map(data => {
          var leagueData: LeagueProfileHeaderData = data.data;
          leagueData.profileNameShort = "MLB";
          leagueData.profileNameLong = "Major League Baseball";
          //Forcing values to be numbers
          leagueData.totalDivisions = Number(leagueData.totalDivisions);
          leagueData.totalLeagues = Number(leagueData.totalLeagues);
          leagueData.totalPlayers = Number(leagueData.totalPlayers);
          leagueData.totalTeams = Number(leagueData.totalTeams);

          return {
            headerData: leagueData,
            profileName: leagueData.profileNameShort,
            profileId: null,
            profileType: "league"
          };
        });
  }

  convertTeamPageHeader(data: TeamProfileData, pageName:string): TitleInputData {
    var description = data.headerData.description;
    var stats = data.headerData.stats;

    if (!stats) {
      return null;
    }
    if(typeof pageName == 'undefined'){
      pageName = '';
    }
    var teamId = data.pageParams.teamId ? data.pageParams.teamId.toString() : null;
    return {
      imageURL: data.fullProfileImageUrl, //TODO
      imageRoute: MLBGlobalFunctions.formatTeamRoute(data.teamName, teamId),
      text1: 'Last Updated:' + GlobalFunctions.formatUpdatedDate(data.headerData.lastUpdated),
      text2: 'United States',
      text3: pageName,
      icon: 'fa fa-map-marker'
    };
  }

  convertMLBHeader(data: LeagueProfileHeaderData, pageName:string): TitleInputData {
    return {
      imageURL: GlobalSettings.getImageUrl(data.logo, GlobalSettings._imgProfileLogo), //TODO
      imageRoute: ["MLB-page"],
      text1: 'Last Updated:' + GlobalFunctions.formatUpdatedDate(data.lastUpdated),
      text2: 'United States',
      text3: pageName,
      icon: 'fa fa-map-marker'
    };
  }

  convertToPlayerProfileHeader(data: PlayerProfileData): ProfileHeaderData {
    if (!data.headerData || !data.headerData.info) {
      return null;
    }

    var headerData = data.headerData;

    var stats = headerData.stats;
    var info = headerData.info;
    var formattedStartDate = info.draftYear ? info.draftYear : "N/A"; //[September 18, 2015]
    var formattedYearsInMLB = "N/A"; //[one]
    var firstSentence = "";
    var yearPluralStr = "years";
    var origin = window.location.origin;
    if(info.teamName){
      var teamNameMod = info.teamName.toLowerCase().split(' ').join('-');
      var urlMod = "team/" + teamNameMod + '/' + info.teamId.toString();
    }
    if ( info.draftYear && info.draftTeam ) {
      if(info.teamName == info.draftTeam && info.teamName != null){ // sometimes the data returns both draftTeam and teamName as the same team
        var teamName = "<a href='" + origin + '/' + urlMod + "'>" + info.teamName + "</a>";
      } else {
        var teamName = info.draftTeam;
      }
      var currentYear = headerData.stats.seasonId['season_id'];
      var yearsInMLB = (currentYear - Number(info.draftYear));
      formattedYearsInMLB = GlobalFunctions.formatNumber(yearsInMLB);
      if ( yearsInMLB == 1 ) {
        yearPluralStr = "year";
      }
      firstSentence = "<span class='text-heavy'>" + info.playerName +
                  "</span> started his MLB career in <span class='text-heavy'>" + formattedStartDate +
                  "</span> for the <span class='text-heavy'>" + teamName +
                  "</span>, accumulating <span class='text-heavy'>" + formattedYearsInMLB +
                  "</span> " + yearPluralStr + " in the MLB. "
    }
    else { // no draft year or team
      var teamName = "<a href='" + origin + '/' + urlMod + "'>" + info.teamName + "</a>";
      firstSentence = "<span class='text-heavy'>" + info.playerName +
                  "</span> currently plays for the <span class='text-heavy'>" + teamName +
                  "</span>. ";
    }

    var location = "N/A"; //[Wichita], [Kan.]
    if ( info.city && info.area ) {
      location = info.city + ", " + info.area;
    }

    var formattedBirthDate = "N/A"; //[October] [3], [1991]
    if ( info.birthDate ) {
      var date = moment(info.birthDate);
      formattedBirthDate = GlobalFunctions.formatAPMonth(date.month()) + date.format(" D, YYYY");
    }
    var formattedAge = info.age ? info.age.toString() : "N/A";

    var formattedHeight = MLBGlobalFunctions.formatHeightWithFoot(info.height); //[6-foot-11]

    var formattedWeight = info.weight ? info.weight.toString() : "N/A";

    var description = firstSentence + "<span class='text-heavy'>" + info.playerName +
                  "</span> was born in <span class='text-heavy'>" + location +
                  "</span> on <span class='text-heavy'>" + formattedBirthDate +
                  "</span> and is <span class='text-heavy'>" + formattedAge +
                  "</span> years old. He stands at <span class='text-heavy'>" + formattedHeight +
                  "</span>, <span class='text-heavy'>" + formattedWeight +
                  "</span> pounds.";

    var dataPoints: Array<DataItem>;
    var isPitcher = headerData.info.position.filter(value => value === "P").length > 0;

    var labelTime;
    if(stats.seasonId == null || typeof stats.seasonId == "undefined"){
      labelTime = "current";
    } else {
      switch(stats.seasonId['curr_season']){
        case 0:
          labelTime = Number(stats.seasonId['season_id']) - 1;
          break;
        case 1:
          labelTime = "current";
          break;
        case 2:
          labelTime = stats.seasonId['season_id'];
          break;
      }
    }


    if ( isPitcher ) {
      var formattedEra = null;
      if ( stats && stats.era != null ) {
        if ( stats.era > 1 ) {
          formattedEra = stats.era.toPrecision(3);
        }
        else {
          formattedEra = stats.era.toPrecision(2);
        }
      }
      dataPoints = [
        {
          label: "Wins/Losses",
          labelCont: "for the " + labelTime +  " season",
          value: (stats && stats.wins != null && stats.losses != null ) ? stats.wins + " - " + stats.losses : null
        },
        {
          label: "Innings Pitched",
          labelCont: "for the " + labelTime +  " season",
          value: (stats && stats.inningsPitched != null) ? stats.inningsPitched.toString() : null
        },
        {
          label: "Strikeouts",
          labelCont: "for the " + labelTime +  " season",
          value: (stats && stats.strikeouts != null) ? stats.strikeouts.toString() : null
        },
        {
          label: "Earned Run Average",
          labelCont: "for the " + labelTime +  " season",
          value: formattedEra
        }
      ];
    }
    else {
      dataPoints = [
        {
          label: "Home Runs",
          labelCont: "for the " + labelTime +  " season",
          value: (stats && stats.homeRuns != null) ? stats.homeRuns.toString() : null
        },
        {
          label: "Batting Average",
          labelCont: "for the " + labelTime +  " season",
          value: (stats && stats.average != null) ? stats.average.toPrecision(3) : null
        },
        {
          label: "RBIs",
          labelCont: "for the " + labelTime +  " season",
          value: (stats && stats.rbi != null) ? stats.rbi.toString() : null
        },
        {
          label: "Hits",
          labelCont: "for the " + labelTime +  " season",
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
      lastUpdatedDate: info.lastUpdate,
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
    var headerData = data.headerData;
    var stats = data.headerData.stats;

    if (!stats) {
      return null;
    }

    //The [Atlanta Braves] play in [Turner Field] located in [Atlanta, GA]. The [Atlanta Braves] are part of the [NL East].
    var location = "N/A";
    if ( headerData.teamCity && headerData.teamState ) {
      location = headerData.teamCity + ", " + headerData.teamState;
    }

    var group = "N/A";
    if ( stats.division && stats.conference ) {
      group = MLBGlobalFunctions.formatShortNameDivison(stats.conference.name, stats.division.name);
    }

    var venue = headerData.teamVenue ? headerData.teamVenue : "N/A";
    var description = "The <span class='text-heavy'>" + stats.teamName +
                      "</span> play in <span class='text-heavy'>" + venue +
                      "</span> located in <span class='text-heavy'>" + location +
                      "</span>. The <span class='text-heavy'>" + stats.teamName +
                      "</span> are part of the <span class='text-heavy'>" + group +
                       "</span>.";

    var formattedEra = null;
    if ( stats.pitching ) {
      if ( stats.pitching.era > 1 ) {
        formattedEra = stats.pitching.era.toPrecision(3);
      }
      else {
        formattedEra = stats.pitching.era.toPrecision(2);
      }
    }
    var labelTime;
    if(stats.seasonId != moment().format('YYYY')){
      labelTime = stats.seasonId;
    } else {
      labelTime = 'current';
    }

    var header: ProfileHeaderData = {
      profileName: stats.teamName,
      profileImageUrl: data.fullProfileImageUrl,
      backgroundImageUrl: data.fullBackgroundImageUrl,
      profileTitleFirstPart: data.headerData.teamFirstName,
      profileTitleLastPart: data.headerData.teamLastName,
      lastUpdatedDate: data.headerData.lastUpdated,
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
          labelCont: "for the " + labelTime +  " season",
          value: stats.batting ? stats.batting.average.toPrecision(3) : null
        },
        {
          label: "Runs",
          labelCont: "for the " + labelTime +  " season",
          value: stats.batting ? stats.batting.runsScored.toString() : null
        },
        {
          label: "Home Runs",
          labelCont: "for the " + labelTime +  " season",
          value: stats.batting ? stats.batting.homeRuns.toString() : null
        },
        {
          label: "Earned Run Average",
          labelCont: "for the " + labelTime +  " season",
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

    data.backgroundImage = GlobalSettings.getBackgroundImageUrl(data.backgroundImage, GlobalSettings._imgProfileMod);

    var description = "The MLB consists of " + GlobalFunctions.formatNumber(data.totalTeams) +
                      " teams and " + GlobalFunctions.formatNumber(data.totalPlayers) + " players. " +
                      "These teams and players are divided across " + GlobalFunctions.formatNumber(data.totalLeagues) +
                      " leagues and " + GlobalFunctions.formatNumber(data.totalDivisions) + " divisions.";

    var location = "N/A";
    if ( data.city && data.state ) {
      location = city + ", " + state;
    }

    var header: ProfileHeaderData = {
      profileName: "MLB",
      profileImageUrl: GlobalSettings.getImageUrl(data.logo, GlobalSettings._imgProfileLogo),
      backgroundImageUrl: data.backgroundImage,
      profileTitleFirstPart: "",
      profileTitleLastPart: "Major League Baseball",
      lastUpdatedDate: data.lastUpdated,
      description: description,
      topDataPoints: [
        {
          label: "League Headquarters",
          value: location
        },
        {
          label: "Founded In",
          value: data.foundingDate
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
