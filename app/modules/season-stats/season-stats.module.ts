import {Component, Input, Output, OnInit, EventEmitter, OnChanges} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
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

export interface SeasonStatsModuleData {
  tabs: Array<SeasonStatsTabData>;
  profileName: string;
  carouselDataItem: SliderCarouselInput;
}

export interface SeasonStatsTabData {
  tabTitle: string;
  comparisonLegendData: ComparisonLegendInput;
  tabData: Array<ComparisonBarInput>;
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

export class SeasonStatsModule implements OnChanges {

    @Input() data: SeasonStatsModuleData;

    public noDataMessage = "Sorry, there are no values for this season.";

    public moduleHeaderData: ModuleHeaderData;

    // public comparisonLegendData: ComparisonLegendInput;

    // public selectedTabTitle: string = 'Current';

    public footerData: ModuleFooterData = {
      infoDesc: 'Want to see full statistics for this player?',
      text: 'VIEW FULL STATISTICS',
      url: ['Season-stats-page', {fullName: 'kevin-gausman', playerId: 95097}]//TODO
    };

    // public leadText = "MLB Leader";

    public carouselDataArray: Array<SliderCarouselInput>;

    formatData(data: SeasonStatsModuleData) {
      this.carouselDataArray = [data.carouselDataItem];

      this.moduleHeaderData = {
          moduleTitle: 'Season Stats - ' + data.profileName,
          hasIcon: false,
          iconClass: ''
      };



        // if(this.selectedTabTitle != 'Career Stats'){
        //   this.comparisonLegendData = {
        //     legendTitle: [
        //       {
        //         text: this.selectedTabTitle + ' Season',
        //         class: 'text-heavy'
        //       },
        //       {
        //         text: ' Breakdown',
        //       }
        //     ],
        //     legendValues: [
        //       {
        //         title: data.playerInfo.playerName,
        //         color: '#BC2027'
        //       },
        //       {
        //         title: 'MLB Average',
        //         color: '#444444'
        //       },
        //       {
        //         title: this.leadText,
        //         color: "#E1E1E1"
        //       }
        //     ]
        //   };
        // } else {
        //   this.comparisonLegendData = {
        //     legendTitle: [
        //       {
        //         text: 'Career Stats',
        //         class: 'text-heavy'
        //       },
        //       {
        //         text: ' Breakdown',
        //       }
        //     ],
        //     legendValues: [
        //       {
        //         title: data.playerInfo.playerName,
        //         color: '#BC2027'
        //       },
        //       {
        //         title: 'Stats High',
        //         color: "#E1E1E1"
        //       }
        //     ]
        //   };
      // }
    }

  constructor(){}

  ngOnChanges(){
    if ( this.data ) {
        this.formatData(this.data);
    }
  }

  tabSelected(tabTitle){
    // if(tabTitle != 'Current Season'){
    //   this.selectedTabTitle = tabTitle;
    // } else {
    //   this.selectedTabTitle = 'Current';
    // }
    if ( tabTitle == "Career Stats" ) {
        this.noDataMessage = "Sorry, there are no season stats available for this player.";
    }
    else {
        this.noDataMessage = "Sorry, there are no statistics available for " + tabTitle + ".";
    }
  }
}
