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
   * formatTeamRoute('Boston Red Sox')
   *
   *
   * @param {teamName} teamName - team name given from data that will be converted to lower kebab case
   * @param {teamId} teamId - team ID the required field needed to successfully navigate to team profile
   * @returns the height with ticks for feet and inches (#'#")
   */
  formatTeamRoute(teamName: string, teamId: number):Array<any> {
    var teamRoute: Array<any>;

    teamName = this._globalFunctions.toLowerKebab(teamName);
    teamRoute = []
    return teamRoute ? teamRoute : teamRoute = ['Error-page'];
  }

  /**
   * - Returns the group/league name based on the given conference and division values
   *
   * @example
   * // "American League"
   * formatGroupName(Conference.american)
   *
   * @example
   * // "MLB"
   * formatGroupName()
   *
   * @example
   * // "American League East"
   * formatGroupName(Conference.american, Division.east)
   *
   * @param {Conference} conference - (Optional)
   *                                - Expected if {division} is included.
   * @param {Division} division - (Optional)
   * @returns {string}
   *
   */
  formatGroupName(conference?: Conference, division?: Division): string {
    if ( conference !== undefined && conference !== null ) {
      let leagueName = this._globalFunctions.toTitleCase(Conference[conference]) + " League";
      // let leagueName = Conference[conference] + " League";
      if ( division !== undefined && division !== null ) {
        return leagueName + " " + this._globalFunctions.toTitleCase(Division[division]);
        // return leagueName + " " + Division[division];
      }
      else {
        return leagueName;
      }
    }
    else {
      return "MLB";
    }
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
