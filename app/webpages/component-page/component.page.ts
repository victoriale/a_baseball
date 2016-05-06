import {Component, OnInit} from 'angular2/core';
import {ComparisonModule} from '../../modules/comparison/comparison.module';
import {SeasonStatsModule} from '../../modules/season-stats/season-stats.module';
import {DraftHistoryModule} from '../../modules/draft-history/draft-history.module';
import {BoxScoresModule} from '../../modules/box-scores/box-scores.module';
import {SchedulesModule} from '../../modules/schedules/schedules.module';
import {TeamRosterModule} from '../../modules/team-roster/team-roster.module';
import {AboutUsModule} from '../../modules/about-us/about-us.module';
import {ShareButtonComponent} from '../../components/share-button/share-button.component';
import {ProfileHeaderModule} from '../../modules/profile-header/profile-header.module';
import {Search} from '../../components/search/search.component';
import {SchedulesCarousel} from '../../components/carousels/schedules-carousel/schedules-carousel.component';
import {Carousel} from '../../components/carousels/carousel.component';
import {SliderCarousel} from '../../components/carousels/slider-carousel/slider-carousel.component';

import {StandingsComponentData, TableTabData} from '../../components/standings/standings.component';
import {StandingsModule} from '../../modules/standings/standings.module';
import {StandingsService} from '../../services/standings.service';
import {MLBStandingsTableModel, MLBStandingsTableData} from '../../services/standings.data';

import {Division, Conference, MLBPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';

@Component({
    selector: 'Component-page',
    templateUrl: './app/webpages/component-page/component.page.html',
    directives: [
      SliderCarousel,
      Carousel,
      SchedulesCarousel,
      BoxScoresModule,
      ShareButtonComponent,
      TeamRosterModule,
      ComparisonModule,
      DraftHistoryModule,
      SchedulesModule,
      SeasonStatsModule,
      Search,
      AboutUsModule,
      ProfileHeaderModule,
      StandingsModule
    ],
    providers: [StandingsService]
})

export class ComponentPage implements OnInit {
  pageParams: MLBPageParameters;
  standingsData: StandingsComponentData;
  
  constructor(private _standingsService: StandingsService, private _globalFunctions: GlobalFunctions, private _mlbFunctions: MLBGlobalFunctions) {     
    //TODO: Pull from URL
    if ( this.pageParams === undefined || this.pageParams === null ) {
      this.pageParams = {
        division: Division.east,
        conference: Conference.american
      };
    }
  }
  
  ngOnInit() {    
    this.setupStandingsData();
  }

  setupStandingsData() {
    let groupName = this._mlbFunctions.formatGroupName(this.pageParams.conference, this.pageParams.division);
    let moduletitle = groupName + " Standings";
    if ( this.pageParams.teamName !== undefined && this.pageParams.teamName !== null ) {
      moduletitle += " - " + this.pageParams.teamName;
    }
    
    this.standingsData = {
      moduleTitle: moduletitle,
      tabs: this._standingsService.initializeAllTabs(this.pageParams)
    }
    
    let self = this;
    this.standingsData.tabs.forEach(tab => function(tab) {
      self._standingsService.loadTabData(tab, 5) //only show 5 rows in the module
    });
  }
}
