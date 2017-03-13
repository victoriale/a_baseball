import {Component, Input, Output, OnInit, EventEmitter, OnChanges} from '@angular/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {ComparisonTile, ComparisonTileInput} from '../../components/comparison-tile/comparison-tile.component';
import {ComparisonBar, ComparisonBarInput} from '../../components/comparison-bar/comparison-bar.component'
import {ComparisonLegend, ComparisonLegendInput} from '../../components/comparison-legend/comparison-legend.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {NoDataBox} from '../../components/error/data-box/data-box.component';

import {GlobalSettings} from '../../global/global-settings';
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';
import {MLBPageParameters} from '../../global/global-interface';
import {ComparisonStatsData, PlayerData, SeasonStats} from '../../services/comparison-stats.service';
import {Gradient} from '../../global/global-gradient'

export interface ComparisonTabData {
    tabTitle: string;
    seasonId: string;
    barData: Array<ComparisonBarInput>;
}

export interface ComparisonModuleData {
    data: ComparisonStatsData;

    teamList: Array<{key: string, value: string}>;

    playerLists: Array<{
      teamId: string,
      playerList: Array<{key: string, value: string}>
    }>;

    loadTeamList(listLoaded: Function);

    loadPlayerList(index: number, teamId: string, listLoaded: Function);

    loadPlayer(index: number, teamId: string, playerId: string, statsLoaded: Function);
}

@Component({
    selector: 'comparison-module',
    templateUrl: './app/modules/comparison/comparison.module.html',
    directives:[ModuleHeader, ComparisonTile, ComparisonBar, ComparisonLegend, Tabs, Tab, NoDataBox]
})

export class ComparisonModule implements OnInit, OnChanges {
    @Input() modelData: ComparisonModuleData;

    @Input() profileName: string;

    @Input() profileId: string;

    @Input() profileType: string;

    @Input() seasonBase: any;


    teamOnePlayerList: Array<{key: string, value: string}>;

    teamTwoPlayerList: Array<{key: string, value: string}>;

    teamList: Array<{key: string, value: string}>;

    gradient: any;

    moduleHeaderData: ModuleHeaderData = {
        moduleTitle: 'Comparison vs. Competition - [Batter Name]',
        hasIcon: false,
        iconClass: ''
    };

    comparisonLegendData: ComparisonLegendInput;

    selectedTeamOne: string;

    selectedTeamTwo: string;

    comparisonTileDataOne: ComparisonTileInput;

    comparisonTileDataTwo: ComparisonTileInput;

    tabs: Array<ComparisonTabData> = [];

    noDataMessage = "Sorry, there are no values for this season.";

    selectedTabTitle: string;


    constructor() {

    }

    ngOnInit(){

    }

    ngOnChanges() {
        if(this.tabs.length == 0){
          var year;
          if(this.seasonBase == null || typeof this.seasonBase == 'undefined'){
            year = new Date().getFullYear();
          }else{
            switch(this.seasonBase['curr_season']){
              case 0:
                year = Number(this.seasonBase['season_id']) - 1;
                break;
              case 1:
                year = this.seasonBase['season_id'];
                break;
              case 2:
                year = this.seasonBase['season_id'];
                break;
            }
          }
          this.tabs.push({
              tabTitle: year,
              seasonId: year.toString(),
              barData: []
          });
          for ( var i = 0; i < 3; i++ ) {
              year--;
              this.tabs.push({
                  tabTitle: year.toString(),
                  seasonId: year.toString(),
                  barData: []
              });
          }
          this.tabs.push({
              tabTitle: "Career Stats",
              seasonId: "careerStats",
              barData: []
          });
        }
        if ( this.modelData ) {
            this.teamList = this.modelData.teamList;
            if ( this.modelData.playerLists && this.modelData.playerLists.length >= 2 ) {
                this.teamOnePlayerList = this.modelData.playerLists[0].playerList;
                this.teamTwoPlayerList = this.modelData.playerLists[1].playerList;
            }
            if ( this.modelData.data && this.tabs ) {
                this.formatData(this.modelData.data);
                this.modelData.loadTeamList(teamList => {
                    this.teamList = teamList;
                    this.loadPlayerList(0, this.modelData.data.playerOne.teamId);
                    this.loadPlayerList(1, this.modelData.data.playerTwo.teamId);
                });
            }
        }
        if ( this.profileName ) {
            this.moduleHeaderData.moduleTitle = 'Comparison vs. Competition - ' + this.profileName;
        }
    }

    //TODO-CJP: think about passing of data and creating a list of players rather than player one and player two
    formatData(data: ComparisonStatsData) {
        this.comparisonTileDataOne = this.setupTile(data.playerOne);
        this.comparisonTileDataTwo = this.setupTile(data.playerTwo);
        this.gradient = Gradient.getGradientStyles([data.playerOne.mainTeamColor, data.playerTwo.mainTeamColor], 1);

        var selectedTab;
        for ( var i = 0; i < this.tabs.length; i++ ) {
            if ( !this.selectedTabTitle && i == 0 ) {
                selectedTab = this.tabs[i];
            }
            else if ( this.selectedTabTitle && this.tabs[i].tabTitle == this.selectedTabTitle ) {
                selectedTab = this.tabs[i];
            }
            this.tabs[i].barData = data.bars[this.tabs[i].seasonId];
        }

        if ( !selectedTab ) {
            return;
        }

        var legendTitle = selectedTab.tabTitle == "Career Stats" ? selectedTab.tabTitle : selectedTab.seasonId + " Season";
        this.comparisonLegendData = {
            legendTitle: [
                {
                    text: legendTitle,
                    class: 'text-heavy'
                },
                {
                    text: ' Breakdown',
                },
                {
                    text: '*Qualified players only',
                    class: 'comparison-legend-title-sub'
                }
            ],
            legendValues: [
                {
                    title: data.playerOne.playerName,
                    // color: data.playerOne.mainTeamColor
                    color: '#BC1624'
                },
                {
                    title: data.playerTwo.playerName,
                    // color: data.playerTwo.mainTeamColor
                    color: '#444444'
                },
                {
                    title: "Stat High",
                    color: "#e1e1e1"
                },
            ]
        };
    }

    setupTile(player: PlayerData): ComparisonTileInput {
        var playerRoute = null;
        var teamRoute = null;
        var playerDisplayNumber = null;
        if ( this.profileType != "player" || this.profileId != player.playerId ) {
            playerRoute = MLBGlobalFunctions.formatPlayerRoute(player.teamName, player.playerName, player.playerId);
        }
        if ( this.profileType != "team" || this.profileId != player.teamId ) {
            teamRoute = MLBGlobalFunctions.formatTeamRoute(player.teamName, player.teamId);
        }
        if ( typeof player.uniformNumber == 'undefined' || player.uniformNumber == null ) {
          playerDisplayNumber = "N/A";
        } else {
          playerDisplayNumber = player.uniformNumber;
        }
        return {
            dropdownOneKey: player.teamId,
            dropdownTwoKey: player.playerId,
            imageConfig: {
                imageClass: "image-150",
                mainImage: {
                    imageUrl: GlobalSettings.getImageUrl(player.playerHeadshot, GlobalSettings._imgLgLogo),
                    urlRouteArray: playerRoute,
                    hoverText: "<p>View</p><p>Profile</p>",
                    imageClass: "border-med"
                },
                subImages: [
                    // {
                        // imageUrl: GlobalSettings.getImageUrl(player.teamLogo, GlobalSettings._imgLgLogo),
                        // urlRouteArray: MLBGlobalFunctions.formatTeamRoute(player.teamName, player.teamId),
                        // hoverText: "<i class='fa fa-mail-forward'></i>",
                        // imageClass: "image-50-sub image-round-lower-right"
                    // },
                    {
                        text: "#" + playerDisplayNumber,
                        imageClass: "image-48-rank image-round-upper-left image-round-sub-text"
                    }
                ],
            },
            titleUrl: playerRoute,
            title: player.playerName,
            description: ["Position: ",
                { text: player.position.join(', '), class: 'text-heavy' },
                { text: "<br>", class: "line-break" },
                "Team: ",
                {
                    text: player.teamName,
                    route: teamRoute,
                    class: 'text-heavy'
                }
            ],
            data: [
                {
                    data: player.height.split("-").join("'") + "\"",
                    key: 'Height'
                },
                {
                    data: player.weight + "<sup>lbs</sup>",
                    key: 'Weight'
                },
                {
                    data: player.age.toString(),
                    key: 'Age'
                },
                {
                    data: player.yearsExperience + "<sup>" + GlobalFunctions.Suffix(player.yearsExperience) + "</sup>",
                    key: 'Season'
                },
            ]
        }
    }

    /**
     * @param {number} tileIndex - 0 : left tile
     *                           - 1 : right tile
     * @param value an object containing
     *  - {number} dropdownIndex: 0 = left dropdown or team list, 1 right dropdown or player list
     *  - {string} key - The key selected in the dropdown
     */
    tileDropdownSwitched(tileIndex:number, value) {
        var dropdownIndex:number = value.dropdownIndex;
        var key:string = value.key;
        if ( dropdownIndex == 0 ) { //team dropdown
            this.loadPlayerList(tileIndex, key);
            this.loadPlayer(tileIndex, key);
        }
        else if ( dropdownIndex == 1 ) { //player dropdown
            //load new player list and comparison stats
            this.loadPlayer(tileIndex, null, key);
        }
    }

    loadPlayerList(tileIndex:number, teamId: string) {
        if ( tileIndex == 0 ) {
            this.selectedTeamOne = teamId;
        }
        else {
            this.selectedTeamTwo = teamId;
        }
        this.modelData.loadPlayerList(tileIndex, teamId, playerList => {
            if ( tileIndex == 0 ) {
                this.teamOnePlayerList = playerList;
            }
            else {
                this.teamTwoPlayerList = playerList;
            }
        });
    }

    loadPlayer(tileIndex: number, teamId: string, playerId?: string) {
        this.modelData.loadPlayer(tileIndex, teamId, playerId, (bars) => {
            this.modelData.data.bars = bars;
            this.formatData(this.modelData.data);
        });
    }

    tabSelected(tabTitle) {
        this.selectedTabTitle = tabTitle;
        var selectedTabs = this.tabs.filter(tab => {
           return tab.tabTitle == tabTitle;
        });
        if ( selectedTabs.length > 0 ) {
            var tab = selectedTabs[0];
            if ( tabTitle == "Career Stats" ) {
                this.comparisonLegendData.legendTitle[0].text = tabTitle;
                this.noDataMessage = "Sorry, there are no career stats available for these players.";
            }
            else {
                this.comparisonLegendData.legendTitle[0].text = tab.seasonId + " Season";
                this.noDataMessage = "Sorry, there are no statistics available for " + tab.seasonId + ".";
            }
        }
    }
}
