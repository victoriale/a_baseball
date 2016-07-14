import {Component, OnInit, Input} from '@angular/core';
import {SidekickWrapper} from '../../components/sidekick-wrapper/sidekick-wrapper.component';
import {WidgetModule} from '../../modules/widget/widget.module';
import {SideScrollSchedule} from '../../modules/side-scroll-schedules/side-scroll-schedules.module';

@Component({
    selector: 'deep-dive-page',
    templateUrl: './app/webpages/deep-dive-page/deep-dive.page.html',
    directives: [SidekickWrapper, WidgetModule, SideScrollSchedule],
    providers: [],
})

export class DeepDivePage implements OnInit {
    constructor() {

    }

    ngOnInit(){

    }
}
