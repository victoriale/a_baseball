import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
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
  }else{
    teamId = '';
  }
  //player profile are treated as teams
  if(profile == 'player'){
    profile = 'team'
  }else if (profile == 'league'){
    date += '/addAi'
  }

  //date needs to be the date coming in AS EST and come back as UTC
  var callURL = this._apiUrl+'/'+profile+'/boxScores'+teamId+'/'+ date;
  //console.log(callURL);
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      // transform the data to YYYY-MM-DD objects from unix
      var transformedDate = this.transformBoxScores(data.data);
      return {
        transformedDate:transformedDate,
        aiArticle: profile == 'league' ? data.aiContent : null
      };
    })
  }

  //function  for BoxScoresService to use on profile pages
  getBoxScores(boxScoresData, profileName: string, dateParam, callback: Function) {
    if(boxScoresData == null){
      boxScoresData = {};
      boxScoresData['transformedDate']={};
    }
    if ( boxScoresData == null || boxScoresData.transformedDate[dateParam.date] == null ) {
      this.getBoxScoresService(dateParam.profile, dateParam.date, dateParam.teamId)
        .subscribe(data => {
          if(data.transformedDate[dateParam.date] != null){
            let currentBoxScores = {
              scoreBoard: dateParam.profile != 'league' && data.transformedDate[dateParam.date] != null ? this.formatScoreBoard(data.transformedDate[dateParam.date][0]) : null,
              moduleTitle: this.moduleHeader(dateParam.date, profileName),
              gameInfo: this.formatGameInfo(data.transformedDate[dateParam.date],dateParam.teamId, dateParam.profile),
              gameInfoSmall: this.formatGameInfoSmall(data.transformedDate[dateParam.date],dateParam.teamId, dateParam.profile),
              schedule: dateParam.profile != 'league' && data.transformedDate[dateParam.date] != null? this.formatSchedule(data.transformedDate[dateParam.date][0], dateParam.teamId, dateParam.profile) : null,
              aiContent: dateParam.profile == 'league' ? this.aiHeadline(data.aiArticle) : null,
            };
            currentBoxScores = currentBoxScores.gameInfo != null ? currentBoxScores :null;
            callback(data, currentBoxScores);
          }
        })
    }
    else {
      if(boxScoresData.transformedDate[dateParam.date] != null){
        let currentBoxScores = {
          scoreBoard: dateParam.profile != 'league' && boxScoresData.transformedDate[dateParam.date] != null ? this.formatScoreBoard(boxScoresData.transformedDate[dateParam.date][0]) : null,
          moduleTitle: this.moduleHeader(dateParam.date, profileName),
          gameInfo: this.formatGameInfo(boxScoresData.transformedDate[dateParam.date],dateParam.teamId, dateParam.profile),
          gameInfoSmall: this.formatGameInfoSmall(boxScoresData.transformedDate[dateParam.date],dateParam.teamId, dateParam.profile),
          schedule: dateParam.profile != 'league' && boxScoresData.transformedDate[dateParam.date] != null? this.formatSchedule(boxScoresData.transformedDate[dateParam.date][0], dateParam.teamId, dateParam.profile) : null,
          aiContent: dateParam.profile == 'league' ? this.aiHeadline(boxScoresData.aiArticle) : null,
        };
        currentBoxScores = currentBoxScores.gameInfo != null ? currentBoxScores :null;
        callback(boxScoresData, currentBoxScores);
      }
    }
  }

  /**
  * modifies data to get header data for modules
  */
  aiHeadline(data){
    var boxArray = [];
    var sampleImage = "/app/public/placeholder_XL.png";
    if (data != null) {
      data.forEach(function(val, index){
        for(var p in val.featuredReport){
          var eventType = val.featuredReport[p];
          var teaser = eventType.displayHeadline;
        }
      var date = GlobalFunctions.formatDate(val.timestamp*1000);
      var Box = {
        keyword: p,
        date: date.month + " " + date.day + ", " + date.year,
        url: MLBGlobalFunctions.formatAiArticleRoute(p, val.event),
        teaser: teaser,
        imageConfig:{
          imageClass: "image-320x180-sm",
          imageUrl: val.home.images[0] != null ? val.home.images[0] : sampleImage,
          hoverText: "View Article",
          urlRouteArray: MLBGlobalFunctions.formatAiArticleRoute(p, val.event)
        }
      }
      boxArray.push(Box);
      });
    }
    return boxArray;

  }
  moduleHeader(date, team?){
    var moduleTitle;
    var month = moment(date,"YYYY-MM-DD").tz('America/New_York').format("MMMM");
    var day = moment(date,"YYYY-MM-DD").tz('America/New_York').format("D");
    var ordinal = moment(date,"YYYY-MM-DD").tz('America/New_York').format("D");
    ordinal = '<sup>' + GlobalFunctions.Suffix(ordinal) + '</sup>';
    var year = moment(date,"YYYY-MM-DD").tz('America/New_York').format("YYYY");
    var convertedDate = month + ' ' + day + ordinal + ', ' + year;

    moduleTitle = "Box Scores - " + team + ': ' +convertedDate;
    return {
      moduleTitle: moduleTitle,
      hasIcon: false,
      iconClass: '',
    };
  }

  /**
  * api to grab the dates that have games for box scores
  * sends back => unixdate: true/false
  */
  weekCarousel(profile, date, teamId?){
  //Configure HTTP Headers
  var headers = this.setToken();

  if(teamId != null){
    teamId = '/' + teamId;
  }else{
    teamId = '';
  }

  //player profile are treated as teams
  if(profile == 'player'){
    profile = 'team'
  }

  var callURL = this._apiUrl+'/'+profile+'/gameDatesWeekly'+teamId+'/'+ date;
  // console.log(callURL);
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      return data;
    })
  }

  validateMonth(profile, date, teamId?){
  //Configure HTTP Headers
  var headers = this.setToken();

  if(teamId != null){
    teamId = '/' + teamId;
  }else{
    teamId = '';
  }
  //player profile are treated as teams
  if(profile == 'player'){
    profile = 'team'
  }

  var callURL = this._apiUrl+'/'+profile+'/gameDates'+teamId+'/'+ date;//localToEST needs tobe the date coming in AS UNIX
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
        var dayDate = moment(Number(dates)).tz('America/New_York').format('YYYY-MM-DD');
        if(typeof newBoxScores[dayDate] == 'undefined'){
           newBoxScores[dayDate] = [];
           newBoxScores[dayDate].push(boxScores[dates]);
        }else{
          newBoxScores[dayDate].push(boxScores[dates]);
        }
    }
    return newBoxScores;
  }

    //TO MATCH HTML the profile client is on will be detected by teamID and a left and right format will be made with the home and away team data
  formatSchedule(data, teamId?, profile?){
    let awayData = data.awayTeamInfo;
    let homeData = data.homeTeamInfo;
    var left, right;
    var homeRoute = MLBGlobalFunctions.formatTeamRoute(homeData.name, homeData.id);
    var awayRoute = MLBGlobalFunctions.formatTeamRoute(awayData.name, awayData.id);
    if(profile == 'team'){
      if(teamId == homeData.id){
        homeRoute = null;
      }else{
        awayRoute = null;
      }
    }
      var homeLogo = this.imageData("image-68", "border-logo", GlobalSettings.getImageUrl(homeData.logo), homeRoute);
      var awayLogo = this.imageData("image-68", "border-logo", GlobalSettings.getImageUrl(awayData.logo), awayRoute);
      right = {
        homeHex:homeData.colors.split(', ')[0], //parse out comma + space to grab only hex colors
        homeID:homeData.id,
        homeLocation:homeData.firstName, // first name of team usually represents the location
        homeLogo:homeLogo,
        url:homeRoute,
        homeLosses:homeData.lossRecord,
        homeName:homeData.lastName,
        homeWins:homeData.winRecord
      };
      left = {
        awayHex:awayData.colors.split(', ')[0],
        awayID:awayData.id,
        awayLocation:awayData.firstName,
        awayLogo: awayLogo,
        url:awayRoute,
        awayLosses:awayData.lossRecord,
        awayName:awayData.lastName,
        awayWins:awayData.winRecord
      };
    // convert data given into format needed for the schedule banner on module
    return {
      home:[right],
      away:[left]
    };
  }



  formatGameInfo(game, teamId?, profile?){
    var gameArray:Array<any> = [];
    let self = this;
    var twoBoxes = [];// used to put two games into boxes

    // Sort games by time
    let sortedGames = game.sort(function(a, b) {
      return new Date(a.gameInfo.startDateTime).getTime() - new Date(b.gameInfo.startDateTime).getTime();
    });

    sortedGames.forEach(function(data,i){

      var info:GameInfoInput;
      let awayData = data.awayTeamInfo;
      let homeData = data.homeTeamInfo;
      let gameInfo = data.gameInfo;
      let homeLink = MLBGlobalFunctions.formatTeamRoute(homeData.name, homeData.id);
      let awayLink = MLBGlobalFunctions.formatTeamRoute(awayData.name, awayData.id);
      var aiContent = data.aiContent != null ? self.formatArticle(data):null;

      if(teamId != null && profile == 'team'){//if league then both items will link
        if(homeData.id == teamId){//if not league then check current team they are one
          homeLink = null;
          var link1 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(homeData.logo))
          var link2 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(awayData.logo), awayLink)
        }else{
          awayLink = null;
          var link1 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(homeData.logo), homeLink)
          var link2 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(awayData.logo))
        }
      }else{
        var aiContent = data.aiContent != null ? self.formatArticle(data):null;
        var link1 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(homeData.logo), homeLink)
        var link2 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(awayData.logo), awayLink)
      }

      let gameDate = data.gameInfo;

      let homeWin = homeData.winRecord != null ? homeData.winRecord : '#';
      let homeLoss = homeData.lossRecord != null ? homeData.lossRecord : '#';

      let awayWin = awayData.winRecord != null ? awayData.winRecord : '#';
      let awayLoss = awayData.lossRecord != null ? awayData.lossRecord : '#';

      //determine if a game is live or not and display correct game time
      var currentTime = new Date().getTime();
      var inningTitle = '';

      if(gameInfo.live){
        let inningHalf = gameInfo.inningHalf != null ? GlobalFunctions.toTitleCase(gameInfo.inningHalf) : 'Top';
        inningTitle = gameInfo.inningsPlayed != null ?  inningHalf + " of " + gameInfo.inningsPlayed +  GlobalFunctions.Suffix(gameInfo.inningsPlayed) + " Inning" : '';

      }else{
        if((currentTime < gameInfo.startDateTimestamp) && !gameInfo.live){
          inningTitle = moment(gameDate.startDateTimestamp).tz('America/New_York').format('h:mm A z');
        }else{
          inningTitle = 'Final';
        }
      }

      info = {
        gameHappened:gameInfo.inningsPlayed != null ?  true : false,
        //inning will display the Inning the game is on otherwise if returning null then display the date Time the game is going to be played
        inning:inningTitle,
        homeData:{
          homeTeamName: homeData.lastName,
          homeImageConfig:link1,
          homeLink: homeLink,
          homeRecord: homeWin +'-'+ homeLoss,
          runs:homeData.score,
          hits:homeData.hits,
          errors:homeData.errors
        },
        awayData:{
          awayTeamName:awayData.lastName,
          awayImageConfig:link2,
          awayLink: awayLink,
          awayRecord: awayWin +'-'+ awayLoss,
          runs:awayData.score,
          hits:awayData.hits,
          errors:awayData.errors
        }
      };
      if(teamId != null){
        twoBoxes.push({game:info,aiContent:aiContent});
      }else{
        twoBoxes.push({game:info});
        if(twoBoxes.length > 1 || (i+1) == game.length){// will push into main array once 2 pieces of info has been put into twoBoxes variable
          gameArray.push(twoBoxes);
          twoBoxes = [];
        }
      }
      //incase it runs through entire loops and only 2 or less returns then push whatever is left
      if(game.length == (i+1)  && gameArray.length == 0){
        gameArray.push(twoBoxes);
      }
    })
    return gameArray;
  }

  formatGameInfoSmall(game, teamId?, profile?){
    var gameArray:Array<any> = [];
    let self = this;
    var twoBoxes = [];// used to put two games into boxes

    // Sort games by time
    let sortedGames = game.sort(function(a, b) {
      return new Date(a.gameInfo.startDateTime).getTime() - new Date(b.gameInfo.startDateTime).getTime();
    });

    sortedGames.forEach(function(data,i){

      var info:GameInfoInput;
      let awayData = data.awayTeamInfo;
      let homeData = data.homeTeamInfo;
      let gameInfo = data.gameInfo;
      let homeLink = MLBGlobalFunctions.formatTeamRoute(homeData.name, homeData.id);
      let awayLink = MLBGlobalFunctions.formatTeamRoute(awayData.name, awayData.id);
      var aiContent = data.aiContent != null ? self.formatArticle(data):null;

      if(teamId != null && profile == 'team'){//if league then both items will link
        if(homeData.id == teamId){//if not league then check current team they are one
          homeLink = null;
          var link1 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(homeData.logo))
          var link2 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(awayData.logo), awayLink)
        }else{
          awayLink = null;
          var link1 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(homeData.logo), homeLink)
          var link2 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(awayData.logo))
        }
      }else{
        var aiContent = data.aiContent != null ? self.formatArticle(data):null;
        var link1 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(homeData.logo), homeLink)
        var link2 = self.imageData('image-45', 'border-1', GlobalSettings.getImageUrl(awayData.logo), awayLink)
      }

      let gameDate = data.gameInfo;

      let homeWin = homeData.winRecord != null ? homeData.winRecord : '#';
      let homeLoss = homeData.lossRecord != null ? homeData.lossRecord : '#';

      let awayWin = awayData.winRecord != null ? awayData.winRecord : '#';
      let awayLoss = awayData.lossRecord != null ? awayData.lossRecord : '#';

      //determine if a game is live or not and display correct game time
      var currentTime = new Date().getTime();
      var inningTitle = '';

      if(gameInfo.live){
        let inningHalf = gameInfo.inningHalf != null ? GlobalFunctions.toTitleCase(gameInfo.inningHalf) : 'Top';
        inningTitle = gameInfo.inningsPlayed != null ?  inningHalf + " of " + gameInfo.inningsPlayed +  GlobalFunctions.Suffix(gameInfo.inningsPlayed) + " Inning" : '';

      }else{
        if((currentTime < gameInfo.startDateTimestamp) && !gameInfo.live){
          inningTitle = moment(gameDate.startDateTimestamp).tz('America/New_York').format('h:mm A z');
        }else{
          inningTitle = 'Final';
        }
      }

      info = {
        gameHappened:gameInfo.inningsPlayed != null ?  true : false,
        //inning will display the Inning the game is on otherwise if returning null then display the date Time the game is going to be played
        inning:inningTitle,
        homeData:{
          homeTeamName: homeData.lastName,
          homeImageConfig:link1,
          homeLink: homeLink,
          homeRecord: homeWin +'-'+ homeLoss,
          runs:homeData.score,
          hits:homeData.hits,
          errors:homeData.errors
        },
        awayData:{
          awayTeamName:awayData.lastName,
          awayImageConfig:link2,
          awayLink: awayLink,
          awayRecord: awayWin +'-'+ awayLoss,
          runs:awayData.score,
          hits:awayData.hits,
          errors:awayData.errors
        }
      };
      if(teamId != null){
        gameArray.push({game:info,aiContent:aiContent});
      }else{
        gameArray.push({game:info});
      }
    })
    return gameArray;
  }

  formatArticle(data){
    let gameInfo = data.gameInfo;
    let aiContent = data.aiContent;
    var gameArticle = {};
    for(var report in aiContent.featuredReport){
      gameArticle['report'] = "Read The Report";
      gameArticle['headline'] = aiContent.featuredReport[report].displayHeadline;
      gameArticle['articleLink'] = ['Article-pages',{eventType:report,eventID:aiContent.event}];
      var i = aiContent['home']['images'];
      var random1 = Math.floor(Math.random() * i.length);
      var random2 = Math.floor(Math.random() * i.length);
      gameArticle['images'] = [];

      if(random1 == random2){
        gameArticle['images'].push(i[random1]);
      }else{
        gameArticle['images'].push(i[random1]);
        gameArticle['images'].push(i[random2]);
      }
    }
    return gameArticle;
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

    var scoreBoard={
      homeLastName: homeData.lastName,
      awayLastName: awayData.lastName,
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
