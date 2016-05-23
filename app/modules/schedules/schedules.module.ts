import {Component, Input, Output, OnInit, EventEmitter} from 'angular2/core';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {SchedulesComponent} from '../../components/schedules/schedules.component';
import {RouteParams} from 'angular2/router';

@Component({
    selector: 'schedules',
    templateUrl: './app/modules/schedules/schedules.module.html',
    directives: [SchedulesComponent, ModuleHeader, ModuleFooter],
    providers: [],
    inputs:['']
})

export class SchedulesModule implements OnInit{
    @Input() data;
    footerData:any;
    @Output("tabSelected") tabSelectedListener = new EventEmitter();

    constructor(private params: RouteParams){
        if(typeof this.params.get('teamId') != 'undefined'){
            this.footerData = {
                infoDesc: 'Want to see everybody involved in this list?',
                text: 'VIEW THE LIST',
                url: ['Schedules-page-team',{teamName:this.params.get('teamName'), teamId:this.params.get('teamId'), pageNum:1}]
            };
        }else{
            this.footerData = {
                infoDesc: 'Want to see everybody involved in this list?',
                text: 'VIEW THE LIST',
                url: ['Schedules-page-league', {pageNum:1}]
            };
        }
    }
    moduleTitle:string;

    ngOnInit(){
        this.moduleTitle = "[Profile] - Schedules";
    }

    tabSelected(tab) {
        this.tabSelectedListener.next(tab);
    }
}
