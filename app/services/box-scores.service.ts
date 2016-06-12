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

  getBoxScoresService(profile, date, teamId?){//DATE
  //Configure HTTP Headers
  var headers = this.setToken();

  if(teamId != null){
    teamId = '/' + teamId;
  }
  var callURL = this._apiUrl+'/'+profile+'/boxScores'+teamId+'/'+ date;//localToEST needs tobe the date coming in AS UNIX

  console.log(callURL);
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      console.log("ORIGINAL DATA",data.data);
      var transformedDate = this.transformBoxScores(data.data);// transform the data to YYYY-MM-DD objects instead of unix
      console.log("Transformed DATA",transformedDate);
      var validateDate = this.validateDate(date, transformedDate);
      return {
        schedule: this.formatSchedule(transformedDate['2016-06-09'][0]),
        gameInfo: this.formatGameInfo(transformedDate['2016-06-09'][0], teamId),
        scoreBoard: this.formatScoreBoard(transformedDate['2016-06-09'][0]),
        fullData: data.data
      };
    })
  }

  validateDate(selectedDate, dateArray){// get unix time stamp and grab the earlier played game
    selectedDate = '2016-07-01';
    console.log('Selected Date and Array',selectedDate,dateArray);
    var validatedDate = 0;// will be the closest game to the curdate being sent in
    var curUnix = moment(selectedDate,"YYYY-MM-DD").unix();//converts chosen date to unix for comparison
    console.log('curUnix',curUnix);
    for(var date in dateArray){
      var dateUnix = moment(date,"YYYY-MM-DD").unix();//converts chosen date to unix for comparison
      console.log('dates to Unix',dateUnix);
      if( (curUnix == dateUnix) && (validatedDate <= dateUnix) ){// makes sure to  that the validatedDate does not choose anything higher than selected date
        validatedDate = dateUnix;
        console.log('FOUND CURRENT DATE',validatedDate);
      }else{
        if( validatedDate < dateUnix ){//will keep choosing the highest number in the current array
          console.log('Date now:', dateUnix);
          validatedDate = dateUnix;
        }
      }
    }

    //change validatedDate back into format for dateArray;
    console.log('FINAL validatedDate UNIX', validatedDate);
    validatedDate = moment.unix(validatedDate).format('YYYY-MM-DD');
    console.log('FINAL validatedDate',validatedDate);
    return validatedDate;//SENDS BACK AS YYYY-MM-DD to use in transformed converted date array
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

  console.log(callURL);
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      console.log("DATA!!!!!", data);
      return data;
    })
  }

  validateMonth(profile, date, teamId?){
  //Configure HTTP Headers
  var headers = this.setToken();

  var callURL = this._apiUrl+'/'+profile+'/boxScores/'+teamId+'/'+ date;//localToEST needs tobe the date coming in AS UNIX

  console.log(callURL);
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {

      return {

      };
    })
  }

  transformBoxScores(boxScores){
    var newBoxScores = {};
    for(var dates in boxScores){
      var dayUnix = moment.unix(dates)/1000;//convert to Unix and convert to seconds
        var dayDate = moment(dayUnix).format('YYYY-MM-DD');
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
