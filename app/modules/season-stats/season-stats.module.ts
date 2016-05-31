import {Component, Input, Output, OnInit, EventEmitter, OnChanges} from 'angular2/core';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {ModuleFooter, ModuleFooterData} from '../../components/module-footer/module-footer.component';
import {ComparisonBar, ComparisonBarInput} from '../../components/comparison-bar/comparison-bar.component';
import {ComparisonLegend, ComparisonLegendInput} from '../../components/comparison-legend/comparison-legend.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {NoDataBox} from '../../components/error/data-box/data-box.component';

import {GlobalSettings} from '../../global/global-settings';
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';
import {MLBPageParameters} from '../../global/global-interface';

import {SeasonStatsData, PlayerData, SeasonStats} from '../../services/season-stats.service';
export interface ComparisonTabData {
    tabTitle: string;
    // seasonId: string;
    tabData: Array<ComparisonBarInput>;
    // isActive: boolean;
}

@Component({
    selector: 'season-stats-module',
    templateUrl: './app/modules/season-stats/season-stats.module.html',
    directives: [
                  SliderCarousel,
                  ModuleHeader,
                  ComparisonBar,
                  ComparisonLegend,
                  ModuleFooter,
                  Tabs, Tab,
                  NoDataBox
                ]
})

export class SeasonStatsModule implements OnInit, OnChanges {
    @Input() teamList: Array<{key: string, value: string}>;
    @Input() data: SeasonStatsData;
    noDataMessage = "Sorry, there are no values for this season.";
    public moduleHeaderData: Object;
    public comparisonLegendData: ComparisonLegendInput;
    public dataIndex: number = 0;
    public footerData = {
      infoDesc: 'Want to see full statistics for this player?',
      text: 'VIEW FULL STATISTICS',
      url: ['Disclaimer-page']
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
          '<p></p>',
          '<p></p>',
          '<p></p>',
          '<p></p>'
        ]
    };
    formatData(data: SeasonStatsData) {
        var selectedSeason = new Date().getFullYear(); //TODO: get from selected tab.
        // for ( var i = 0; i < this.tabs.length; i++ ) {
        //     this.tabs[i].tabData = this.tabs[i].tabTitle;
        // }
        this.moduleHeaderData = {
            moduleTitle: 'Season Stats - ' + data.playerInfo.playerName,
            hasIcon: false,
            iconClass: ''
        };
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
                    title: "MLB Leader",
                    color: "#E1E1E1"
                },
                {
                    title: 'MLB Average',
                    color: '#555555'
                },
                {
                    title: data.playerInfo.playerName,
                    color: '#BC2027'
                }
            ]
        };
    }
    constructor(){}
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
          var tab = selectedTabs[0];
          if ( tabTitle == "Career Stats" ) {
              this.comparisonLegendData.legendTitle[0].text = tabTitle;
              this.noDataMessage = "Sorry, there are no season stats available for this player.";
          }
          else {
              this.comparisonLegendData.legendTitle[0].text = tab.tabTitle + " Season";
              this.noDataMessage = "Sorry, there are no statistics available for " + tab.tabTitle + ".";
          }
      }
    }
}
