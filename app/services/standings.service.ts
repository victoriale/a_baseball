import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';
import {Conference, Division, MLBPageParameters} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {TeamStandingsData, MLBStandingsTabData, MLBStandingsTableModel, MLBStandingsTableData} from './standings.data';
import {StandingsTableTabData} from '../components/standings/standings.component';
import {GlobalSettings} from '../global/global-settings';

@Injectable()
export class StandingsService {
  constructor(public http: Http, private _mlbFunctions: MLBGlobalFunctions){}

  private getLinkToPage(pageParams: MLBPageParameters, teamName: string): Array<any> {
    var pageName = "Standings-page";
    var pageValues = {};

    if ( pageParams.teamId && teamName ) {
      pageValues["teamId"] = pageParams.teamId;
      pageValues["teamName"] = GlobalFunctions.toLowerKebab(teamName);
      pageValues["type"] = "team";
      pageName += "-team";
    }
    else if ( pageParams.conference != null ) {
      pageValues["type"] = Conference[pageParams.conference];
      pageName += "-league";
    }
    return [pageName, pageValues];
  }

  private getModuleTitle(pageParams: MLBPageParameters, teamName: string): string {
    let groupName = this.formatGroupName(pageParams.conference, pageParams.division);
    let moduletitle = groupName + " Standings";
    if ( teamName ) {
      moduletitle += " - " + teamName;
    }
    return moduletitle;
  }

  getPageTitle(pageParams: MLBPageParameters, teamName: string): string {
    let groupName = this.formatGroupName(pageParams.conference, pageParams.division);
    let pageTitle = "MLB Standings Breakdown";
    if ( teamName ) {
      pageTitle = "MLB Standings - " + teamName;
    }
    return pageTitle;
  }

  loadAllTabsForModule(pageParams: MLBPageParameters, currentTeamId?: number, currentTeamName?: string) {
    return {
        moduleTitle: this.getModuleTitle(pageParams, currentTeamName),
        pageRouterLink: this.getLinkToPage(pageParams, currentTeamName),
        tabs: this.initializeAllTabs(pageParams, currentTeamId ? currentTeamId.toString() : null)
    };
  }

  initializeAllTabs(pageParams: MLBPageParameters, currentTeamId?: string): Array<MLBStandingsTabData> {
    let tabs: Array<MLBStandingsTabData> = [];

    if ( pageParams.conference === undefined || pageParams.conference === null ) {
      //Is an MLB page: show MLB, then American, then National
      tabs.push(this.createTab(true, currentTeamId));
      tabs.push(this.createTab(false, currentTeamId, Conference.american));
      tabs.push(this.createTab(false, currentTeamId, Conference.national));
    }
    else if ( pageParams.division === undefined || pageParams.division === null ) {
      //Is a League page: show All Divisions, then American, then National
      tabs.push(this.createTab(false, currentTeamId));
      tabs.push(this.createTab(pageParams.conference === Conference.american, currentTeamId, Conference.american));
      tabs.push(this.createTab(pageParams.conference === Conference.national, currentTeamId, Conference.national));
    }
    else {
      //Is a Team page: show team's division, then team's league, then MLB
      tabs.push(this.createTab(true, currentTeamId, pageParams.conference, pageParams.division));
      tabs.push(this.createTab(false, currentTeamId, pageParams.conference));
      tabs.push(this.createTab(false, currentTeamId));
    }

    return tabs;
  }

  getStandingsTabData(tabData: Array<any>, pageParams: MLBPageParameters, onTabsLoaded: Function, maxRows?: number) {
    if ( !tabData || tabData.length < 2 ) {
      throw new Error("Invalid tabData for standings")
    }
    var standingsTab: MLBStandingsTabData = tabData[0];
    var selectedKey = tabData[1];
    if ( selectedKey == null ) {
      selectedKey = pageParams.teamId;
    }
    if ( standingsTab && (!standingsTab.sections || standingsTab.sections.length == 0) ) {
      let url = GlobalSettings.getApiUrl() + "/standings";

      if ( standingsTab.conference !== undefined ) {
        url += "/" + Conference[standingsTab.conference];
      }

      standingsTab.isLoaded = false;
      standingsTab.hasError = false;

      this.http.get(url)
          .map(res => res.json())
          .map(data => this.setupTabData(standingsTab, data.data, maxRows))
          .subscribe(data => {
            standingsTab.isLoaded = true;
            standingsTab.hasError = false;
            standingsTab.sections = data;
            if ( selectedKey ) {
              standingsTab.setSelectedKey(selectedKey);
            }
            onTabsLoaded(data);
          },
          err => {
            standingsTab.isLoaded = true;
            standingsTab.hasError = true;
            console.log("Error getting standings data");
          });
    }
  }

  private createTab(selectTab: boolean, teamId: string, conference?: Conference, division?: Division) {
    let title = this.formatGroupName(conference, division) + " Standings";
    return new MLBStandingsTabData(title, conference, division, selectTab, teamId);
  }

  private setupTabData(standingsTab: MLBStandingsTabData, apiData: any, maxRows: number): Array<MLBStandingsTableData> {
    var sections: Array<MLBStandingsTableData> = [];
    var totalRows = 0;

    if ( standingsTab.conference !== null && standingsTab.conference !== undefined &&
      standingsTab.division !== null && standingsTab.division !== undefined ) {
      //get only the single division
      var conferenceKey = Conference[standingsTab.conference];
      var divisionKey = Division[standingsTab.division];
      var divData = conferenceKey && divisionKey ? apiData[conferenceKey][divisionKey] : [];
      sections.push(this.setupTableData(standingsTab.currentTeamId, standingsTab.conference, standingsTab.division, divData, maxRows, false));
    }
    else {
      //other load all provided divisions
      for ( var conferenceKey in apiData ) {
        for ( var divisionKey in apiData[conferenceKey] ) {
          var divData = conferenceKey && divisionKey ? apiData[conferenceKey][divisionKey] : [];
          var table = this.setupTableData(standingsTab.currentTeamId, Conference[conferenceKey], Division[divisionKey], divData, maxRows, true);
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

    return sections;
  }

  private setupTableData(teamId: string, conference:Conference, division:Division, rows: Array<TeamStandingsData>, maxRows: number, includeTableName: boolean): MLBStandingsTableData {
    let groupName = this.formatGroupName(conference, division);

    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      rows = rows.slice(0, maxRows);
    }

    //Set display values
    rows.forEach((value, index) => {
      value.groupName = groupName;
      value.displayDate = GlobalFunctions.formatUpdatedDate(value.lastUpdated, false);
      value.fullImageUrl = GlobalSettings.getImageUrl(value.imageUrl, GlobalSettings._imgLgLogo);
      value.fullBackgroundImageUrl = GlobalSettings.getBackgroundImageUrl(value.backgroundImage, GlobalSettings._imgProfileMod);
      
      //Make sure numbers are numbers.
      value.totalWins = Number(value.totalWins);
      value.totalLosses = Number(value.totalLosses);
      value.winPercentage = Number(value.winPercentage);
      value.gamesBack = Number(value.gamesBack);
      value.streakCount = Number(value.streakCount);
      value.batRunsScored = Number(value.batRunsScored);
      value.pitchRunsAllowed = Number(value.pitchRunsAllowed);
    });

    let tableName = this.formatGroupName(conference, division, true);
    var table = new MLBStandingsTableModel(rows, teamId);
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
      let leagueName = GlobalFunctions.toTitleCase(Conference[conference]) + " League";
      if ( division !== undefined && division !== null ) {
        var divisionName = GlobalFunctions.toTitleCase(Division[division]);
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
