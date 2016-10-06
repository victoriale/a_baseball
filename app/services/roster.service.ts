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
  private _tabTypes = ['full', 'pitchers', 'catchers', 'fielders', 'hitters'];

  public fullRoster: { [type:string]:Array<TeamRosterData> };

  constructor(public http: Http){}

  setToken(){
    var headers = new Headers();
    return headers;
  }

  initializeAllTabs(teamId: string, conference: Conference, maxRows?: number, isTeamProfilePage?: boolean): Array<MLBRosterTabData> {
    return this._tabTypes.map(type => new MLBRosterTabData(this, teamId, type, conference, maxRows, isTeamProfilePage));
  }

  getRosterTabData(rosterTab: MLBRosterTabData): Observable<Array<TeamRosterData>> {
    var teamId = rosterTab.teamId;
    var type = rosterTab.type;

    rosterTab.isLoaded = false;
    rosterTab.hasError = false;

    var fullUrl = this._apiUrl + "/team/roster/" + teamId;
    //console.log("loading full team roster: "+ fullUrl);
    return this.http.get(fullUrl, {headers: this.setToken()})
      .map(res => res.json())
      .map(data => {
        this.fullRoster = data.data;
        return data.data;
      });
  }//getRosterService ends

  loadAllTabsForModule(teamId: number, teamName: string, conference: Conference, isTeamProfilePage: boolean): RosterModuleData<TeamRosterData> {
    return {
        moduleTitle: this.getModuleTitle(teamName),
        pageRouterLink: this.getLinkToPage(teamId, teamName),
        tabs: this.initializeAllTabs(teamId.toString(), conference, 5, isTeamProfilePage)
    };
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
