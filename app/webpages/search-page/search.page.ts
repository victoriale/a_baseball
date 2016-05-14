import {Component, OnInit, OnDestroy} from 'angular2/core';
import {SearchPageModule} from '../../modules/search-page/search-page.module';
import {RouteParams} from 'angular2/router';
import {SearchService} from '../../services/search.service';
import {SearchPageInput} from '../../modules/search-page/search-page.module';

interface SearchPageParams {
    query: string;
}

@Component({
    selector: 'search-page',
    templateUrl: './app/webpages/search-page/search.page.html',
    directives: [SearchPageModule],
    providers: []
})

export class SearchPage implements OnInit {
    public pageParams: SearchPageParams;

    public searchPageInput: SearchPageInput;

    constructor(_params: RouteParams, private _searchService: SearchService) {
        let query = decodeURIComponent(_params.get('query'));
        this.pageParams = {
            query: query
        }
    }

    configureSearchPageData(){
        let self = this;
        let query = self.pageParams.query;

        self._searchService.getSearchPageData(query)
            .subscribe(
                data => {
                    console.log('datatatata', data);
                    self.searchPageInput = data;
                }
            );

        console.log('this', this);
    }

    ngOnInit() {
        this.configureSearchPageData();
    }

}
