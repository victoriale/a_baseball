import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Gradient} from '../global/global-gradient';
import {CircleImageData} from '../components/images/image-data';
import {GameInfoInput} from '../components/game-info/game-info.component';

declare var moment;
@Injectable()
export class BoxScoresService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  // private _apiToken: string = 'BApA7KEfj';
  // private _headerName: string = 'X-SNT-TOKEN';

  constructor(public http: Http){

  }

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      //headers.append(this.headerName, this.apiToken);
      return headers;
  }

  getBoxScoresService(profile, date, teamId?){//DATE
  //Configure HTTP Headers
  var headers = this.setToken();

  if(teamId != null){
    teamId = '/' + teamId;
  }
  //date needs to be the date coming in AS EST and come back as UTC
  var callURL = this._apiUrl+'/'+profile+'/boxScores'+teamId+'/'+ date;
  // console.log(callURL);
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      // transform the data to YYYY-MM-DD objects from unix
      var transformedDate = this.transformBoxScores(data.data);
      return {
        transformedDate:transformedDate
      };
    })
  }

  moduleHeader(date, team?){
    var moduleTitle;
    var convertedDate = moment(date,"YYYY-MM-DD").format("MMMM Do, YYYY");

    moduleTitle = "Box Scores - " + team + ' : ' +convertedDate;
    return {
      moduleTitle: moduleTitle,
      hasIcon: false,
      iconClass: '',
    };
  }
  /**
  *
  */
  weekCarousel(profile, date, teamId?){
  //Configure HTTP Headers
  var headers = this.setToken();

  if(teamId != null){
    teamId = '/' + teamId;
  }
  var callURL = this._apiUrl+'/'+profile+'/gameDatesWeekly'+teamId+'/'+ date;//localToEST needs tobe the date coming in AS UNIX

  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      return data;
    })
  }

  validateMonth(profile, date, teamId?){
  //Configure HTTP Headers
  var headers = this.setToken();

  var callURL = this._apiUrl+'/'+profile+'/boxScores/'+teamId+'/'+ date;//localToEST needs tobe the date coming in AS UNIX

  // console.log(callURL);
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      return data;
    })
  }

  transformBoxScores(boxScores){
    var newBoxScores = {};
    for(var dates in boxScores){
      var dayUnix = moment.unix(dates)/1000;//convert to Unix and convert to seconds
        var dayDate = moment.tz( dayUnix , 'America/New_York' ).format('YYYY-MM-DD');
        if(typeof newBoxScores[dayDate] == 'undefined'){
           newBoxScores[dayDate] = [];
           newBoxScores[dayDate].push(boxScores[dates]);
        }
    }
    // console.log('NEW BOX SCORES',newBoxScores);
    return newBoxScores;
  }

    //TO MATCH HTML the profile client is on will be detected by teamID and a left and right format will be made with the home and away team data
  formatSchedule(data, teamId){
    let awayData = data.awayTeamInfo;
    let homeData = data.homeTeamInfo;
    var left, right;
    if(homeData.id == teamId){//detection to know which profile needs to no have links
      var rightRoute = MLBGlobalFunctions.formatTeamRoute(awayData.name, awayData.id);
      left = {
        homeHex:homeData.colors.split(', ')[0], //parse out comma + space to grab only hex colors
        homeID:homeData.id,
        homeLocation:homeData.firstName, // first name of team usually represents the location
        homeLogo:GlobalSettings.getImageUrl(homeData.logo),
        homeLosses:homeData.lossRecord,
        homeName:homeData.lastName,
        homeWins:homeData.winRecord
      };
      right = {
        awayHex:awayData.colors.split(', ')[0],
        awayID:awayData.id,
        awayLocation:awayData.firstName,
        awayLogo: this.imageData("image-62", "border-logo", GlobalSettings.getImageUrl(awayData.logo), rightRoute),
        awayLosses:awayData.lossRecord,
        awayName:awayData.lastName,
        awayWins:awayData.winRecord
      };
    }else{
      var rightRoute = MLBGlobalFunctions.formatTeamRoute(homeData.name, homeData.id);
      left = {
        homeHex:awayData.colors.split(', ')[0],
        homeID:awayData.id,
        homeLocation:awayData.firstName,
        homeLogo: GlobalSettings.getImageUrl(awayData.logo),
        homeLosses:awayData.lossRecord,
        homeName:awayData.lastName,
        homeWins:awayData.winRecord
      };
      right = {
        awayHex:homeData.colors.split(', ')[0], //parse out comma + space to grab only hex colors
        awayID:homeData.id,
        awayLocation:homeData.firstName, // first name of team usually represents the location
        awayLogo:this.imageData("image-62", "border-logo", GlobalSettings.getImageUrl(homeData.logo), rightRoute),
        awayLosses:homeData.lossRecord,
        awayName:homeData.lastName,
        awayWins:homeData.winRecord
      };
    }
    // convert data given into format needed for the schedule banner on module
    right['url'] = rightRoute;
    return {
      home:[left],
      away:[right]
    };
  }

  formatGameInfo(data, teamId){
    var info:GameInfoInput;
    let awayData = data.awayTeamInfo;
    let homeData = data.homeTeamInfo;
    let gameInfo = data.gameInfo;

    if(homeData.id == teamId){
      //imageData(imageClass, imageBorder, mainImg, mainImgRoute?, rank?, rankClass?, subImgClass?, subImg?, subRoute?)
      var link1 = this.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(homeData.logo))
      var link2 = this.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(awayData.logo), MLBGlobalFunctions.formatTeamRoute(awayData.name, awayData.id))
    }else{
      var link1 = this.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(homeData.logo), MLBGlobalFunctions.formatTeamRoute(homeData.name, homeData.id))
      var link2 = this.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(awayData.logo))
    }

    let gameDate = data.gameInfo;
    info = {
      gameHappened:gameInfo.inningsPlayed != null ?  true : false,
      //inning will display the Inning the game is on otherwise if returning null then display the date Time the game is going to be played
      inning:gameInfo.inningsPlayed != null ?  "Top of " + gameInfo.inningsPlayed +  GlobalFunctions.Suffix(gameInfo.inningsPlayed) + " Inning" : "Game Time: " + moment.unix(gameDate.startDateTimestamp/1000).tz('America/New_York').format('h:mm A z'),
      homeData:{
        homeTeamName: homeData.lastName,
        //imageData(imageClass, imageBorder, mainImg, mainImgRoute?, rank?, rankClass?, subImgClass?, subImg?, subRoute?)
        homeImageConfig:link1,
        homeRecord:homeData.winRecord+'-'+homeData.lossRecord,
        runs:homeData.score,
        hits:homeData.hits,
        errors:homeData.errors
      },
      awayData:{
        awayTeamName:awayData.lastName,
        awayImageConfig:link2,
        awayRecord:awayData.winRecord+'-'+awayData.lossRecord,
        runs:awayData.score,
        hits:awayData.hits,
        errors:awayData.errors
      }
    };
    // console.log('GAME INFO',info);
    return info;
  }

  formatArticle(data){
    // console.log(data);
    return data;
  }

  formatScoreBoard(data){
    let awayData = data.awayTeamInfo;
    let homeData = data.homeTeamInfo;
    let gameInfo = data.gameInfo;

    var arrayScores = [];

    //for live games show the total scored added up for each inning
    var homeLiveScore = 0;
    var awayLiveScore = 0;
    for(var score in data){
      if(score != 'aiContent' && score != 'awayTeamInfo' && score != 'homeTeamInfo' && score != 'gameInfo'){
        arrayScores.push({
          inning:score.replace('p',''),//replace the letter 'p' in each inning
          scores:data[score]
        });
      }
    }

    // arrayScores.push({
    //   inning:10,//replace the letter 'p' in each inning
    //   scores:{
    //     home:1,
    //     away:4,
    //   }
    // })

    var scoreBoard={
      homeScore:homeData.score,
      awayScore:awayData.score,
      scoreArray:arrayScores,
    };
    return scoreBoard;
  }

  /**
   *this function will have inputs of all required fields that are dynamic and output the full
  **/
  imageData(imageClass, imageBorder, mainImg, mainImgRoute?){
    if(typeof mainImg =='undefined' || mainImg == ''){
      mainImg = "/app/public/no-image.png";
    }
    var image: CircleImageData = {//interface is found in image-data.ts
        imageClass: imageClass,
        mainImage: {
            imageUrl: mainImg,
            urlRouteArray: mainImgRoute,
            hoverText: "<i class='fa fa-mail-forward'></i>",
            imageClass: imageBorder,
        },
    };
    return image;
  }
}
