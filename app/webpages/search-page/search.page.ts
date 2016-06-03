import {Component, OnInit, OnDestroy} from '@angular/core';
import {SearchPageModule} from '../../modules/search-page/search-page.module';
import {RouteParams} from "@angular/router-deprecated";
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

    constructor(_route: RouteParams, private _searchService: SearchService) {
        let query = decodeURIComponent(_route.get('query'));
        this.pageParams = {
            query: query
        }
    }

    configureSearchPageData(){
        let self = this;
        let query = self.pageParams.query;

        self._searchService.getSearch()
            .subscribe(
                data => {
                    self.searchPageInput = self._searchService.getSearchPageData(query, data);
                }
            );
    }

    ngOnInit() {
        this.configureSearchPageData();
    }

}
