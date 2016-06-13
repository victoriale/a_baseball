// import {Injectable} from 'angular2/core';
// import {Observable} from 'rxjs/Rx';
// import {Http} from 'angular2/http';
// import {Season, MLBPageParameters} from '../global/global-interface';
// import {MLBGlobalFunctions} from '../global/mlb-global-functions';
// import {GlobalFunctions} from '../global/global-functions';
// import {TeamSeasonStatsData, MLBSeasonStatsTabData, MLBSeasonStatsTableModel, MLBSeasonStatsTableData} from './season-stats-page.data';
// import {TableTabData} from '../components/season-stats/season-stats.component';
// import {GlobalSettings} from '../global/global-settings';
//
// @Injectable()
// export class SeasonStatsPageService {
//   constructor(public http: Http, private _globalFunctions: GlobalFunctions, private _mlbFunctions: MLBGlobalFunctions){}
//
//   getPageTitle(pageParams: MLBPageParameters, teamName: string): string {
//     let groupName = this.formatGroupName(pageParams.season, pageParams.year);
//     let pageTitle = "Season Stats";
//     if ( teamName ) {
//       pageTitle = "Season Stats - " + teamName;
//     }
//     return pageTitle;
//   }
//
//   loadAllTabsForModule(pageParams: MLBPageParameters, teamName?: string) {
//     console.log("pageParams", pageParams, teamName);
//     return {
//         tabs: this.initializeAllTabs(pageParams)
//     };
//   }
//   //TODO using standing's until season stats page api is avaiable
//   initializeAllTabs(pageParams: MLBPageParameters): Array<MLBSeasonStatsTabData> {
//     let tabs: Array<MLBSeasonStatsTabData> = [];
//
//     if ( pageParams.season === undefined || pageParams.season === null ) {
//       tabs.push(this.createTab(true));
//       tabs.push(this.createTab(false, Season.regularSeason));
//       tabs.push(this.createTab(false, Season.postSeason));
//     }
//     else if ( pageParams.year === undefined || pageParams.year === null ) {
//       tabs.push(this.createTab(false));
//       tabs.push(this.createTab(pageParams.season === Season.regularSeason, Season.regularSeason));
//       tabs.push(this.createTab(pageParams.season === Season.postSeason, Season.postSeason));
//     }
//     else {
//       tabs.push(this.createTab(true, pageParams.season, pageParams.year));
//       tabs.push(this.createTab(false, pageParams.season));
//       tabs.push(this.createTab(false));
//     }
//
//     return tabs;
//   }
//   //TODO using standing api until season stats api is available
//   getSeasonStatsTabData(seasonStatsTab: MLBSeasonStatsTabData, pageParams: MLBPageParameters, onTabsLoaded: Function, maxRows?: number){
//       var playerId = seasonStatsTab.playerId;
//       console.log("seasonStatsTab",seasonStatsTab, pageParams);
//       let url = GlobalSettings.getApiUrl() + "/player/statsDetail/" + playerId;
//       seasonStatsTab.isLoaded = false;
//       seasonStatsTab.hasError = false;
//
//       this.http.get(url)
//           .map(res => res.json())
//           .map(data => this.setupTabData(seasonStatsTab, data.data, pageParams.teamId, maxRows))
//           .subscribe(data => {
//             seasonStatsTab.isLoaded = true;
//             seasonStatsTab.hasError = false;
//             seasonStatsTab.sections = data;
//             onTabsLoaded(data);
//           },
//           err => {
//             seasonStatsTab.isLoaded = true;
//             seasonStatsTab.hasError = true;
//             console.log("Error getting season stats data");
//           });
//   }
//   //TODO
//   private createTab(selectTab: boolean, season?: Season, year?: number) {
//     let title = this.formatGroupName(season, year, true);
//     return new MLBSeasonStatsTabData(title, season, year, selectTab);
//   }
//   //TODO
//   private setupTabData(seasonStatsTab: MLBSeasonStatsTabData, apiData: any, teamId: number, maxRows?: number): any{
//     var sections : Array<MLBSeasonStatsTableData> = [];
//     var totalRows = 0;
//     var curYear = new Date().getFullYear();
//     console.log("season stats tab", seasonStatsTab, sections);
//     //get only the single year
//     var conferenceKey = Season[seasonStatsTab.season];
//     var divisionKey = seasonStatsTab.year;
//     var divData = conferenceKey && divisionKey ? apiData[conferenceKey][divisionKey] : [];
//     sections.push(this.setupTableData(seasonStatsTab.season, seasonStatsTab.year, divData, maxRows, false));
//
//     if ( teamId ) {
//       sections.forEach(section => {
//         section.tableData.selectedKey = teamId;
//       });
//     }
//     return sections;
//   }
//
//   private setupTableData(season:Season, year:number, rows: Array<TeamSeasonStatsData>, maxRows: number, includeTableName: boolean): MLBSeasonStatsTableData {
//     let groupName = this.formatGroupName(season, year, true);
//
//     //Limit to maxRows, if necessary
//     if ( maxRows !== undefined ) {
//       rows = rows.slice(0, maxRows);
//     }
//
//     //Set display values
//     rows.forEach((value, index) => {
//       value.groupName = groupName;
//       value.displayDate = GlobalFunctions.formatUpdatedDate(value.lastUpdated, false);
//       value.fullImageUrl = GlobalSettings.getImageUrl(value.imageUrl);
//       if ( value.backgroundImage ) {
//         value.fullBackgroundImageUrl = GlobalSettings.getImageUrl(value.backgroundImage);
//       }
//
//       //Make sure numbers are numbers.
//       value.totalWins = Number(value.totalWins);
//       value.totalLosses = Number(value.totalLosses);
//       value.winPercentage = Number(value.winPercentage);
//       value.gamesBack = Number(value.gamesBack);
//       value.streakCount = Number(value.streakCount);
//       value.batRunsScored = Number(value.batRunsScored);
//       value.pitchRunsAllowed = Number(value.pitchRunsAllowed);
//
//       if ( value.teamId === undefined || value.teamId === null ) {
//         value.teamId = index;
//       }
//     });
//
//     let tableName = this.formatGroupName(season, year, true);
//     var table = new MLBSeasonStatsTableModel(rows);
//     return new MLBSeasonStatsTableData(includeTableName ? tableName : "", season, year, table);
//   }
//   // TODO groupname sample: Regular Season Total
//   private formatGroupName(season: Season, year: number, makeDivisionBold?: boolean): string {
//     return "YYYY";
//   }
// }
