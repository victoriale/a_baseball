import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';
import {MLBPageParameters} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {PlayerStatsSeasonData, PlayerStatsData, MLBPlayerStatsTableData, MLBPlayerStatsTableModel} from './player-stats.data';
import {StatsTableTabData} from '../components/player-stats/player-stats.component';

@Injectable()
export class PlayerStatsService {
  constructor(public http: Http){}
  
  getLinkToPage(pageParams: MLBPageParameters): Array<any> {
    return ["Player-stats-page", {
      teamId: pageParams.teamId,
      teamName: pageParams.teamName,
      playerId: pageParams.playerId
    }];
  }
  
  getModuleTitle(pageParams: MLBPageParameters): string {
    return "Player Stats - " + pageParams.teamName;
  }
  
  getPageTitle(pageParams: MLBPageParameters): string {    
    return "Player Stats - " + pageParams.teamName;
  }
  
  loadAllTabs(pageParams: MLBPageParameters, maxRows?: number): Observable<Array<MLBPlayerStatsTableData>> {    
    var tabs = this.initializeAllTabs(pageParams); 
    return Observable.forkJoin(tabs.map(tab => this.getTabData(tab, pageParams, maxRows)));    
  }

  getTabData(standingsTab: MLBPlayerStatsTableData, pageParams: MLBPageParameters, maxRows?: number): Observable<MLBPlayerStatsTableData> {
    // let url = GlobalSettings.getApiUrl();

    // return this.http.get(url)
    //     .map(res => res.json())
    //     .map(data => this.setupTabData(standingsTab, data.data, maxRows));
    return Observable.of(this.setupTabData(standingsTab, pageParams, [
      {seasonId: "2016", rows: this.data},
      {seasonId: "2015", rows: this.data},
      {seasonId: "2014", rows: this.data}
    ], maxRows));    
  }
  
  initializeAllTabs(pageParams: MLBPageParameters): Array<MLBPlayerStatsTableData> {
    let tabs: Array<MLBPlayerStatsTableData> = [];
    
    tabs.push(new MLBPlayerStatsTableData("Batting", false, true)); //isPitcher = false, isActive = true
    tabs.push(new MLBPlayerStatsTableData("Pitching", true, false)); //isPitcher = true, isActive = false
    
    return tabs;
  }

  private setupTabData(standingsTab: MLBPlayerStatsTableData, pageParams: MLBPageParameters, data: Array<PlayerStatsSeasonData>, maxRows?: number): MLBPlayerStatsTableData {
    var tableName = "<span class='text-heavy'>" + pageParams.teamName + "</span> " + standingsTab.tabTitle + " Stats";
    var seasonIds: Array<{key: string, value: string}> = [];
    var selectedSeasonId;
    var seasonData: { [seasonId: string]: MLBPlayerStatsTableModel } = {};
    data.forEach(value => {
      seasonIds.push({
        key: value.seasonId,
        value: value.seasonId + " Season"
      });
      if ( !selectedSeasonId ) {
        selectedSeasonId = value.seasonId;
      }
      
      let table = new MLBPlayerStatsTableModel(tableName, value.rows, standingsTab.isPitcherTable);;
      seasonData[value.seasonId] = table;
    
      //Limit to maxRows, if necessary
      if ( maxRows !== undefined ) {
        table.rows = table.rows.slice(0, maxRows);
      }
      
      //Set display values    
      table.rows.forEach((value, index) => {
        value.displayDate = GlobalFunctions.formatUpdatedDate(value.lastUpdatedDate, false);
        value.fullPlayerImageUrl = GlobalSettings.getImageUrl(value.playerHeadshot);
        value.fullTeamImageUrl = GlobalSettings.getImageUrl(value.teamLogo);
        if ( value.playerId === undefined || value.playerId === null ) {
          value.playerId = index;
        }
      });
    });
    
    standingsTab.seasonIds = seasonIds;
    standingsTab.selectedSeasonId = selectedSeasonId;
    standingsTab.tableData = seasonData;
    return standingsTab;
  }
    
  data: Array<PlayerStatsData> = [
      {
        teamName: "Chicago Cubs",
        teamId: 2790,
        teamLogo: "/mlb/logos/team/MLB_Chicago_White_Sox_Logo.jpg",
        playerName: "Willis Jones",
        playerId: 1,
        playerHeadshot: "none.jpg",
        seasonId: "2016",
        lastUpdatedDate: new Date(),        
        //Batting Stats
        batAverage: .212,
        batHomeRuns: 13,
        batRbi: 15,
        batSluggingPercentage: .16,
        batHits: 17,
        batOnBasePercentage: .18,
        batBasesOnBalls: 45,
        
        //Pitching Stats
        pitchEra: 1.234,
        pitchWins: 2,
        pitchLosses: 5,
        pitchStrikeouts: 6,
        pitchInningsPitched: 78,
        pitchBasesOnBalls: 66,
        pitchWhip: 3,
        pitchSaves: 3,        
      },
      {
        teamName: "Chicago Cubs",
        teamId: 2790,
        teamLogo: "/mlb/logos/team/MLB_Chicago_White_Sox_Logo.jpg",
        playerName: "Frank Bridge",
        playerId: 2,
        playerHeadshot: "/mlb/logos/team/MLB_Chicago_White_Sox_Logo.jpg",
        seasonId: "2016",
        lastUpdatedDate: new Date(),        
        //Batting Stats
        batAverage: .012,
        batHomeRuns: 13,
        batRbi: 15,
        batSluggingPercentage: .16,
        batHits: 17,
        batOnBasePercentage: .18,
        batBasesOnBalls: 45,
        
        //Pitching Stats
        pitchEra: 1.234,
        pitchWins: 2,
        pitchLosses: 5,
        pitchStrikeouts: 6,
        pitchInningsPitched: 78,
        pitchBasesOnBalls: 66,
        pitchWhip: 3,
        pitchSaves: 3,        
      },
      {
        teamName: "Chicago Cubs",
        teamId: 2790,
        teamLogo: "/mlb/logos/team/MLB_Chicago_White_Sox_Logo.jpg",
        playerName: "Josef Myslivecek",
        playerId: 3,
        playerHeadshot: "/mlb/logos/team/MLB_Chicago_White_Sox_Logo.jpg",
        seasonId: "2016",
        lastUpdatedDate: new Date(),        
        //Batting Stats
        batAverage: .500,
        batHomeRuns: 13,
        batRbi: 15,
        batSluggingPercentage: .16,
        batHits: 17,
        batOnBasePercentage: .18,
        batBasesOnBalls: 45,
        
        //Pitching Stats
        pitchEra: 1.234,
        pitchWins: 2,
        pitchLosses: 5,
        pitchStrikeouts: 6,
        pitchInningsPitched: 78,
        pitchBasesOnBalls: 66,
        pitchWhip: 3,
        pitchSaves: 3,        
      }
    ];
}
