import {Component, OnInit, Input} from '@angular/core';
import {ScheduleBox} from '../../components/schedule-box/schedule-box.component'

@Component({
    selector: 'side-scroll-schedules',
    templateUrl: './app/modules/side-scroll-schedules/side-scroll-schedules.module.html',
    directives: [ScheduleBox],
    providers: []
})

export class SideScrollSchedule{

}
