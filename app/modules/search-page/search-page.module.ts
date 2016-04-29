import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {BackTabComponent} from '../../components/backtab/backtab.component';

@Component({
    selector: 'search-page-module',
    templateUrl: './app/modules/search-page/search-page.module.html',
    directives:[BackTabComponent],
    providers: []
})

export class SearchPageModule{

}