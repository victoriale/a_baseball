import {Component, OnInit, Input, DoCheck, OnChanges} from 'angular2/core';
import {RouteParams} from "angular2/router";
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent, TitleInputData} from "../../components/title/title.component";

@Component({
    selector: 'Season-stats-page',
    templateUrl: './app/webpages/season-stats-page/season-stats.page.html',
    directives: [BackTabComponent,
                TitleComponent],
})

export class SeasonStatsPage implements OnInit {
  public titleData: TitleInputData;
  ngOnInit() {
  }

}
