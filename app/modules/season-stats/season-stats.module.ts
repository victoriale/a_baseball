import {Component, Input, Output, OnInit, EventEmitter} from 'angular2/core';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {ComparisonBar} from '../../components/comparison-bar/comparison-bar.component'
import {ComparisonLegend} from '../../components/comparison-legend/comparison-legend.component';
import {ModuleFooter} from '../../components/module-footer/module-footer';

@Component({
    selector: 'season-stats-module',
    templateUrl: './app/modules/season-stats/season-stats.module.html',
    directives: [ModuleHeader, ComparisonBar, ComparisonLegend, ModuleFooter],
    providers: []
})

export class SeasonStatsModule {
    public moduleTitle: string = 'Season Stats - [Pitcher Name]';
    public seasonStatsLegendData: Object = {
        legendTitle: '[YYYY] Season',
        titleOne: '[Pitcher Name]',
        colorOne: '#BC1624',
        titleTwo: 'MLB Average',
        colorTwo: '#555555',
        titleHigh: 'MLB Leader'
    };
    public comparisonBarData: Array<Object> = [
        {
            title: 'Wins',
            data: [
                {
                    dataOne: 33,
                    dataTwo: 22,
                    dataHigh: 52
                },
                {
                    dataOne: 12,
                    dataTwo: 45,
                    dataHigh: 90
                },
                {
                    dataOne: 45,
                    dataTwo: 75,
                    dataHigh: 100
                }
            ],
            colorOne: '#BC1624',
            colorTwo: '#555555',
            background: 0
        },
        {
            title: 'Innings Pitched (IP)',
            data: [
                {
                    dataOne: 3,
                    dataTwo: 7,
                    dataHigh: 8
                },
                {
                    dataOne: 1,
                    dataTwo: 0,
                    dataHigh: 10
                },
                {
                    dataOne: 4,
                    dataTwo: 7,
                    dataHigh: 7
                }
            ],
            colorOne: '#BC1624',
            colorTwo: '#555555',
            background: 1
        },
        {
            title: 'Strike Outs (SO)',
            data: [
                {
                    dataOne: 3,
                    dataTwo: 2,
                    dataHigh: 5
                },
                {
                    dataOne: 76,
                    dataTwo: 44,
                    dataHigh: 100
                },
                {
                    dataOne: 3,
                    dataTwo: 1,
                    dataHigh: 4
                }
            ],
            colorOne: '#BC1624',
            colorTwo: '#555555',
            background: 0
        },
        {
            title: 'ERA',
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
            colorOne: '#BC1624',
            colorTwo: '#555555',
            background: 1
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
            colorOne: '#BC1624',
            colorTwo: '#555555',
            background: 0
        }
    ];
    public dataIndex: number = 0;
    public footerHeadline = 'Want to see full statistics for this player?';
    public footerButton = 'VIEW FULL STATISTICS';

    dataOne(){
        this.dataIndex = 0;
    }
    dataTwo(){
        this.dataIndex = 1;
    }
    dataThree(){
        this.dataIndex = 2;
    }
}