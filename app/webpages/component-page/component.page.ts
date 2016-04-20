import {Component, OnInit} from 'angular2/core';
import {ComparisonBar} from '../../components/comparison-bar/comparison-bar.component';
import {ComparisonTile} from '../../components/comparison-tile/comparison-tile.component';
import {ComparisonModule} from '../../modules/comparison/comparison.module';
import {DraftHistoryModule} from '../../modules/draft-history/draft-history';

@Component({
    selector: 'Component-page',
    templateUrl: './app/webpages/component-page/component.page.html',
    directives: [ComparisonBar, ComparisonTile, ComparisonModule, DraftHistoryModule],
    providers: [],
})

export class ComponentPage implements OnInit{

      ngOnInit(){

      }
}
