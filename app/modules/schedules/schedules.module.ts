import {Component, Input, Output, OnInit, EventEmitter} from 'angular2/core';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {SchedulesComponent} from '../../components/schedules/schedules.component';

@Component({
    selector: 'schedules',
    templateUrl: './app/modules/schedules/schedules.module.html',
    directives: [SchedulesComponent, ModuleHeader, ModuleFooter],
    providers: [],
    inputs:['']
})

export class SchedulesModule implements OnInit{
  @Input() data;

  @Output("tabSelected") tabSelectedListener = new EventEmitter();

  moduleTitle:string;

  ngOnInit(){
    console.log('SchedulesModule',this.data.data);
    this.moduleTitle = "[Profile] - Schedules";
  }

  tabSelected(tab) {
    this.tabSelectedListener.next(tab);
  }
}
