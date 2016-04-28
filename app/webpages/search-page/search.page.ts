import {Component, OnInit} from 'angular2/core';
import {SearchPageModule} from '../../modules/search-page/search-page.module';

@Component({
    selector: 'search-page',
    templateUrl: './app/webpages/search-page/search.page.html',
    directives: [SearchPageModule],
    providers: []
})

export class SearchPage implements OnInit {

    ngOnInit() {

    }
}
