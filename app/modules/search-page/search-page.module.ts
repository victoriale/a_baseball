import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';

export interface SearchPageInput {
    query: string;
    tabData: Array<{
        tabName: string;
        isTabDefault?: boolean;
        results: Array<{
            title: string;
            url: Array<any>;
            urlText: string;
            description: string;
        }>
    }>
}

@Component({
    selector: 'search-page-module',
    templateUrl: './app/modules/search-page/search-page.module.html',
    directives:[ROUTER_DIRECTIVES, BackTabComponent, Tabs, Tab],
    providers: []
})

export class SearchPageModule{
    @Input() searchPageInput: SearchPageInput;

    public resultsList: Array<Object> = [
        {},
        {},
        {}
    ];
    public tabs: Array<Object> = [
        {
            title: 'Player (100)',
            active: true
        },
        {
            title: 'Team (0)'
        },
        {
            title: 'News (5)'
        }
    ];

    ngOnInit(){

    }

    tabSelected(event){
        console.log('Tab Selected', event);
    }
}