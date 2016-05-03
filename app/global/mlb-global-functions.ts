import {Injectable} from 'angular2/core';
import {GlobalFunctions} from './global-functions';
import {Division, Conference} from './global-interface';

declare var moment: any;

@Injectable()

export class MLBGlobalFunctions {
  
  constructor(private _globalFunctions: GlobalFunctions) {
    
  }

  formatGroupName(conference?: Conference, division?: Division) {
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