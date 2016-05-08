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
import {StandingsModule} from '../../modules/standings/standings.module';
import {Search} from '../../components/search/search.component';
import {ListOfListModule} from "../../modules/list-of-list/list-of-list.module";

@Component({
    selector: 'Component-page',
    templateUrl: './app/webpages/component-page/component.page.html',
    directives: [
      BoxScoresModule,
      ShareButtonComponent,
      TeamRosterModule,
      ComparisonModule,
      DraftHistoryModule,
      ListOfListModule,
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
