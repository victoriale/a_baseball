import {Component, OnInit} from 'angular2/core';
import {DraftHistoryModule} from '../../modules/draft-history/draft-history';

@Component({
    selector: 'Component-page',
    templateUrl: './app/webpages/component-page/component.page.html',
    directives: [DraftHistoryModule],
    providers: [],
})

export class ComponentPage implements OnInit{

      ngOnInit(){

      }
}
