import {Injectable} from 'angular2/core';
import {GlobalFunctions} from './global-functions';
import {Division, Conference} from './global-interface';

@Injectable()

export class MLBGlobalFunctions {

  constructor(private _globalFunctions: GlobalFunctions) {

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
  formatTeamRoute(teamName: string, teamId: number):Array<any> {
    var teamRoute: Array<any>;

    if(typeof teamName != 'undefined' && teamName != null){
      teamName = this._globalFunctions.toLowerKebab(teamName);
      teamRoute = ['Team-page',{teamName:teamName, teamId:teamId}];//NOTE: if Team-page is on the same level as the rest of the route-outlets
    }else{
      teamRoute = null;
    }
    return teamRoute ? teamRoute : teamRoute = ['Error-page'];
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
  formatPlayerRoute(teamName: string, playerFullName:string, playerId: number):Array<any> {
    var playerRoute: Array<any>;

    if(typeof teamName != 'undefined' && teamName != null && typeof playerFullName != 'undefined' && playerFullName != null){
      teamName = this._globalFunctions.toLowerKebab(teamName);
      playerFullName = this._globalFunctions.toLowerKebab(teamName);
      playerRoute = ['Player-page',{teamName:teamName, fullName:playerFullName, playerId: playerId}];//NOTE: if Player-page is on the same level as the rest of the route-outlets
    }else{
      playerRoute = null;
    }
    return playerRoute ? playerRoute : playerRoute = ['Error-page'];
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
    return heightStr ? heightStr.replace(/(\d+)-(\d)/, "$1'$2\"") : "N/A";
  }


}
