import {Component, Input, Output, OnInit, EventEmitter} from 'angular2/core';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {ComparisonTile} from '../../components/comparison-tile/comparison-tile.component';
import {ComparisonBar} from '../../components/comparison-bar/comparison-bar.component'
import {ComparisonLegend} from '../../components/comparison-legend/comparison-legend.component';

@Component({
    selector: 'comparison-module',
    templateUrl: './app/modules/comparison/comparison.module.html',
    directives:[ModuleHeader, ComparisonTile, ComparisonBar, ComparisonLegend],
    providers: []
})

export class ComparisonModule implements OnInit{
    public moduleHeaderData: Object = {
        moduleTitle: 'Comparison vs. Competition - [Batter Name]',
        hasIcon: false,
        iconClass: ''
    };
    public comparisonLegendData: Object = {
        legendTitle: [
            {
                text: '2016 Season',
                class: 'text-heavy'
            },
            {
                text: ' Breakdown',
                class: ''
            }
        ],
        titleOne: '[Batter Name 1]',
        colorOne: '#3098FF',
        titleTwo: '[Batter Name 2]',
        colorTwo: '#FF2232'
    };
    public comparisonBarData: Array<Object> = [
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
            colorTwo: '#FF2232',
            background: 0
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
            colorTwo: '#FF2232',
            background: 1
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
            colorTwo: '#FF2232',
            background: 0
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
            colorTwo: '#FF2232',
            background: 1
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
            colorTwo: '#FF2232',
            background: 0
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
            colorTwo: '#FF2232',
            background: 1
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
            colorTwo: '#FF2232',
            background: 0
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
            colorTwo: '#FF2232',
            background: 1
        }
    ];
    public dataIndex: number = 0;

    public comparisonTileDataOne: Object = {
        dropdownOne: [
            'Team Profile',
            'Player Profile'
        ],
        dropdownTwo: [
            'Lutz',
            'Larry'
        ],
        imageConfig: {
            imageClass: "image-180",
            mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<p>View</p><p>Profile</p>",
                imageClass: "border-large"
            },
            subImages: [
                {
                    imageUrl: "./app/public/placeholder-location.jpg",
                    urlRouteArray: ['Disclaimer-page'],
                    hoverText: "<i class='fa fa-mail-forward'></i>",
                    imageClass: "image-50-sub image-round-lower-right"
                },
                {
                    text: "#12",
                    imageClass: "image-48-rank image-round-upper-left image-round-sub-text"
                }
            ],
        },
        title: 'Lutz',
        description: [
            {
                text: 'Position: ',
                class: ''
            },
            {
                text: 'RF',
                class: 'text-heavy'
            },
            {
                text: ' | Team: ',
                class: ''
            },
            {
                text: '[Team Name 1]',
                class: 'text-heavy'
            }
        ],
        data: [
            {
                data: '6\'1"',
                key: 'Height'
            },
            {
                data: '180lbs',
                key: 'Weight'
            },
            {
                data: '25',
                key: 'Age'
            },
            {
                data: '?',
                key: 'Season'
            },
        ]
    };
    public comparisonTileDataTwo: Object = {
        dropdownOne: [
            'Team Profile',
            'Player Profile'
        ],
        dropdownTwo: [
            'Lutz',
            'Larry'
        ],
        imageConfig: {
            imageClass: "image-180",
            mainImage: {
                imageUrl: "./app/public/placeholder-location.jpg",
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<p>View</p><p>Profile</p>",
                imageClass: "border-large"
            },
            subImages: [
                {
                    imageUrl: "./app/public/placeholder-location.jpg",
                    urlRouteArray: ['Disclaimer-page'],
                    hoverText: "<i class='fa fa-mail-forward'></i>",
                    imageClass: "image-50-sub image-round-lower-right"
                },
                {
                    text: "#32",
                    imageClass: "image-48-rank image-round-upper-left image-round-sub-text"
                }
            ],
        },
        title: 'Larry',
        description: [
            {
                text: 'Position: ',
                class: ''
            },
            {
                text: 'RF',
                class: 'text-heavy'
            },
            {
                text: ' | Team: ',
                class: ''
            },
            {
                text: '[Team Name 2]',
                class: 'text-heavy'
            }
        ],
        data: [
            {
                data: '4\'10"',
                key: 'Height'
            },
            {
                data: '90lbs',
                key: 'Weight'
            },
            {
                data: '12',
                key: 'Age'
            },
            {
                data: '?',
                key: 'Season'
            },
        ]
    };

    dataOne(){
        this.dataIndex = 0;
    }
    dataTwo(){
        this.dataIndex = 1;
    }
    dataThree(){
        this.dataIndex = 2;
    }

    ngOnInit(){

    }
}
