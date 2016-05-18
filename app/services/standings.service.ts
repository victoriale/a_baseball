import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';
import {Conference, Division, MLBPageParameters} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {TeamStandingsData, MLBStandingsTabData, MLBStandingsTableModel, MLBStandingsTableData} from './standings.data';
import {TableTabData} from '../components/standings/standings.component';
import {GlobalSettings} from '../global/global-settings';

@Injectable()
export class StandingsService {
  constructor(public http: Http, private _globalFunctions: GlobalFunctions, private _mlbFunctions: MLBGlobalFunctions){}

  getLinkToPage(pageParams: MLBPageParameters): Array<any> {
    var pageName = "Standings-page";
    var pageValues = {};

    if ( pageParams.teamId && pageParams.teamName ) {
      pageValues["teamId"] = pageParams.teamId;
      pageValues["teamName"] = GlobalFunctions.toLowerKebab(pageParams.teamName);
      pageValues["type"] = "team";
      pageName += "-team";
    }
    else if ( pageParams.conference != null ) {
      pageValues["type"] = Conference[pageParams.conference];
      pageName += "-league";
    }
    return [pageName, pageValues];
  }

  getModuleTitle(pageParams: MLBPageParameters): string {
    let groupName = this.formatGroupName(pageParams.conference, pageParams.division);
    let moduletitle = groupName + " Standings";
    if ( pageParams.teamName !== undefined && pageParams.teamName !== null ) {
      moduletitle += " - " + pageParams.teamName;
    }
    return moduletitle;
  }

  getPageTitle(pageParams: MLBPageParameters): string {
    let groupName = this.formatGroupName(pageParams.conference, pageParams.division);
    let pageTitle = "MLB Standings Breakdown";
    if ( pageParams.teamName !== undefined && pageParams.teamName !== null ) {
      pageTitle = "MLB Standings - " + pageParams.teamName;
    }
    return pageTitle;
  }

  loadAllTabsForModule(pageParams: MLBPageParameters) {
    return {
        moduleTitle: this.getModuleTitle(pageParams),
        pageRouterLink: this.getLinkToPage(pageParams),
        tabs: this.initializeAllTabs(pageParams)
    };
  }

  loadAllTabs(pageParams: MLBPageParameters, maxRows?: number): Observable<Array<MLBStandingsTabData>> {
    var tabs = this.initializeAllTabs(pageParams);
    return Observable.forkJoin(tabs.map(tab => this.getTabData(tab, maxRows)));
  }

  initializeAllTabs(pageParams: MLBPageParameters): Array<MLBStandingsTabData> {
    let tabs: Array<MLBStandingsTabData> = [];

    if ( pageParams.conference === undefined || pageParams.conference === null ) {
      //Is an MLB page: show MLB, then American, then National
      tabs.push(this.createTab(true));
      tabs.push(this.createTab(false, Conference.american));
      tabs.push(this.createTab(false, Conference.national));
    }
    else if ( pageParams.division === undefined || pageParams.division === null ) {
      //Is a League page: show All Divisions, then American, then National
      tabs.push(this.createTab(false));
      tabs.push(this.createTab(pageParams.conference === Conference.american, Conference.american));
      tabs.push(this.createTab(pageParams.conference === Conference.national, Conference.national));
    }
    else {
      //Is a Team page: show team's division, then team's league, then MLB
      tabs.push(this.createTab(true, pageParams.conference, pageParams.division));
      tabs.push(this.createTab(false, pageParams.conference));
      tabs.push(this.createTab(false));
    }

    return tabs;
  }

  getTabData(standingsTab: MLBStandingsTabData, pageParams: MLBPageParameters, maxRows?: number): Observable<Array<MLBStandingsTableData>> {
    let url = GlobalSettings.getApiUrl() + "/standings";

    if ( standingsTab.conference !== undefined ) {
      url += "/" + Conference[standingsTab.conference];
    }

    return this.http.get(url)
        .map(res => res.json())
        .map(data => this.setupTabData(standingsTab, data.data, pageParams.teamId, maxRows));
  }

  private createTab(selectTab: boolean, conference?: Conference, division?: Division) {
    let title = this.formatGroupName(conference, division) + " Standings";
    return new MLBStandingsTabData(title, conference, division, selectTab);
  }

  private setupTabData(standingsTab: MLBStandingsTabData, apiData: any, teamId: number, maxRows: number): Array<MLBStandingsTableData> {
    //Array<TeamStandingsData>
    var sections: Array<MLBStandingsTableData> = [];
    var totalRows = 0;

    if ( standingsTab.conference !== null && standingsTab.conference !== undefined &&
      standingsTab.division !== null && standingsTab.division !== undefined ) {
      //get only the single division
      var conferenceKey = Conference[standingsTab.conference];
      var divisionKey = Division[standingsTab.division];
      var divData = conferenceKey && divisionKey ? apiData[conferenceKey][divisionKey] : [];
      sections.push(this.setupTableData(standingsTab.conference, standingsTab.division, divData, maxRows, false));
    }
    else {
      //other load all provided divisions
      for ( var conferenceKey in apiData ) {
        for ( var divisionKey in apiData[conferenceKey] ) {
          var divData = conferenceKey && divisionKey ? apiData[conferenceKey][divisionKey] : [];
          var table = this.setupTableData(Conference[conferenceKey], Division[divisionKey], divData, maxRows, true);
          totalRows += table.tableData.rows.length;
          if ( maxRows && totalRows > maxRows ) {
            break; //don't add more divisions
          }
          sections.push(table);
        }
        if ( maxRows && totalRows > maxRows ) {
          break; //don't add more conferences
        }
      }
    }

    if ( teamId ) {
      sections.forEach(section => {
        section.tableData.selectedKey = teamId;
      });
    }
    return sections;
  }

  private setupTableData(conference:Conference, division:Division, rows: Array<TeamStandingsData>, maxRows: number, includeTableName: boolean): MLBStandingsTableData {
    let groupName = this.formatGroupName(conference, division);

    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      rows = rows.slice(0, maxRows);
    }

    //Set display values
    rows.forEach((value, index) => {
      value.groupName = groupName;
      value.displayDate = GlobalFunctions.formatUpdatedDate(value.lastUpdated, false);
      value.fullImageUrl = GlobalSettings.getImageUrl(value.imageUrl);
      value.fullBackgroundImageUrl = GlobalSettings.getImageUrl(value.backgroundImage);

      //Make sure numbers are numbers.
      value.totalWins = Number(value.totalWins);
      value.totalLosses = Number(value.totalLosses);
      value.winPercentage = Number(value.winPercentage);
      value.gamesBack = Number(value.gamesBack);
      value.streakCount = Number(value.streakCount);
      value.batRunsScored = Number(value.batRunsScored);
      value.pitchRunsAllowed = Number(value.pitchRunsAllowed);

      if ( value.teamId === undefined || value.teamId === null ) {
        value.teamId = index;
      }
    });

    let tableName = this.formatGroupName(conference, division, true);
    var table = new MLBStandingsTableModel(rows);
    return new MLBStandingsTableData(includeTableName ? tableName : "", conference, division, table);
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
  private formatGroupName(conference: Conference, division: Division, makeDivisionBold?: boolean): string {
    if ( conference !== undefined && conference !== null ) {
      let leagueName = this._globalFunctions.toTitleCase(Conference[conference]) + " League";
      if ( division !== undefined && division !== null ) {
        var divisionName = this._globalFunctions.toTitleCase(Division[division]);
        return leagueName + " " + (makeDivisionBold ? "<span class='text-heavy'>" + divisionName + "</span>" : divisionName);
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
