import {Component, OnInit} from 'angular2/core';
import {ComparisonModule} from '../../modules/comparison/comparison.module';
import {SeasonStatsModule} from '../../modules/season-stats/season-stats.module';
import {DraftHistoryModule} from '../../modules/draft-history/draft-history';
import {BoxScoresModule} from '../../modules/box-scores/box-scores';
import {SchedulesModule} from '../../modules/schedules/schedules';
import {TeamRosterModule} from '../../modules/team-roster/team-roster.module';
import {AboutUsModule} from '../../modules/about-us/about-us.module';
import {ShareButtonComponent} from '../../components/share-button/share-button.component';
import {ProfileHeaderModule} from '../../modules/profile-header/profile-header.module';
import {StandingsModule} from '../../modules/standings/standings.module';
import {Search} from '../../components/search/search.component';

@Component({
    selector: 'Component-page',
    templateUrl: './app/webpages/component-page/component.page.html',
    directives: [
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
    providers: [],
})

export class ComponentPage implements OnInit{

      ngOnInit(){

      }
}
