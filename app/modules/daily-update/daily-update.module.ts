import {Component, Input} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';

@Component({
    selector: 'daily-update-module',
    templateUrl: './app/modules/daily-update/daily-update.module.html',
    directives: [ModuleHeader],
    providers: []
})

export class DailyUpdateModule{
    public displayData: Object;
    public backgroundImage: string;
    
    @Input() dailyUpdateDataArray: Array<Object>;
    @Input() profileName: string;
    public headerInfo: ModuleHeaderData = {
      moduleTitle: "Daily Update - [Profile Name]",
      hasIcon: true,
      iconClass: null
    };

    constructor(){ }

}
