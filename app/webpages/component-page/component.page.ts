import {Component, OnInit} from 'angular2/core';
import {ComparisonBar} from '../../components/comparison-bar/comparison-bar.component';
import {SliderCarousel} from '../../components/slider-carousel/slider-carousel.component';
import {ComparisonTile} from '../../components/comparison-tile/comparison-tile.component';
import {ComparisonModule} from '../../modules/comparison/comparison.module';
import {DraftHistoryModule} from '../../modules/draft-history/draft-history';
import {SchedulesModule} from '../../modules/schedules/schedules';

@Component({
    selector: 'Component-page',
    templateUrl: './app/webpages/component-page/component.page.html',
    directives: [ComparisonBar, ComparisonTile, ComparisonModule, DraftHistoryModule, SchedulesModule, SliderCarousel],
    providers: [],
})

export class ComponentPage implements OnInit{

      ngOnInit(){

      }
}
