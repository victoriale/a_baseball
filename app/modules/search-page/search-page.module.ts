import {Component, Input, Output, OnChanges, EventEmitter} from 'angular2/core';
import {NgStyle} from 'angular2/common';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {Search, SearchInput} from '../../components/search/search.component';
import {PaginationFooter, PaginationParameters} from '../../components/pagination-footer/pagination-footer.component';
import {NoDataBox} from '../../components/error/data-box/data-box.component';

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
        error:{
          message:string;
          icon:string;
        };
        pageMax:any;
        totalResults:any;
        paginationParameters: PaginationParameters;
    }>
}

@Component({
    selector: 'search-page-module',
    templateUrl: './app/modules/search-page/search-page.module.html',
    directives:[ROUTER_DIRECTIVES, NoDataBox, BackTabComponent, Tabs, Tab, Search, PaginationFooter],
    providers: [NgStyle]
})

export class SearchPageModule implements OnChanges{
    @Input() searchPageInput: SearchPageInput;
    pageNumber:any;
    showResults:any;
    currentShowing:any;
    constructor(private _route:RouteParams){
      if(typeof this._route.params['pageNum'] != 'undefined'){
        this.pageNumber = this._route.params['pageNum'];
      }else{
        this.pageNumber = 1;// if nothing is in route params then default to first piece of obj array
      }
    }
    ngOnChanges(){
        this.configureSearchPageModule();
        this.getShowResults(this.searchPageInput);
    }

    configureSearchPageModule(){
        let input = this.searchPageInput;
    }

    newIndex(index){
        this.pageNumber = index;
        window.scrollTo(0,0);
        this.getShowResults(this.searchPageInput);
    }

    getShowResults(data){
      let self = this;
      data.tabData.forEach(function(val,index){
        if(val.isTabDefault){//Optimize
          var currentTotal = (val.pageMax * (self.pageNumber - 1));
          if(val.results.length > 0){
            self.currentShowing = Number(currentTotal) + ' - ' + (Number(currentTotal) + Number(val.results[self.pageNumber - 1].length));
          }else{
            self.currentShowing = '0 - 0';

          }
          self.showResults = val.totalResults;
        }
      })
    }

    tabSelected(event){
      this.pageNumber = 1;
      this.searchPageInput.tabData.forEach(function(val,index){
        if(val.tabName == event){//Optimize
          val.isTabDefault = true;
        }else{
          val.isTabDefault = false;
        }
      })
      this.getShowResults(this.searchPageInput);
    }
}
