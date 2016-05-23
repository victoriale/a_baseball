import {Component, Input, Output, OnInit, EventEmitter} from 'angular2/core';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {SchedulesComponent} from '../../components/schedules/schedules.component';
import {RouteParams} from 'angular2/router';
import {GlobalFunctions} from '../../global/global-functions';

@Component({
    selector: 'schedules',
    templateUrl: './app/modules/schedules/schedules.module.html',
    directives: [SchedulesComponent, ModuleHeader, ModuleFooter],
    providers: [],
    inputs:['']
})

export class SchedulesModule implements OnInit{
    @Input() data;
    @Input() profHeader;
    @Output("tabSelected") tabSelectedListener = new EventEmitter();
    footerData:any;
    tabData: any;
    constructor(private params: RouteParams){

    }
    moduleTitle:string;

    ngOnInit(){
        this.moduleTitle = this.profHeader.profileName + " - Schedules";
        if(typeof this.params.get('teamId') != 'undefined'){
            this.footerData = {
                infoDesc: 'Want to see everybody involved in this list?',
                text: 'VIEW THE LIST',
                url: ['Schedules-page-team',{teamName:GlobalFunctions.toLowerKebab(this.profHeader.profileName), teamId:this.params.get('teamId'), pageNum:1}]
            };
        }else{
            this.footerData = {
                infoDesc: 'Want to see everybody involved in this list?',
                text: 'VIEW THE LIST',
                url: ['Schedules-page-league', {pageNum:1}]
            };
        }
    }

    ngOnChanges(){
        if(typeof this.data != 'undefined'){
            if(typeof this.tabData == 'undefined'){
                this.tabData = this.data.tabs;
            }
        }
    }

    tabSelected(tab) {
        this.tabSelectedListener.next(tab);
    }
}
