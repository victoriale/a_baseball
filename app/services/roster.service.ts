import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';
import {RosterTableModel, RosterTabData, TeamRosterData} from '../services/roster.data';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';

@Injectable()
export class RosterService {
  private _apiUrl: string = 'http://dev-homerunloyal-api.synapsys.us';
  constructor(public http: Http){}

  setToken(){
    var headers = new Headers();
    return headers;
  }

  loadAllTabs(teamId, maxRows?: number): Observable<Array<RosterTabData>> {
    var tabs = this.initializeAllTabs();
    return Observable.forkJoin(tabs.map(tab => this.getRosterService(teamId, tab, maxRows)));
  }

  private initializeAllTabs(): Array<RosterTabData> {
    let tabs: Array<RosterTabData> = [
      new RosterTabData('full', 'Full Roster', true),
      new RosterTabData('pitchers', 'Pitchers', false),
      new RosterTabData('catchers', 'Catchers', false),
      new RosterTabData('fielders', 'Fielders', false),
      new RosterTabData('hitters', 'Designated Hitter', false)
    ];
    return tabs;
  }

  getRosterService(teamId, rosterTab, maxRows){
    var type = rosterTab.type.toLowerCase();
    var headers = this.setToken();
    var fullUrl = this._apiUrl + "/team/roster";
    if(typeof teamId != "undefined"){
      fullUrl += "/" + teamId;
    }
    if(typeof type != "undefined"){
      fullUrl += "/" + type;
    }
    return this.http.get(fullUrl, {
      headers: headers
    })
    .map(
      res => res.json()
    )
    .map(
      data => {
        return this.setupTabData(rosterTab, data.data, maxRows);
      }
    )
  }//getRosterService ends

  private setupTabData(rosterTab: RosterTabData, data: Array<TeamRosterData>, maxRows: number) {
    var table = new RosterTableModel("", data, GlobalFunctions, MLBGlobalFunctions);
    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      table.rows = table.rows.slice(0, maxRows);
    }

    //Table tabs
    let title = ""; // only include title if there are multiple tables.
    rosterTab.tableData = table;
    return rosterTab;
  }

  getModuleTitle(pageParams): string {
    let moduletitle = " Team Roster";
    if ( pageParams.teamName !== undefined && pageParams.teamName !== null ) {
      moduletitle += pageParams.teamName + " - " + moduletitle;
    }
    return moduletitle;
  }

  getPageTitle(pageParams): string {
    // let groupName = this.formatGroupName(pageParams.conference, pageParams.division);
    let pageTitle = "Team Roster";
    if ( pageParams.teamName !== undefined && pageParams.teamName !== null ) {
      pageTitle = "Team Roster - " + pageParams.teamName;
    }
    return pageTitle;
  }

  getLinkToPage(pageParams) {
    var pageName = "Team-roster-page";
    var pageValues = {
      teamName: GlobalFunctions.toLowerKebab(pageParams.teamName),
      teamId: pageParams.teamId
    };
    pageValues.teamName = GlobalFunctions.toLowerKebab(pageParams.teamName);
    return {
      infoDesc: "Want to see the full team roster?",
      text: "VIEW FULL ROSTER",
      url: [pageName, pageValues]
    };
  }

}
