import {Component, OnInit} from 'angular2/core';
import {ComparisonModule} from '../../modules/comparison/comparison.module';
import {SeasonStatsModule} from '../../modules/season-stats/season-stats.module';
import {DraftHistoryModule} from '../../modules/draft-history/draft-history';
import {SchedulesModule} from '../../modules/schedules/schedules';
import {TeamRosterModule} from '../../modules/team-roster/team-roster.module';

@Component({
    selector: 'Component-page',
    templateUrl: './app/webpages/component-page/component.page.html',
    directives: [TeamRosterModule, ComparisonModule, DraftHistoryModule, SchedulesModule, SeasonStatsModule],
    providers: [],
})

export class ComponentPage implements OnInit{

      ngOnInit(){

      }
}
