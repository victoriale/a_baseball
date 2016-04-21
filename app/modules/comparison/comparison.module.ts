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
    public moduleTitle: string = 'Comparison vs. Competition - [Batter Name]';
    public comparisonLegendData: Object = {
        legendTitle: '2016 Season',
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
                    dataOne: 70,
                    dataTwo: 40
                },
                {
                    dataOne: 12,
                    dataTwo: 25
                },
                {
                    dataOne: 50,
                    dataTwo: 10
                }
            ],
            colorOne: '#3098FF',
            colorTwo: '#FF2232',
            dataHigh: 100
        },
        {
            title: 'Batting Average',
            data: [
                {
                    dataOne: 2,
                    dataTwo: 2
                },
                {
                    dataOne: 1,
                    dataTwo: 3
                },
                {
                    dataOne: 6,
                    dataTwo: 2
                }
            ],
            colorOne: '#3098FF',
            colorTwo: '#FF2232',
            dataHigh: 8
        },
        {
            title: 'RBIS',
            data: [
                {
                    dataOne: 1,
                    dataTwo: 2
                },
                {
                    dataOne: 1,
                    dataTwo: 2
                },
                {
                    dataOne: 2,
                    dataTwo: 3
                }
            ],
            colorOne: '#3098FF',
            colorTwo: '#FF2232',
            dataHigh: 5
        },
        {
            title: 'Hits',
            data: [
                {
                    dataOne: 15,
                    dataTwo: 95
                },
                {
                    dataOne: 6,
                    dataTwo: 20
                },
                {
                    dataOne: 45,
                    dataTwo: 83
                }
            ],
            colorOne: '#3098FF',
            colorTwo: '#FF2232',
            dataHigh: 100
        },
        {
            title: 'Walks',
            data: [
                {
                    dataOne: 15,
                    dataTwo: 95
                },
                {
                    dataOne: 4,
                    dataTwo: 30
                },
                {
                    dataOne: 65,
                    dataTwo: 98
                }
            ],
            colorOne: '#3098FF',
            colorTwo: '#FF2232',
            dataHigh: 100
        },
        {
            title: 'On Base Percentage',
            data: [
                {
                    dataOne: 499,
                    dataTwo: 528
                },
                {
                    dataOne: 200,
                    dataTwo: 700
                },
                {
                    dataOne: 500,
                    dataTwo: 505
                }
            ],
            colorOne: '#3098FF',
            colorTwo: '#FF2232',
            dataHigh: 986
        },
        {
            title: 'Doubles',
            data: [
                {
                    dataOne: 1,
                    dataTwo: 5
                },
                {
                    dataOne: 0,
                    dataTwo: 10
                },
                {
                    dataOne: 3,
                    dataTwo: 17
                }
            ],
            colorOne: '#3098FF',
            colorTwo: '#FF2232',
            dataHigh: 20
        },
        {
            title: 'Triples',
            data: [
                {
                    dataOne: 1,
                    dataTwo: 5
                },
                {
                    dataOne: 0,
                    dataTwo: 45
                },
                {
                    dataOne: 32,
                    dataTwo: 45
                }
            ],
            colorOne: '#3098FF',
            colorTwo: '#FF2232',
            dataHigh: 48
        }
    ];
    public dataIndex: number = 0;

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
