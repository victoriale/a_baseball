import {Component, OnInit} from 'angular2/core';
import {DraftHistoryModule} from '../../modules/draft-history/draft-history.module';


@Component({
    selector: 'Design-page',
    templateUrl: './app/webpages/design-page/design.page.html',
    directives: [DraftHistoryModule],
    providers: []
})

export class DesignPage implements OnInit {
  constructor() {

  }

  ngOnInit() {

  }

}
