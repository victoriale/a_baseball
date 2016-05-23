import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {NgStyle} from 'angular2/common';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {Search, SearchInput} from '../../components/search/search.component';
import {PaginationFooter, PaginationParameters} from '../../components/pagination-footer/pagination-footer.component';

export interface SearchPageInput {
    //Data for the search bar component
    searchComponent: SearchInput;
    //Search Image
    heroImage: string;
    //Title Text
    headerText: string;
    //Text under title of search header
    subHeaderText: string;
    //Query string of the search
    query: string;
    //Amount of items displayed per page
    paginationPageLimit: number;
    //Tab data
    tabData: Array<{
        //Name of Tab
        tabName: string;
        //Boolean to determine if tab is initially selected
        isTabDefault?: boolean;
        //Search results related to tab
        results: Array<{
            title: string;
            url: Array<any>;
            urlText: string;
            description: string;
        }>;
        paginationParameters: PaginationParameters;
    }>
}

@Component({
    selector: 'search-page-module',
    templateUrl: './app/modules/search-page/search-page.module.html',
    directives:[ROUTER_DIRECTIVES, BackTabComponent, Tabs, Tab, Search, PaginationFooter],
    providers: [NgStyle]
})

export class SearchPageModule{
    @Input() searchPageInput: SearchPageInput;

    ngOnInit(){
        this.configureSearchPageModule();
    }

    configureSearchPageModule(){
        let input = this.searchPageInput;
        let paginationPageLimit = input.paginationPageLimit;

    }

    newIndex(index, tabIndex){
        console.log('search', index, tabIndex);
    }

    tabSelected(event){
        console.log('Tab Selected', event);
    }
}