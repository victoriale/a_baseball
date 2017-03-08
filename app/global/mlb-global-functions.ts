import {Injectable} from '@angular/core';
import {GlobalFunctions} from './global-functions';
import {Division, Conference} from './global-interface';
import {GlobalSettings} from "./global-settings";
@Injectable()

export class MLBGlobalFunctions {
  private static _env = window.location.hostname.split('.')[0];
  private static _proto = window.location.protocol;

  constructor() {

  }

  static getEnv(env:string):string {
    if (env == "localhost" || env =="qa"){
      env = "dev-";
    }
    if (env != "dev-"){
      env = "";
    }
    return env;
  }

  /**
   * - Pass in datapoints to required parameters and formats
   * them into a single route that is in lowerCase Kebab.
   * - If parameters given do not fit the requirements them default to the error page.
   * - Otherwise takes teamName as a string
   *
   * @example
   * // teamName => 'Boston Red Sox'
   * formatTeamRoute('Boston Red Sox', 2124)
   *
   *
   * @param {teamName} teamName - team name given from data that will be converted to lower kebab case
   * @param {teamId} teamId - team ID the required field needed to successfully navigate to team profile
   * @returns the teamName => boston-red-sox,  teamId => ##, routeName => 'Team-page'
   */
  static formatTeamRoute(teamName: string, teamId: string): Array<any> {
    var teamRoute: Array<any>;
    if(typeof teamName != 'undefined' && teamName != null){
      teamName = GlobalFunctions.toLowerKebab(teamName);
      teamRoute = ['Team-page', {teamName: teamName, teamId: teamId}];//NOTE: if Team-page is on the same level as the rest of the route-outlets
    } else{
      teamRoute = null;
    }
    return teamRoute ? teamRoute : ['Error-page'];
  }

  /**
   * - Pass in datapoints to required parameters and formats
   * them into a single route.
   * - If parameters given do not fit the requirements them default to the error page.
   * - Otherwise takes articleId as a string
   *
   * @example
   * // articleId => '1234'
   * formatNewsRoute("1234")
   *
   *
   * @param {teamName} teamName - team name given from data that will be converted to lower kebab case
   * @param {teamId} teamId - team ID the required field needed to successfully navigate to team profile
   * @returns the teamName => boston-red-sox,  teamId => ##, routeName => 'Team-page'
   */
  static formatNewsRoute(articleId: string): Array<any> {
    var articleRoute: Array<any>;
    if(articleId != null) {
      articleRoute = ['Syndicated-article-page', {articleType: 'story', eventID: articleId}];//NOTE: if Team-page is on the same level as the rest of the route-outlets
    } else{
      articleRoute = null;
    }
    return articleRoute ? articleRoute : ['Error-page'];
  }


  /**
     * - Pass in datapoints to required parameters and formats
   * them into a single route that is in lowerCase Kebab.
   * - If parameters given do not fit the requirements them default to the error page.
   * - Otherwise takes teamName && playerName as a string
   *
   * @example
   * // teamName => 'Boston Red Sox'
   * // playerName => 'Babe Ruth'
   * formatTeamRoute('Boston Red Sox')
   *
   *
   * @param {teamName} teamName - team name given from data that will be converted to lower kebab case
   * @param {teamId} teamId - team ID the required field needed to successfully navigate to team profile
   * @returns the teamName => 'boston-red-sox',  playerName => 'babe-ruth' playerId => ##, routeName => 'Player-page'
   */
  static formatPlayerRoute(teamName: string, playerFullName:string, playerId: string):Array<any> {
    var playerRoute: Array<any>;

    if(typeof teamName != 'undefined' && teamName != null && typeof playerFullName != 'undefined' && playerFullName != null){
      teamName = GlobalFunctions.toLowerKebab(teamName);
      playerFullName = GlobalFunctions.toLowerKebab(playerFullName);
      playerRoute = ['Player-page',{teamName:teamName, fullName:playerFullName, playerId: playerId}];//NOTE: if Player-page is on the same level as the rest of the route-outlets
    }else{
      playerRoute = null;
    }
    return playerRoute ? playerRoute : ['Error-page'];
  }

  /**
   * - Pass in datapoints to required parameters and formats
   * them into a single route.
   * - If parameters given do not fit the requirements then default to the error page.
   * - Otherwise takes eventType as a string
   *
   * @example
   * // eventType => 'pregame-report'
   * formatTeamRoute('pregame-report', 61008)
   *
   *
   * @param {eventType} eventType - event type given from data
   * @param {eventID} eventID - event ID the required field needed to successfully navigate to artcile page
   * @returns the eventType => pregame-report,  teamId => ##, routeName => 'Article-page'
   */
  static formatArticleRoute(eventType: string, eventID: string): Array<any> {
    var articleRoute: Array<any>;
    if(typeof eventType != 'undefined' && eventType != null){
      articleRoute = ['Article-pages', {eventType: eventType, eventID: eventID}];
    } else{
      articleRoute = null;
    }
    return articleRoute ? articleRoute : ['Error-page'];
  }

  /**
   * - Formats the height string by removing the dashes and adding
   * tick marks for feet and inches.
   * - If heightStr is null or empty, "N/A" is returned.
   * - If no dash, the string is returned unchanged
   *
   * @example
   * // 6'8"
   * formatHeight('6-8')
   *
   * @param {string} heightStr - a height value from the API, which lists feet and inches separated by a dash (#-#)
   * @returns the height with ticks for feet and inches (#'#")
   */
  static formatHeight(heightStr: string) {
    return heightStr ? heightStr.replace(/(\d+)-(\d+)/, "$1'$2\"") : "N/A";
  }

  /**
   * - Formats the height string by replacing the dash with '-foot-'
   * - If heightStr is null or empty, "N/A" is returned.
   * - If no dash, the string is returned unchanged
   *
   * @example
   * // 6-8
   * formatHeight('6-foot-8')
   *
   * @param {string} heightStr - a height value from the API, which lists feet and inches separated by a dash (#-#)
   * @returns #-foot-#
   */
  static formatHeightWithFoot(heightStr: string) {
    if ( heightStr ) {
      return heightStr.split("-").join("-foot-");
    }
    else {
      return "N/A";
    }
  }


  /**
   * - Outputs a valid image url of a team logo given a valid team name input
   *
   * @example
   * TODO-JVW
   *
   * @returns a url string that points to the inputted team's logo
   */

  static formatTeamLogo(inputTeamName: string):string {
    if(inputTeamName != null) {
      let teamName = inputTeamName.replace(" ", "_");
      teamName = teamName.replace(".", "");
      let teamLogo = GlobalSettings.getImageUrl("/mlb/logos/team/MLB_" + teamName + "_Logo.jpg", GlobalSettings._imgMdLogo);
      return teamLogo;
    }else{
      return "";
    }
  }

  static resizeImage(width:number){
    var resizePath;
    let r = window.devicePixelRatio;
    width = width > 1920 ? 1920 : width;//width limit to 1920 if larger
    width = width * r;
    resizePath = "?width=" + width;
    if(width < 150){//increase quality if smaller than 150, default is set to 70
      resizePath += "&quality=90";
    }
    return resizePath;
  }

  static getBackroundImageUrlWithStockFallback(relativePath, width:number=1920):string {
    let stockPhotoArray = ["/app/public/Image-Placeholder-1.jpg","/app/public/Image-Placeholder-2.jpg"];
    let randomStockPhotoSelection = stockPhotoArray[Math.floor(Math.random()*stockPhotoArray.length)];
    var relPath = relativePath != null ? this._proto + "//" + this.getEnv(this._env) + "images.synapsys.us" + relativePath : randomStockPhotoSelection;
    if (width != 1) {
      if (relativePath != null && relativePath != "") {
        relPath += this.resizeImage(width);
      }
    }
    return relPath;
  }

  // static MLBPosition(position: string): string{
  //     if( typeof position == 'undefined' || position === null){
  //       return position;
  //     }
  //     var posFullName = {
  //       1: 'Pitcher',
  //       2: 'Catcher',
  //       3: '1st Baseman',
  //       4: '2nd Baseman',
  //       5: '3rd Baseman',
  //       6: 'Shortstop',
  //       7: 'Left Field',
  //       8: 'Center Field',
  //       9: 'Right Field',
  //       D: 'Designated Hitter'
  //     };
  //     let upperPosition = position.toUpperCase();
  //     let displayPosition = posFullName[upperPosition];
  //     return displayPosition !== undefined ? displayPosition: position;
  //   }

  // static MLBPositionToAB(position: string): string{
  //     if( typeof position == 'undefined' || position === null ){
  //       return 'DH';
  //     }
  //     var posAbbrName = {
  //       1: 'P',
  //       2: 'C',
  //       3: '1B',
  //       4: '2B',
  //       5: '3B',
  //       6: 'S',
  //       7: 'LF',
  //       8: 'CF',
  //       9: 'RF',
  //       D: 'DH',
  //     };
  //     let upperPosition = position.toUpperCase();
  //     let displayAbbrPosition = posAbbrName[upperPosition];
  //     return displayAbbrPosition !== undefined ? displayAbbrPosition: position;
  //   }


  /**
   * TODO-JVW
   * @param urlArr
   * @returns {any}
   */
  //path: '/list/:profile/:listname/:sort/:conference/:division/:limit/:pageNum',
  static formatListRoute(urlArr: Array<any>): Array<any> {
    for(var arg in urlArr) {
      if (arg == null) return ['Error-page'];
    }
    let kebabArr = urlArr.map( item => GlobalFunctions.toLowerKebab(item) );

    let listRoute = ['List-page', {
      profile     : kebabArr[0],
      listname    : kebabArr[1],
      sort        : kebabArr[2],
      conference  : kebabArr[3],
      division    : kebabArr[4],
      limit       : kebabArr[5],
      pageNum     : kebabArr[6]
    }];
    return listRoute;
  }


  /**
  * Function will return string, reformatted from AI Content API Response as of July 21, 2016
  */
  static convertAiDate(date){
    date = date.split(' ');
    var month;
    switch(date[0]) {
      case 'January': month = 'Jan.'; break;
      case 'February': month = 'Feb.'; break;
      case 'August': month = 'Aug.'; break;
      case 'September': month = 'Sep.'; break;
      case 'October': month = 'Oct.'; break;
      case 'November': month = 'Nov.'; break;
      case 'December': month = 'Dec.'; break;
      default: month = date[0]; break;
    }
    date[0] = month;


    var day = date[1];
    day = day.split(',')[0].replace(/([A-Za-z])\w+/g,'');
    var year = date[2];

    var _string = month + ' ' + day + ', ' + year;
    return _string;
  }

  /**
   * Returns the abbreviation for American or National leagues
   *
   * @param {string} confName - 'American' or 'National' (case insensitive)
   * @param {string} divName - (Optional) If included, is appended to end of string in title case
   *
   * @returns abbreviation or confName if it cannot be mapped to an abbreviation
   */
  static formatShortNameDivison(confName: string, divName?: string): string {
    if ( !confName ) return confName;

    let abbr = confName;
    switch ( confName.toLowerCase() ) {
      case 'american': abbr = "AL"; break;
      case 'national': abbr = "NL"; break;
      default: break;
    }

    return divName ? abbr + " " + GlobalFunctions.toTitleCase(divName) : abbr;
  }


  static formatStatName(stat: string) {
    //coming from backend as a stat in the list info
   switch (stat) {
     //pitcher
     case 'pitcher-wins-losses':
      return "W/L";
     case 'pitcher-innings-pitched':
      return "Innings pitched";
     case 'pitcher-strikeouts':
      return "Strikeouts";
     case 'pitcher-earned-run-average':
      return "ERA";
     case 'pitcher-hits-allowed':
      return "Hits Allowed";

     case 'pitcher-bases-on-balls':
      return "Walks";
     case 'pitcher-runs-allowed':
      return "Runs allowed";
     case 'pitcher-earned-runs':
      return "Runs earned";

     //batter
     case 'batter-home-runs':
      return "Home runs";
     case 'batter-batting-average':
      return "Batting average";
     case 'batter-runs-batted-in':
      return "RBIs";
     case 'batter-hits':
      return "Hits";
     case 'batter-bases-on-balls':
      return "Walks";
     case 'batter-stolen-bases':
      return "Stolen bases";

     case 'batter-triples':
      return "Triples ";
     case 'batter-strikeouts':
      return "Strikeouts";
     case 'batter-singles':
      return "Singles";
     case 'batter-runs':
      return "Runs";
     case 'batter-on-base-percentage':
      return "OBP";
     case 'batter-doubles':
      return "Doubles";

     default: return GlobalFunctions.toTitleCase(stat.replace(/-/g, ' '));
   }
  }

  static formatSynRoute(articleType: string, eventID: string): Array<any> {
    var synRoute: Array<any>;
    if(typeof eventID != 'undefined' && eventID != null){
      synRoute = ['Syndicated-article-page', {articleType: articleType, eventID: eventID}];
    } else{
      synRoute = null;
    }
    return synRoute ? synRoute : ['Error-page'];
  }

  static formatAiArticleRoute(eventType: string, eventID: string): Array<any> {
    var aiArticleRoute: Array<any>;
    if(typeof eventID != 'undefined' && eventID != null){
      aiArticleRoute = ['Article-pages', {eventType: eventType, eventID: eventID}];
    } else{
      aiArticleRoute = null;
    }
    return aiArticleRoute ? aiArticleRoute : ['Error-page'];
  }
}
