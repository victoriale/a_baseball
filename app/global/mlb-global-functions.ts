import {Injectable} from 'angular2/core';
import {GlobalFunctions} from './global-functions';
import {Division, Conference} from './global-interface';

@Injectable()

export class MLBGlobalFunctions {
  
  constructor(private _globalFunctions: GlobalFunctions) {
    
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
}