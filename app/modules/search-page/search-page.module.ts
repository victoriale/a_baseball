import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {NgStyle} from 'angular2/common';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {Search, SearchInput} from '../../components/search/search.component';

export interface SearchPageInput {
    searchComponent: SearchInput;
    heroImage: string;
    headerText: string;
    subHeaderText: string;
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
    directives:[ROUTER_DIRECTIVES, BackTabComponent, Tabs, Tab, Search],
    providers: [NgStyle]
})

export class SearchPageModule{
    @Input() searchPageInput: SearchPageInput;

    ngOnInit(){

    }

    tabSelected(event){
        console.log('Tab Selected', event);
    }
}