import {Component, Input, Output, OnInit, EventEmitter} from 'angular2/core';

interface searchInput {
    placeholderText: string;
}

@Component({
    selector: 'search',
    templateUrl: './app/components/search/search.component.html',
    directives:[],
    providers: []
})

export class Search{
  @Input() placeholderText;
}
