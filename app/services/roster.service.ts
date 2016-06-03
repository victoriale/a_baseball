import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {RosterModuleData} from '../modules/team-roster/team-roster.module';
import {RosterTableModel, MLBRosterTabData, TeamRosterData} from '../services/roster.data';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Conference, Division} from '../global/global-interface';

@Injectable()
export class RosterService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  constructor(public http: Http){}

  setToken(){
    var headers = new Headers();
    return headers;
  }

  initializeAllTabs(): Array<MLBRosterTabData> {
    return [
      new MLBRosterTabData('full', 'Full Roster'),
      new MLBRosterTabData('pitchers', 'Pitchers'),
      new MLBRosterTabData('catchers', 'Catchers'),
      new MLBRosterTabData('fielders', 'Fielders'),
      new MLBRosterTabData('hitters', 'Designated Hitter')
    ];
  }

  getRosterTabData(teamId: string, conference: Conference, rosterTab: MLBRosterTabData, maxRows?: number) {
    if ( !rosterTab.tableData ) {
      rosterTab.isLoaded = false;
      rosterTab.hasError = false;
      rosterTab.setErrorMessage(conference);
      
      var fullUrl = this._apiUrl + "/team/roster/" + teamId + "/" + rosterTab.type;
      // console.log("Team roster url : " + fullUrl);
      
      this.http.get(fullUrl, {headers: this.setToken()})
        .map(res => res.json())
        .map(data => {
          return this.setupTabData(rosterTab, data.data, maxRows);
        })
        .subscribe(table => {     
          rosterTab.tableData = table;
          rosterTab.isLoaded = true;
          rosterTab.hasError = false;
        },
        err => {
          rosterTab.isLoaded = true;
          rosterTab.hasError = true;
          console.log("Error getting roster data", err);
        });
    }
  }//getRosterService ends

  loadAllTabsForModule(teamId: number, teamName: string): RosterModuleData {
    return {
        moduleTitle: this.getModuleTitle(teamName),
        pageRouterLink: this.getLinkToPage(teamId, teamName),
        tabs: this.initializeAllTabs()
    };
  }

  private setupTabData(rosterTab: MLBRosterTabData, data: Array<TeamRosterData>, maxRows: number) {
    var table = new RosterTableModel(data);
    
    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      table.rows = table.rows.slice(0, maxRows);
    }

    return table;
  }

  private getModuleTitle(teamName: string): string {
    let moduletitle = "Team Roster";
    if ( teamName ) {
      moduletitle += " - " + teamName;
    }
    return moduletitle;
  }

  getPageTitle(teamName: string): string {
    let pageTitle = "Team Roster";
    if ( teamName ) {
      pageTitle = "Team Roster - " + teamName;
    }
    return pageTitle;
  }

  getLinkToPage(teamId: number, teamName: string): Array<any> {
    var pageName = "Team-roster-page";
    var pageValues = {
      teamName: GlobalFunctions.toLowerKebab(teamName),
      teamId: teamId
    };
    return [pageName, pageValues];
  }

}
