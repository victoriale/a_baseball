import {Component} from 'angular2/core';
import {DetailedListItem} from '../../components/detailed-list-item/detailed-list-item';
import {ModuleFooter} from '../../components/module-footer/module-footer';
import {ModuleHeader} from '../../components/module-header/module-header';

interface Schedules{

}

@Component({
    selector: 'schedules',
    templateUrl: './app/modules/schedules/schedules.html',
    directives: [DetailedListItem, ModuleHeader, ModuleFooter],
    providers: [],
    inputs:['locData']
})

export class SchedulesModule{
  moduleTitle:string = "Module Title";
}
