import {Component, OnInit} from 'angular2/core';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {Search} from '../../components/search/search.component';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'header-component',
    templateUrl: './app/components/header/header.component.html',
    directives: [Tabs, Tab, Search, ROUTER_DIRECTIVES],
    inputs: [],
    providers: [],
})
export class HeaderComponent implements OnInit {
  ngOnInit(){}

}
