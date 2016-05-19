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
import {ComparisonStatsData, PlayerData, TeamData} from '../../services/comparison-stats.service';
import {Gradient} from '../../global/global-gradient'

export interface ComparisonTabData {
    tabTitle: string;
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
    
    public comparisonBarData: Array<ComparisonBarInput> = [
        {
            title: 'Home Runs',
            data: [
                {
                    dataOne: 2,
                    dataTwo: 40,
                    dataHigh: 100
                },
                {
                    dataOne: 12,
                    dataTwo: 25,
                    dataHigh: 110
                },
                {
                    dataOne: 50,
                    dataTwo: 10,
                    dataHigh: 90
                }
            ],
            colorOne: '#3098FF',
            colorTwo: '#FF2232'
        },
        {
            title: 'Batting Average',
            data: [
                {
                    dataOne: 2,
                    dataTwo: 2,
                    dataHigh: 8
                },
                {
                    dataOne: 1,
                    dataTwo: 3,
                    dataHigh: 10
                },
                {
                    dataOne: 6,
                    dataTwo: 2,
                    dataHigh: 7
                }
            ],
            colorOne: '#3098FF',
            colorTwo: '#FF2232'
        },
        {
            title: 'RBIS',
            data: [
                {
                    dataOne: 1,
                    dataTwo: 2,
                    dataHigh: 6
                },
                {
                    dataOne: 1,
                    dataTwo: 2,
                    dataHigh: 3
                },
                {
                    dataOne: 2,
                    dataTwo: 3,
                    dataHigh: 10
                }
            ],
            colorOne: '#3098FF',
            colorTwo: '#FF2232'
        },
        {
            title: 'Hits',
            data: [
                {
                    dataOne: 15,
                    dataTwo: 95,
                    dataHigh: 100
                },
                {
                    dataOne: 6,
                    dataTwo: 20,
                    dataHigh: 120
                },
                {
                    dataOne: 45,
                    dataTwo: 83,
                    dataHigh: 90
                }
            ],
            colorOne: '#3098FF',
            colorTwo: '#FF2232'
        },
        {
            title: 'Walks',
            data: [
                {
                    dataOne: 15,
                    dataTwo: 95,
                    dataHigh: 100
                },
                {
                    dataOne: 4,
                    dataTwo: 30,
                    dataHigh: 50
                },
                {
                    dataOne: 65,
                    dataTwo: 98,
                    dataHigh: 120
                }
            ],
            colorOne: '#3098FF',
            colorTwo: '#FF2232'
        },
        {
            title: 'On Base Percentage',
            data: [
                {
                    dataOne: 499,
                    dataTwo: 528,
                    dataHigh: 986
                },
                {
                    dataOne: 200,
                    dataTwo: 700,
                    dataHigh: 800
                },
                {
                    dataOne: 500,
                    dataTwo: 505,
                    dataHigh: 660
                }
            ],
            colorOne: '#3098FF',
            colorTwo: '#FF2232'
        },
        {
            title: 'Doubles',
            data: [
                {
                    dataOne: 1,
                    dataTwo: 5,
                    dataHigh: 20
                },
                {
                    dataOne: 0,
                    dataTwo: 10,
                    dataHigh: 22
                },
                {
                    dataOne: 3,
                    dataTwo: 17,
                    dataHigh: 20
                }
            ],
            colorOne: '#3098FF',
            colorTwo: '#FF2232'
        },
        {
            title: 'Triples',
            data: [
                {
                    dataOne: 1,
                    dataTwo: 5,
                    dataHigh: 48
                },
                {
                    dataOne: 0,
                    dataTwo: 0,
                    dataHigh: 75
                },
                {
                    dataOne: 32,
                    dataTwo: 45,
                    dataHigh: 60
                }
            ],
            colorOne: '#3098FF',
            colorTwo: '#FF2232'
        }
    ];
    
    public dataIndex: number = 0;

    public comparisonTileDataOne: ComparisonTileInput;
    
    public comparisonTileDataTwo: ComparisonTileInput;
    
    tabs: Array<ComparisonTabData> = [
            {
                tabTitle: "Current Season",
                barData: this.comparisonBarData,
                isActive: true
            },
            {
                tabTitle: "[YYYY]",
                barData: this.comparisonBarData,
                isActive: false
            },
            {
                tabTitle: "Career Stats",
                barData: this.comparisonBarData,
                isActive: false
            }
        ];

    ngOnInit(){
    }
    
    ngOnChanges() {
        if ( this.data && this.tabs ) {
            var selectedSeason = "2016";
            this.formatData(this.data, selectedSeason);
        }
    }
    
    //TODO-CJP: think about passing of data
    formatData(data: ComparisonStatsData, selectedSeason: string) {
        
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
        this.tabs[0].barData = data.bars;
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
