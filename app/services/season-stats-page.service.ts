import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';
import {Conference, Division, MLBPageParameters} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {TeamSeasonStatsData, MLBSeasonStatsTabData, MLBSeasonStatsTableModel, MLBSeasonStatsTableData} from './season-stats-page.data';
import {TableTabData} from '../components/season-stats/season-stats.component';
import {GlobalSettings} from '../global/global-settings';

@Injectable()
export class SeasonStatsPageService {
  constructor(public http: Http, private _globalFunctions: GlobalFunctions, private _mlbFunctions: MLBGlobalFunctions){}

  private getLinkToPage(pageParams: MLBPageParameters, teamName: string): Array<any> {
    var pageName = "Season-stats-page";
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
    let groupName = this.formatGroupName();
    let moduletitle = groupName + " Season Stats";
    if ( teamName ) {
      moduletitle += " - " + teamName;
    }
    return moduletitle;
  }

  getPageTitle(pageParams: MLBPageParameters, teamName: string): string {
    let groupName = this.formatGroupName();
    let pageTitle = "Season Stats";
    if ( teamName ) {
      pageTitle = "Season Stats - " + teamName;
    }
    return pageTitle;
  }

  loadAllTabsForModule(pageParams: MLBPageParameters, teamName?: string) {
    return {
        moduleTitle: this.getModuleTitle(pageParams, teamName),
        pageRouterLink: this.getLinkToPage(pageParams, teamName),
        tabs: this.initializeAllTabs(pageParams)
    };
  }
  //TODO using standing's until season stats page api is avaiable
  initializeAllTabs(pageParams: MLBPageParameters): Array<MLBSeasonStatsTabData> {
    let tabs: Array<MLBSeasonStatsTabData> = [];

    if ( pageParams.conference === undefined || pageParams.conference === null ) {
      tabs.push(this.createTab(true));
      tabs.push(this.createTab(false, Conference.american));
      tabs.push(this.createTab(false, Conference.national));
    }
    else if ( pageParams.division === undefined || pageParams.division === null ) {
      tabs.push(this.createTab(false));
      tabs.push(this.createTab(pageParams.conference === Conference.american, Conference.american));
      tabs.push(this.createTab(pageParams.conference === Conference.national, Conference.national));
    }
    else {
      tabs.push(this.createTab(true, pageParams.conference, pageParams.division));
      tabs.push(this.createTab(false, pageParams.conference));
      tabs.push(this.createTab(false));
    }

    return tabs;
  }
  //TODO using standing api until season stats api is available
  getSeasonStatsTabData(seasonStatsTab: MLBSeasonStatsTabData, pageParams: MLBPageParameters, onTabsLoaded: Function, maxRows?: number) {
    if ( seasonStatsTab && (!seasonStatsTab.sections || seasonStatsTab.sections.length == 0) ) {
      let url = GlobalSettings.getApiUrl() + "/standings";

      if ( seasonStatsTab.conference !== undefined ) {
        url += "/" + Conference[seasonStatsTab.conference];
      }

      seasonStatsTab.isLoaded = false;
      seasonStatsTab.hasError = false;

      this.http.get(url)
          .map(res => res.json())
          .map(data => this.setupTabData(seasonStatsTab, data.data, pageParams.teamId, maxRows))
          .subscribe(data => {
            seasonStatsTab.isLoaded = true;
            seasonStatsTab.hasError = false;
            seasonStatsTab.sections = data;
            onTabsLoaded(data);
          },
          err => {
            seasonStatsTab.isLoaded = true;
            seasonStatsTab.hasError = true;
            console.log("Error getting season stats data");
          });
    }
  }
  //TODO
  private createTab(selectTab: boolean, conference?: Conference, division?: Division) {
    let title = this.formatGroupName();
    return new MLBSeasonStatsTabData(title, conference, division, selectTab);
  }
  //TODO
  private setupTabData(seasonStatsTab: MLBSeasonStatsTabData, apiData: any, teamId: number, maxRows: number): Array<MLBSeasonStatsTableData> {
    var sections: Array<MLBSeasonStatsTableData> = [];
    var totalRows = 0;

    if ( seasonStatsTab.conference !== null && seasonStatsTab.conference !== undefined &&
      seasonStatsTab.division !== null && seasonStatsTab.division !== undefined ) {
      //get only the single division
      var conferenceKey = Conference[seasonStatsTab.conference];
      var divisionKey = Division[seasonStatsTab.division];
      var divData = conferenceKey && divisionKey ? apiData[conferenceKey][divisionKey] : [];
      sections.push(this.setupTableData(seasonStatsTab.conference, seasonStatsTab.division, divData, maxRows, false));
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

  private setupTableData(conference:Conference, division:Division, rows: Array<TeamSeasonStatsData>, maxRows: number, includeTableName: boolean): MLBSeasonStatsTableData {
    let groupName = this.formatGroupName();

    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      rows = rows.slice(0, maxRows);
    }

    //Set display values
    rows.forEach((value, index) => {
      value.groupName = groupName;
      value.displayDate = GlobalFunctions.formatUpdatedDate(value.lastUpdated, false);
      value.fullImageUrl = GlobalSettings.getImageUrl(value.imageUrl);
      if ( value.backgroundImage ) {
        value.fullBackgroundImageUrl = GlobalSettings.getImageUrl(value.backgroundImage);
      }

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

    let tableName = this.formatGroupName();
    var table = new MLBSeasonStatsTableModel(rows);
    return new MLBSeasonStatsTableData(includeTableName ? tableName : "", conference, division, table);
  }
  // TODO groupname sample: Regular Season Total
  private formatGroupName(): string {
      return "NA";
  }//formatGroupName() ends
}
