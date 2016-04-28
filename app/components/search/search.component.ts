import {Component, Input, Output, OnInit, EventEmitter} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Control} from 'angular2/common';


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

    public term: any = new Control();

    ngOnInit(){
        console.log('search initialized', this);
        this.term.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(data => console.log('hi', data))
    }
}
