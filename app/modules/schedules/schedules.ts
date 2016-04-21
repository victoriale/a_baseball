import {Component} from 'angular2/core';
import {ModuleFooter} from '../../components/module-footer/module-footer';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {SchedulesCarousel} from '../../components/carousels/schedules-carousel/schedules-carousel';

interface Schedules{

}

@Component({
    selector: 'schedules',
    templateUrl: './app/modules/schedules/schedules.html',
    directives: [SchedulesCarousel, ModuleHeader, ModuleFooter],
    providers: [],
    inputs:['']
})

export class SchedulesModule{
  moduleTitle:string = "Module Title";
}
