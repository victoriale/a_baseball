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
  constructor(public http: Http, private _globalFunctions: GlobalFunctions, private _mlbFunctions: MLBGlobalFunctions){}
  
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
    return Observable.forkJoin(tabs.map(tab => this.getData(pageParams, tab, maxRows)));    
  }

  private getData(pageParams: MLBPageParameters, standingsTab: MLBPlayerStatsTableData, maxRows?: number): Observable<MLBPlayerStatsTableData> {
    // let url = GlobalSettings.getApiUrl();

    // return this.http.get(url)
    //     .map(res => res.json())
    //     .map(data => this.setupTabData(standingsTab, data.data, maxRows));
    let data = [
      {
        teamName: "Chicago Cubs",
        teamId: 2790,
        teamImageUrl: "/mlb/logos/team/MLB_Chicago_White_Sox_Logo.jpg",
        playerName: "Willis Jones",
        playerId: 1,
        playerImageUrl: "none.jpg",
        seasionId: "2016",
        lastUpdatedDate: new Date(),        
        //Batting Stats
        battingAverage: .212,
        homeRuns: 13,
        runsBattedIn: 15,
        sluggingPercent: 16,
        hits: 17,
        walks: 18,
        
        //Pitching Stats
        onBasePercent: .123,
        earnedRunAverage: .1234,
        wins: 2,
        losses: 5,
        strikeouts: 6,
        inningsPitched: 78,
        walksPitched: 66,
        whip: 3,
        saves: 3,        
      },
      {
        teamName: "Chicago Cubs",
        teamId: 2790,
        teamImageUrl: "/mlb/logos/team/MLB_Chicago_White_Sox_Logo.jpg",
        playerName: "Frank Bridge",
        playerId: 2,
        playerImageUrl: "/mlb/logos/team/MLB_Chicago_White_Sox_Logo.jpg",
        seasionId: "2016",
        lastUpdatedDate: new Date(),        
        //Batting Stats
        battingAverage: .012,
        homeRuns: 13,
        runsBattedIn: 15,
        sluggingPercent: 16,
        hits: 17,
        walks: 18,
        
        //Pitching Stats
        onBasePercent: .123,
        earnedRunAverage: .1234,
        wins: 2,
        losses: 5,
        strikeouts: 6,
        inningsPitched: 78,
        walksPitched: 66,
        whip: 3,
        saves: 3,        
      },
      {
        teamName: "Chicago Cubs",
        teamId: 2790,
        teamImageUrl: "/mlb/logos/team/MLB_Chicago_White_Sox_Logo.jpg",
        playerName: "Josef Myslivecek",
        playerId: 3,
        playerImageUrl: "/mlb/logos/team/MLB_Chicago_White_Sox_Logo.jpg",
        seasionId: "2016",
        lastUpdatedDate: new Date(),        
        //Batting Stats
        battingAverage: .500,
        homeRuns: 13,
        runsBattedIn: 15,
        sluggingPercent: 16,
        hits: 17,
        walks: 18,
        
        //Pitching Stats
        onBasePercent: .123,
        earnedRunAverage: .1234,
        wins: 2,
        losses: 5,
        strikeouts: 6,
        inningsPitched: 78,
        walksPitched: 66,
        whip: 3,
        saves: 3,        
      }
    ];
    return Observable.of(this.setupTabData(pageParams, standingsTab, [
      {seasonId: "2016", rows: data},
      {seasonId: "2015", rows: data},
      {seasonId: "2014", rows: data}
    ], maxRows));    
  }
  
  private initializeAllTabs(pageParams: MLBPageParameters): Array<MLBPlayerStatsTableData> {
    let tabs: Array<MLBPlayerStatsTableData> = [];
    
    tabs.push(new MLBPlayerStatsTableData("Batting", false, true)); //isPitcher = false, isActive = true
    tabs.push(new MLBPlayerStatsTableData("Pitching", true, false)); //isPitcher = true, isActive = false
    
    return tabs;
  }

  private setupTabData(pageParams: MLBPageParameters, standingsTab: MLBPlayerStatsTableData, data: Array<PlayerStatsSeasonData>, maxRows?: number): MLBPlayerStatsTableData {
    var tableName = pageParams.teamName + " " + standingsTab.tabTitle + " Stats";
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
        value.fullPlayerImageUrl = GlobalSettings.getImageUrl(value.playerImageUrl);
        value.fullTeamImageUrl = GlobalSettings.getImageUrl(value.teamImageUrl);
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
}
