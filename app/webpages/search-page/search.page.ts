import {Component, OnInit, OnDestroy} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {GlobalSettings} from "../../global/global-settings";
import {SearchPageModule} from '../../modules/search-page/search-page.module';
import {SearchService} from '../../services/search.service';
import {SearchPageInput} from '../../modules/search-page/search-page.module';
import {SidekickWrapper} from "../../components/sidekick-wrapper/sidekick-wrapper.component";

interface SearchPageParams {
    query: string;
}

@Component({
    selector: 'search-page',
    templateUrl: './app/webpages/search-page/search.page.html',
    directives: [SidekickWrapper, SearchPageModule],
    providers: [Title]
})

export class SearchPage implements OnInit {
    public pageParams: SearchPageParams;

    public searchPageInput: SearchPageInput;

    constructor(_params: RouteParams, private _searchService: SearchService, private _title: Title) {
        _title.setTitle(GlobalSettings.getPageTitle("Search"));
        let query = decodeURIComponent(_params.get('query'));
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
