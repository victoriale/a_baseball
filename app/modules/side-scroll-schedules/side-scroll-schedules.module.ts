import {Component, Input, EventEmitter} from '@angular/core';
import {ScheduleBox} from '../../components/schedule-box/schedule-box.component'
import {SideScroll} from '../../components/carousels/side-scroll/side-scroll.component'

@Component({
    selector: 'side-scroll-schedules',
    templateUrl: './app/modules/side-scroll-schedules/side-scroll-schedules.module.html',
    directives: [ScheduleBox,SideScroll],
    providers: []
})

export class SideScrollSchedule{
  @Input() sideScrollData: any;
  public count = new EventEmitter();

  counter(event){
    console.log('counter',event);
    this.count.next(event);
  }
}
