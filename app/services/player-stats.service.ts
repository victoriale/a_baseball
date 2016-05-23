import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';
import {MLBPageParameters} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {PlayerStatsData, MLBPlayerStatsTableData, MLBPlayerStatsTableModel} from './player-stats.data';
import {StatsTableTabData} from '../components/player-stats/player-stats.component';

declare var moment: any;

@Injectable()
export class PlayerStatsService {
  private _apiUrl = GlobalSettings.getApiUrl();
    
  constructor(public http: Http){}
  
  getLinkToPage(pageParams: MLBPageParameters): Array<any> {
    return ["Player-stats-page", {
      teamId: pageParams.teamId,
      teamName: GlobalFunctions.toLowerKebab(pageParams.teamName)
    }];
  }
  
  getModuleTitle(pageParams: MLBPageParameters): string {
    return "Player Stats - " + pageParams.teamName;
  }
  
  getPageTitle(pageParams: MLBPageParameters): string {    
    return "Player Stats - " + pageParams.teamName;
  }

  loadAllTabsForModule(pageParams: MLBPageParameters) {
    return {
        moduleTitle: this.getModuleTitle(pageParams),
        pageRouterLink: this.getLinkToPage(pageParams),
        tabs: this.initializeAllTabs(pageParams)
    };
  }

  getTabData(standingsTab: MLBPlayerStatsTableData, pageParams: MLBPageParameters, maxRows?: number): Observable<MLBPlayerStatsTableModel> {    
    var hasData = false;
    if ( standingsTab ) {
      var table = standingsTab.seasonTableData[standingsTab.selectedSeasonId];
      if ( table ) {     
        return Observable.of(table);
      }
    }    
    
    var tabName = standingsTab.isPitcherTable ? "pitchers" : "batters";
    let url = this._apiUrl + "/team/seasonStats/" + pageParams.teamId + "/" + tabName + "/" + standingsTab.selectedSeasonId;    

    return this.http.get(url)
        .map(res => res.json())
        .map(data => this.setupTableData(standingsTab, pageParams, data.data, maxRows));    
  }
  
  initializeAllTabs(pageParams: MLBPageParameters): Array<MLBPlayerStatsTableData> {
    let tabs: Array<MLBPlayerStatsTableData> = [];
    
    tabs.push(new MLBPlayerStatsTableData("Batting", false, true)); //isPitcher = false, isActive = true
    tabs.push(new MLBPlayerStatsTableData("Pitching", true, false)); //isPitcher = true, isActive = false
    
    return tabs;
  }

  private setupTableData(standingsTab: MLBPlayerStatsTableData, pageParams: MLBPageParameters, data: Array<PlayerStatsData>, maxRows?: number): MLBPlayerStatsTableModel {
    var tableName = "<span class='text-heavy'>" + pageParams.teamName + "</span> " + standingsTab.tabTitle + " Stats";  
    let table = new MLBPlayerStatsTableModel(tableName, data, standingsTab.isPitcherTable);;    
    //Limit to maxRows, if necessary
    if ( maxRows !== undefined ) {
      table.rows = table.rows.slice(0, maxRows);
    }
    
    //Set display values    
    table.rows.forEach((value, index) => {
      value.displayDate = GlobalFunctions.formatUpdatedDate(value.lastUpdate, false);
      value.fullPlayerImageUrl = GlobalSettings.getImageUrl(value.playerHeadshot);
      value.fullTeamImageUrl = GlobalSettings.getImageUrl(value.teamLogo);
      value.fullBackgroundImageUrl = GlobalSettings.getImageUrl(value.profileHeader);
      
      //force these fields to numbers:
      value.batAverage = value.batAverage != null ? Number(value.batAverage) : undefined;
      value.batSluggingPercentage = value.batSluggingPercentage != null ? Number(value.batSluggingPercentage) : undefined;
      value.batOnBasePercentage = value.batOnBasePercentage != null ? Number(value.batOnBasePercentage) : undefined;
      value.pitchEra = value.pitchEra != null ? Number(value.pitchEra) : undefined;
      value.whip = value.whip != null ? Number(value.whip) : undefined;
    });
    
    return table;
  }
}
