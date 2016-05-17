import {Component, OnInit} from 'angular2/core';
import {Search, SearchInput} from '../../components/search/search.component';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'header-component',
    templateUrl: './app/components/header/header.component.html',
    directives: [Search, ROUTER_DIRECTIVES],
    inputs: [],
    providers: [],
})
export class HeaderComponent implements OnInit {
  public searchInput: SearchInput = {
       placeholderText: "Search for a player or team...",
       hasSuggestions: true
  };
  ngOnInit(){}

}
