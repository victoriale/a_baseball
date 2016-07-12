import {Component, OnInit, Input} from '@angular/core';
import {SideScrollSchedule} from '../../modules/side-scroll-schedules/side-scroll-schedules.module'
@Component({
    selector: 'deep-dive-page',
    templateUrl: './app/webpages/deep-dive-page/deep-dive.page.html',
    directives: [SideScrollSchedule],
    providers: [],
})

export class DeepDivePage implements OnInit {
    constructor() {

    }

    ngOnInit(){

    }
}
