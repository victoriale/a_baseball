import {Component, Input, Output, OnInit, EventEmitter, OnChanges} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {ComparisonTile, ComparisonTileInput} from '../../components/comparison-tile/comparison-tile.component';
import {ComparisonBar, ComparisonBarInput} from '../../components/comparison-bar/comparison-bar.component'
import {ComparisonLegend, ComparisonLegendInput} from '../../components/comparison-legend/comparison-legend.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';

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
    isActive: boolean;
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
}

@Component({
    selector: 'comparison-module',
    templateUrl: './app/modules/comparison/comparison.module.html',
    directives:[ModuleHeader, ComparisonTile, ComparisonBar, ComparisonLegend, Tabs, Tab]
})

export class ComparisonModule implements OnInit, OnChanges {
    @Input() modelData: ComparisonModuleData;
    
    @Input() profileName: string;
    
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
    
    constructor() {
        var year = new Date().getFullYear();
        this.tabs.push({
            tabTitle: "Current Season",
            seasonId: year.toString(),
            barData: [],
            isActive: true
        });
        for ( var i = 0; i < 3; i++ ) {
            year--;
            this.tabs.push({
                tabTitle: year.toString(),
                seasonId: year.toString(),
                barData: [],
                isActive: false
            });
        }
        this.tabs.push({
            tabTitle: "Career Stats",
            seasonId: null,
            barData: [],
            isActive: false
        });
    }

    ngOnInit(){
    }
    
    ngOnChanges() {
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
        var selectedSeason = new Date().getFullYear(); //TODO: get from selected tab.
        // this.selectedTeamOne = data.playerOne.teamId;
        // this.selectedTeamTwo = data.playerTwo.teamId;
        this.comparisonTileDataOne = this.setupTile(data.playerOne);
        this.comparisonTileDataTwo = this.setupTile(data.playerTwo);
        this.gradient = Gradient.getGradientStyles([data.playerOne.mainTeamColor, data.playerTwo.mainTeamColor], 1);
        
        for ( var i = 0; i < this.tabs.length; i++ ) {
            this.tabs[i].barData = data.bars[this.tabs[i].seasonId];
        }
        this.comparisonLegendData = {
            legendTitle: [
                {
                    text: selectedSeason + ' Season',
                    class: 'text-heavy'
                },
                {
                    text: ' Breakdown',
                }
            ],
            legendValues: [
                {
                    title: "Stat High",
                    color: "#e1e1e1"
                },
                {
                    title: data.playerTwo.playerName,
                    color: data.playerTwo.mainTeamColor
                },
                {
                    title: data.playerOne.playerName,
                    color: data.playerOne.mainTeamColor
                }
            ]
        };
    }
    
    setupTile(player: PlayerData): ComparisonTileInput {
        return {
            dropdownOneKey: player.teamId,
            dropdownTwoKey: player.playerId,
            imageConfig: {
                imageClass: "image-180",
                mainImage: {
                    imageUrl: GlobalSettings.getImageUrl(player.playerHeadshot),
                    urlRouteArray: MLBGlobalFunctions.formatPlayerRoute(player.teamName, player.playerName, player.playerId),
                    hoverText: "<p>View</p><p>Profile</p>",
                    imageClass: "border-large"
                },
                subImages: [
                    {
                        imageUrl: GlobalSettings.getImageUrl(player.teamLogo),
                        urlRouteArray: MLBGlobalFunctions.formatTeamRoute(player.teamName, player.teamId),
                        hoverText: "<i class='fa fa-mail-forward'></i>",
                        imageClass: "image-50-sub image-round-lower-right"
                    },
                    {
                        text: "#" + player.uniformNumber,
                        imageClass: "image-48-rank image-round-upper-left image-round-sub-text"
                    }
                ],
            },
            title: player.playerName,
            description: [
                {
                    text: 'Position: '
                },
                {
                    text: player.position,
                    class: 'text-heavy'
                },
                {
                    text: ' |&nbsp;&nbsp;Team: ', //TODO: differently
                    class: ''
                },
                {
                    text: player.teamName,
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
        }
        else if ( dropdownIndex == 1 ) { //player dropdown            
            //load new player list and comparison stats
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
    
    tabSelected(tabTitle) {
        var selectedTabs = this.tabs.filter(tab => {
           return tab.tabTitle == tabTitle; 
        });
        if ( selectedTabs.length > 0 ) {
            if ( tabTitle == "Career Stats" ) {
                this.comparisonLegendData.legendTitle[0].text = tabTitle;
            }
            else {
                this.comparisonLegendData.legendTitle[0].text = selectedTabs[0].seasonId + " Season";
            } 
        } 
    }
}
