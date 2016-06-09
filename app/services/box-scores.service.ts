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

  constructor(public http: Http, private _globalFunc: GlobalFunctions){

  }

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      //headers.append(this.headerName, this.apiToken);
      return headers;
  }

  getBoxScoresService(profile, date, teamId?){
  //Configure HTTP Headers
  var headers = this.setToken();

  var callURL = this._apiUrl+'/'+profile+'/boxScores/2799/2016-05-27';

  console.log(callURL);
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      console.log("ORIGINAL DATA",data.data);
      var dateData = this.transformBoxScores(data.data);

      return {
        schedule: this.formatSchedule(dateData['05-27-2016'][0]),
        gameInfo: this.formatGameInfo(dateData['05-27-2016'][0], teamId),
        scoreBoard: this.formatScoreBoard(dateData['05-27-2016'][0]),
        fullData: data.data
      };
    })
  }

  transformBoxScores(boxScores){
    var newBoxScores = {};
    for(var dates in boxScores){
        var dayDate = moment.unix(dates).format('MM-DD-YYYY');
        if(typeof newBoxScores[dayDate] == 'undefined'){
           newBoxScores[dayDate] = [];
           newBoxScores[dayDate].push(boxScores[dates]);
        }
    }
    // console.log('NEW BOX SCORES',newBoxScores);
    return newBoxScores;
  }

  formatSchedule(data){
    let awayData = data.awayTeamInfo;
    let homeData = data.homeTeamInfo;
    // console.log('FORMAT SCHEDULE SERVICE DATA', data);
    // console.log('AWAY',awayData);
    // console.log('HOME',homeData);

    var awayRoute = MLBGlobalFunctions.formatTeamRoute(awayData.name, awayData.id);
    var home = {
      homeHex:homeData.colors.split(', ')[0], //parse out comma + space to grab only hex colors
      homeID:homeData.id,
      homeLocation:homeData.firstName, // first name of team usually represents the location
      homeLogo:GlobalSettings.getImageUrl(homeData.logo),
      homeLosses:15,//TODO
      homeName:homeData.lastName,
      homeWins:34//TODO
    };
    var away = {
      awayHex:awayData.colors.split(', ')[0],
      awayID:awayData.id,
      awayLocation:awayData.firstName,
      awayLogo: this.imageData("image-62", "border-logo", GlobalSettings.getImageUrl(awayData.logo), awayRoute),
      awayLosses:19,//TODO
      awayName:awayData.lastName,
      awayWins:30//TODO
    };
    away['url'] = awayRoute;
    return {
      home:[home],
      away:[away]
    };
  }

  formatGameInfo(data, teamId){
    var info:GameInfoInput;
    let awayData = data.awayTeamInfo;
    let homeData = data.homeTeamInfo;
    let gameInfo = data.gameInfo;
    // console.log('FORMAT SCHEDULE SERVICE DATA', data);
    // console.log('AWAY',awayData);
    // console.log('HOME',homeData);
    if(homeData.id == teamId){
      //imageData(imageClass, imageBorder, mainImg, mainImgRoute?, rank?, rankClass?, subImgClass?, subImg?, subRoute?)
      var link1 = this.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(homeData.logo))
      var link2 = this.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(awayData.logo), MLBGlobalFunctions.formatTeamRoute(awayData.name, awayData.id))
    }else{
      var link1 = this.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(homeData.logo), MLBGlobalFunctions.formatTeamRoute(homeData.name, homeData.id))
      var link2 = this.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(awayData.logo))
    }

    info = {
      inning:gameInfo.inningsPlayed + " Inning",
      homeData:{
        homeTeamName: homeData.lastName,
        //imageData(imageClass, imageBorder, mainImg, mainImgRoute?, rank?, rankClass?, subImgClass?, subImg?, subRoute?)
        homeImageConfig:link1,
        homeRecord:'[#]-[#]',
        runs:homeData.score,
        hits:homeData.hits,
        errors:homeData.errors
      },
      awayData:{
        awayTeamName:awayData.lastName,
        awayImageConfig:link2,
        awayRecord:'[#]-[#]',
        runs:awayData.score,
        hits:awayData.hits,
        errors:awayData.errors
      }
    };
    // console.log('GAME INFO',info);
    return info;
  }

  formatArticle(data){
    console.log(data);
    return data;
  }

  formatScoreBoard(data){
    console.log('SCORE BOARD',data);
    let awayData = data.awayTeamInfo;
    let homeData = data.homeTeamInfo;
    let gameInfo = data.gameInfo;

    var arrayScores = [];

    for(var score in data){
      if(score != 'aiContent' && score != 'awayTeamInfo' && score != 'homeTeamInfo' && score != 'gameInfo'){
        arrayScores.push({
          inning:score.replace('p',''),//replace the letter 'p' in each inning
          scores:data[score]
        });
      }
    }

    arrayScores.push({
      inning:10,//replace the letter 'p' in each inning
      scores:{
        home:1,
        away:4,
      }
    })
    arrayScores.push({
      inning:11,//replace the letter 'p' in each inning
      scores:{
        home:3,
        away:1,
      }
    })
    arrayScores.push({
      inning:12,//replace the letter 'p' in each inning
      scores:{
        home:1,
        away:0,
      }
    })
    arrayScores.push({
      inning:13,//replace the letter 'p' in each inning
      scores:{
        home:1,
        away:0,
      }
    })
    arrayScores.push({
      inning:14,//replace the letter 'p' in each inning
      scores:{
        home:null,
        away:null,
      }
    })
    arrayScores.push({
      inning:15,//replace the letter 'p' in each inning
      scores:{
        home:null,
        away:null,
      }
    })

    console.log("SCORES",arrayScores);
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
    console.log(image);
    return image;
  }
}
