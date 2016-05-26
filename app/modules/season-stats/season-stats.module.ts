import {Component, Input, Output, OnInit, EventEmitter, OnChanges} from 'angular2/core';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {ModuleFooter, ModuleFooterData} from '../../components/module-footer/module-footer.component';
import {ComparisonBar, ComparisonBarInput} from '../../components/comparison-bar/comparison-bar.component'
import {ComparisonLegend, ComparisonLegendInput} from '../../components/comparison-legend/comparison-legend.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';

import {GlobalSettings} from '../../global/global-settings';
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';
import {MLBPageParameters} from '../../global/global-interface';

import {SeasonStatsData, PlayerData, SeasonStats} from '../../services/season-stats.service';
export interface ComparisonTabData {
    tabTitle: string;
    seasonId: string;
    barData: Array<ComparisonBarInput>;
    isActive: boolean;
}

@Component({
    selector: 'season-stats-module',
    templateUrl: './app/modules/season-stats/season-stats.module.html',
    directives: [SliderCarousel, ModuleHeader, ComparisonBar, ComparisonLegend, ModuleFooter, Tabs, Tab]
})

export class SeasonStatsModule implements OnInit, OnChanges {
    @Input() teamList: Array<{key: string, value: string}>;

    @Input() data: SeasonStatsData;
    public moduleHeaderData: Object = {
        moduleTitle: 'Season Stats - [Pitcher Name]',
        hasIcon: false,
        iconClass: ''
    };
    public comparisonLegendData: ComparisonLegendInput = {
        legendTitle: [
          {
              text: '2016 Season',
              class: 'text-heavy'
          },
          {
              text: ' Breakdown',
          }
        ],
        legendValues: [
            {
                title: 'MLB Leader',
                color: '#e1e1e1'
            },
            {
                title: 'MLB Average',
                color: '#555555'
            },
            {
                title: '[Profile Name]',
                color: '#bc2027'
            }
        ]
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
    public footerData = {
      infoDesc: 'Want to see full statistics for this player?',
      text: 'VIEW FULL STATISTICS',
      url: ['Season-stats-page']
    };
    tabs: Array<ComparisonTabData> = [];
    public carouselDataArray: any = {
        index: '1',
        imageConfig: {
          imageClass: "image-150",
          mainImage: {
            imageUrl: "./app/public/no-image.png",
            imageClass: "border-large"
          },
          subImages: [
            {
              imageUrl: "./app/public/no-image.png",
              imageClass: "image-50-sub image-round-lower-right"
            }
          ],
        },
        description:[
          '<p>Test</p>',
          '<p></p>',
          '<p></p>',
          '<p></p>'
        ]
    };
    formatData(data: SeasonStatsData) {
        var selectedSeason = new Date().getFullYear(); //TODO: get from selected tab.
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
                    title: "Player Two",
                    color: "#bc2027"
                },
                {
                    title: "Player One",
                    color: "#555555"
                }
            ]
        };
    }
    constructor(){
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
    ngOnInit(){}
    ngOnChanges(){
      if ( this.data && this.tabs ) {
          this.formatData(this.data);
      }
    }
    tabSelected(tabTitle){
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
