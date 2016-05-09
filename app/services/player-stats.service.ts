import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';
import {MLBPageParameters} from '../global/global-interface';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {PlayerStatsSeasonData, PlayerStatsData, MLBPlayerStatsTableData, MLBPlayerStatsTableModel} from './player-stats.data';
import {StatsTableTabData} from '../components/player-stats/player-stats.component';

@Injectable()
export class PlayerStatsService {
  private _apiUrl: string = 'http://dev-homerunloyal-api.synapsys.us/player-stats';
// '[API]/standings/{ordering}/{conference}/{division}'

  constructor(public http: Http, private _globalFunctions: GlobalFunctions, private _mlbFunctions: MLBGlobalFunctions){}
  
  getLinkToPage(pageParams: MLBPageParameters): Array<any> {
    return ["Player-stats-page", {
      teamId: pageParams.teamId,
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
    // let url = this._apiUrl;

    // return this.http.get(url)
    //     .map(res => res.json())
    //     .map(data => this.setupTabData(standingsTab, data.data, maxRows));
    let data = [
      {
        teamName: "Team Name",
        teamId: null,
        teamImageUrl: "none.jpg",
        playerName: "Player Name",
        playerId: null,
        playerImageUrl: "none.jpg",
        seasionId: "2016",
        lastUpdatedDate: new Date(),        
        //Batting Stats
        battingAverage: 12,
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
        teamName: "Team Name",
        teamId: null,
        teamImageUrl: "none.jpg",
        playerName: "Player Name",
        playerId: null,
        playerImageUrl: "none.jpg",
        seasionId: "2016",
        lastUpdatedDate: new Date(),        
        //Batting Stats
        battingAverage: 12,
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
        teamName: "Team Name",
        teamId: null,
        teamImageUrl: "none.jpg",
        playerName: "Player Name",
        playerId: null,
        playerImageUrl: "none.jpg",
        seasionId: "2016",
        lastUpdatedDate: new Date(),        
        //Batting Stats
        battingAverage: 12,
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
    var seasonIds: Array<string> = [];
    var seasonData: { [seasonId: string]: MLBPlayerStatsTableModel } = {};
    data.forEach(value => {
      seasonIds.push(value.seasonId);
      
      let table = new MLBPlayerStatsTableModel(tableName, value.rows, standingsTab.isPitcherTable);;
      seasonData[value.seasonId] = table;
    
      //Limit to maxRows, if necessary
      if ( maxRows !== undefined ) {
        table.rows = table.rows.slice(0, maxRows);
      }
      
      //Set display values    
      table.rows.forEach((value, index) => {
        value.displayDate = this._globalFunctions.formatUpdatedDate(value.lastUpdatedDate, false);
        if ( value.playerId === undefined || value.playerId === null ) {
          value.playerId = index;
        }
      });
    });
    
    standingsTab.seasonIds = seasonIds;
    standingsTab.selectedSeasonId = seasonIds && seasonIds.length > 0 ? seasonIds[0] : undefined;
    standingsTab.tableData = seasonData;
    return standingsTab;
  }
}
