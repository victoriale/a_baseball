import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http} from '@angular/http';
import {MLBPageParameters} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {PlayerStatsData, MLBPlayerStatsTableData, MLBPlayerStatsTableModel} from './player-stats.data';

@Injectable()
export class PlayerStatsService {
  private _apiUrl = GlobalSettings.getApiUrl();

  constructor(public http: Http){}

  private getLinkToPage(teamId: number, teamName: string): Array<any> {
    return ["Player-stats-page", {
      teamId: teamId,
      teamName: GlobalFunctions.toLowerKebab(teamName)
    }];
  }

  private getModuleTitle(teamName: string): string {
    return "Player Stats - " + teamName;
  }

  getPageTitle(teamName: string): string {
    return teamName ? "Player Stats - " + teamName : "Player Stats";
  }

  loadAllTabsForModule(teamId: number, teamName: string, isTeamProfilePage: boolean) {
    return {
        moduleTitle: this.getModuleTitle(teamName),
        pageRouterLink: this.getLinkToPage(teamId, teamName),
        tabs: this.initializeAllTabs(teamName, isTeamProfilePage)
    };
  }

  getStatsTabData(tabData: Array<any>, pageParams: MLBPageParameters, tabDataLoaded: Function, maxRows?: number) {
    if ( !tabData || tabData.length <= 1 ) {
      console.log("Error getting stats data - invalid tabData object");
      return;
    }

    var standingsTab: MLBPlayerStatsTableData = tabData[0];
    var seasonId: string = tabData[1];
    if ( !seasonId && standingsTab.seasonIds.length > 0 ) {
      seasonId = standingsTab.seasonIds[0].key;
    }
    var hasData = false;
    if ( standingsTab ) {
      var table = standingsTab.seasonTableData[seasonId];
      if ( table ) {
        standingsTab.isLoaded = true;
        standingsTab.tableData = table;
        return;
      }
    }

    standingsTab.isLoaded = false;
    standingsTab.hasError = false;
    standingsTab.tableData = null;

    var tabName = standingsTab.isPitcherTable ? "pitchers" : "batters";
    let url = this._apiUrl + "/team/seasonStats/" + pageParams.teamId + "/" + tabName + "/" + seasonId;
    // console.log("url: " + url);
    this.http.get(url)
        .map(res => res.json())
        .map(data => this.setupTableData(standingsTab, pageParams, data.data, maxRows))
        .subscribe(data => {
          standingsTab.isLoaded = true;
          standingsTab.hasError = false;
          standingsTab.seasonTableData[seasonId] = data;
          standingsTab.tableData = data;
          tabDataLoaded(data);
        },
        err => {
          standingsTab.isLoaded = true;
          standingsTab.hasError = true;
          console.log("Error getting player stats data");
        });;
  }

  initializeAllTabs(teamName: string, isTeamProfilePage: boolean): Array<MLBPlayerStatsTableData> {
    let tabs: Array<MLBPlayerStatsTableData> = [];

    tabs.push(new MLBPlayerStatsTableData(teamName, "Batting", false, true, isTeamProfilePage)); //isPitcher = false, isActive = true
    tabs.push(new MLBPlayerStatsTableData(teamName, "Pitching", true, false, isTeamProfilePage)); //isPitcher = true, isActive = false

    return tabs;
  }

  private setupTableData(standingsTab: MLBPlayerStatsTableData, pageParams: MLBPageParameters, data: Array<PlayerStatsData>, maxRows?: number): MLBPlayerStatsTableModel {
    let table = new MLBPlayerStatsTableModel(data, standingsTab.isPitcherTable);
    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      table.rows = table.rows.slice(0, maxRows);
    }

    //Set display values
    table.rows.forEach((value, index) => {
      value.displayDate = GlobalFunctions.formatUpdatedDate(value.lastUpdate, false);
      value.fullPlayerImageUrl = GlobalSettings.getImageUrl(value.playerHeadshot);
      value.fullTeamImageUrl = GlobalSettings.getImageUrl(value.teamLogo);
      if ( value.backgroundImage ) {
        value.fullBackgroundImageUrl = GlobalSettings.getBackgroundImageUrl(value.backgroundImage);
      }

      //force these fields to numbers:
      value.batAverage = value.batAverage != null ? Number(value.batAverage) : null;
      value.batSluggingPercentage = value.batSluggingPercentage != null ? Number(value.batSluggingPercentage) : null;
      value.batOnBasePercentage = value.batOnBasePercentage != null ? Number(value.batOnBasePercentage) : null;
      value.pitchEra = value.pitchEra != null ? Number(value.pitchEra) : null;
      value.whip = value.whip != null ? Number(value.whip) : null;
    });

    return table;
  }
}
