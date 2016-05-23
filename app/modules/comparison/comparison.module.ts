import {Component, Input, Output, OnInit, EventEmitter, OnChanges} from 'angular2/core';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {ComparisonTile, ComparisonTileInput} from '../../components/comparison-tile/comparison-tile.component';
import {ComparisonBar, ComparisonBarInput} from '../../components/comparison-bar/comparison-bar.component'
import {ComparisonLegend, ComparisonLegendInput} from '../../components/comparison-legend/comparison-legend.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';

import {GlobalSettings} from '../../global/global-settings';
import {GlobalFunctions} from '../../global/global-functions';
import {MLBPageParameters} from '../../global/global-interface';
import {ComparisonStatsData, PlayerData, SeasonStats} from '../../services/comparison-stats.service';
import {Gradient} from '../../global/global-gradient'

export interface ComparisonTabData {
    tabTitle: string;
    seasonId: string;
    barData: Array<ComparisonBarInput>;
    isActive: boolean;
}

@Component({
    selector: 'comparison-module',
    templateUrl: './app/modules/comparison/comparison.module.html',
    directives:[ModuleHeader, ComparisonTile, ComparisonBar, ComparisonLegend, Tabs, Tab]
})

export class ComparisonModule implements OnInit, OnChanges {    
    @Input() teamList: Array<{key: string, value: string}>;
    
    @Input() data: ComparisonStatsData;
    
    public gradient: any;
    
    public moduleHeaderData: Object = {
        moduleTitle: 'Comparison vs. Competition - [Batter Name]',
        hasIcon: false,
        iconClass: ''
    };
    
    public comparisonLegendData: ComparisonLegendInput = {
        legendTitle: [
            {
                text: '[YYYY] Season',
                class: 'text-heavy'
            },
            {
                text: ' Breakdown',
            }
        ],
        legendValues: [
            {
                title: '[Batter Name 1]',
                color: '#3098FF'
            },
            {
                title: '[Batter Name 2]',
                color: '#FF2232'
            }
        ]
    };
    
    public dataIndex: number = 0;

    public comparisonTileDataOne: ComparisonTileInput;
    
    public comparisonTileDataTwo: ComparisonTileInput;
    
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
        if ( this.data && this.tabs ) {
            this.formatData(this.data);
        }
    }
    
    //TODO-CJP: think about passing of data
    formatData(data: ComparisonStatsData) {
        var selectedSeason = new Date().getFullYear(); //TODO: get from selected tab.
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
                    color: data.playerTwo.teamColors[0]
                },
                {
                    title: data.playerOne.playerName,
                    color: data.playerOne.teamColors[0]
                }
            ]
        };         
        this.comparisonTileDataOne = this.setupTile(data.playerOne);
        this.comparisonTileDataTwo = this.setupTile(data.playerTwo);        
        this.gradient = Gradient.getGradientStyles([data.playerOne.teamColors[0], data.playerTwo.teamColors[0]], 1);
        
        for ( var i = 0; i < this.tabs.length; i++ ) {
            this.tabs[0].barData = data.bars[selectedSeason];            
        }
    }
    
    setupTile(player: PlayerData): ComparisonTileInput {
        var listOfTeams = [ //TODO
            'Team Profile'
        ];
        var listOfPlayers = [ //TODO
            'Player Profile'
        ];
        return {
            dropdownOneKey: player.teamId,
            dropdownTwoKey: player.playerId,
            imageConfig: {
                imageClass: "image-180",
                mainImage: {
                    imageUrl: GlobalSettings.getImageUrl(player.playerHeadshot),
                    urlRouteArray: ['Disclaimer-page'],
                    hoverText: "<p>View</p><p>Profile</p>",
                    imageClass: "border-large"
                },
                subImages: [
                    {
                        imageUrl: GlobalSettings.getImageUrl(player.teamLogo),
                        urlRouteArray: ['Disclaimer-page'],
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
                    text: ' | Team: ', //TODO: differently
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
                    data: player.weight + 'lbs',
                    key: 'Weight'
                },
                {
                    data: player.age.toString(),
                    key: 'Age'
                },
                {
                    data: player.yearsExperience + GlobalFunctions.Suffix(player.yearsExperience),
                    key: 'Season'
                },
            ]
        }
    }
    
    tabSelected(tabTitle) {
        
    }
}
