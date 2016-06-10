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
    seasonId: string;
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

export class SeasonStatsModule implements OnInit, OnChanges {
    @Input() teamList: Array<{key: string, value: string}>;
    @Input() data: SeasonStatsData;
    noDataMessage = "Sorry, there are no values for this season.";
    public moduleHeaderData: Object;
    public comparisonLegendData: ComparisonLegendInput;
    public dataIndex: number = 0;
    public selectedTabTitle: string;
    public footerData: ModuleFooterData = {
      infoDesc: 'Want to see full statistics for this player?',
      text: 'VIEW FULL STATISTICS',
      url: ['Season-stats-page', {fullName: 'kevin-gausman', playerId: 95097}]//TODO
    };
    public leadText = "MLB Leader";
    tabs: Array<ComparisonTabData> = [];
    public carouselDataArray: any;
    formatData(data: SeasonStatsData) {
        // var selectedSeason = new Date().getFullYear(); //TODO: get from selected tab.
        this.carouselDataArray = [{
            backgroundImage: GlobalSettings.getImageUrl(data.playerInfo.liveImage),
             imageConfig: {
               imageClass: "image-150",
               mainImage: {
                 imageUrl: GlobalSettings.getImageUrl(data.playerInfo.playerHeadshot),
                 imageClass: "border-large",
               },
               subImages: [
                 {
                   imageUrl:  GlobalSettings.getImageUrl(data.playerInfo.teamLogo),
                   urlRouteArray: MLBGlobalFunctions.formatTeamRoute(data.playerInfo.teamName,data.playerInfo.teamId),
                   hoverText: "<i class='fa fa-mail-forward'></i>",
                   imageClass: "image-50-sub image-round-lower-right"
                 }
               ],
             },
             description:[
               '<p style="font-size: 12px;"><i class="fa fa-circle" style="color:#bc2027; padding-right: 5px;"></i> CURRENT SEASON STATS REPORT</p>',
               '<p style="font-size: 22px; font-weight: 800; padding:9px 0;">'+data.playerInfo.playerName+'</p>',
               '<p style="font-size: 14px; line-height: 1.4em;">Team: <b style="font-weight:800;">' + data.playerInfo.teamName + '</b></p>',
               '<p style="font-size: 10px; padding-top:12px;">Last Updated On ' + GlobalFunctions.formatUpdatedDate(data.playerInfo.lastUpdated) + '</p>'
             ]
        }];

        this.moduleHeaderData = {
            moduleTitle: 'Season Stats - ' + data.playerInfo.playerName,
            hasIcon: false,
            iconClass: ''
        };
        if(this.selectedTabTitle != 'Career Stats'){
          this.comparisonLegendData = {
            legendTitle: [
              {
                text: this.selectedTabTitle + ' Season',
                class: 'text-heavy'
              },
              {
                text: ' Breakdown',
              }
            ],
            legendValues: [
              {
                title: data.playerInfo.playerName,
                color: '#BC2027'
              },
              {
                title: 'MLB Average',
                color: '#444444'
              },
              {
                title: this.leadText,
                color: "#E1E1E1"
              }
            ]
          };
        } else {
          this.comparisonLegendData = {
            legendTitle: [
              {
                text: 'Career Stats',
                class: 'text-heavy'
              },
              {
                text: ' Breakdown',
              }
            ],
            legendValues: [
              {
                title: data.playerInfo.playerName,
                color: '#BC2027'
              },
              {
                title: 'Stats High',
                color: "#E1E1E1"
              }
            ]
          };
      }
    }
    constructor(){}
    ngOnInit(){
    }
    ngOnChanges(){
      if ( this.data && this.tabs ) {
          this.formatData(this.data);
      }
    }
    tabSelected(tabTitle){
      if(tabTitle != 'Current Season'){
        this.selectedTabTitle = tabTitle;
      } else {
        this.selectedTabTitle = 'Current';
      }
      this.formatData(this.data);
      if ( tabTitle == "Career Stats" ) {
          this.noDataMessage = "Sorry, there are no season stats available for this player.";
      }
      else {
          this.noDataMessage = "Sorry, there are no statistics available for " + tabTitle + ".";
      }
    }
}
