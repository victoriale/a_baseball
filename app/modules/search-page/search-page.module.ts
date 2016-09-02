import {Component, Input, Output, OnChanges, EventEmitter} from '@angular/core';
import {NgStyle} from '@angular/common';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {Search, SearchInput} from '../../components/search/search.component';
import {PaginationFooter, PaginationParameters} from '../../components/pagination-footer/pagination-footer.component';
import {NoDataBox} from '../../components/error/data-box/data-box.component';
import {ResponsiveWidget} from '../../components/responsive-widget/responsive-widget.component';

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
    directives:[ResponsiveWidget, ROUTER_DIRECTIVES, NoDataBox, BackTabComponent, Tabs, Tab, Search, PaginationFooter],
    providers: [NgStyle]
})

export class SearchPageModule implements OnChanges{
    @Input() searchPageInput: SearchPageInput;

    pageNumber: number;

    totalResults: number;

    currentShowing: string;

    constructor(private _route:RouteParams){
      if(typeof this._route.params['pageNum'] != 'undefined'){
        this.pageNumber = Number(this._route.params['pageNum']);
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
      data.tabData.forEach(function(val, index){
        if(val.isTabDefault){//Optimize
          if(val.results[self.pageNumber - 1] == null){
            val.results[self.pageNumber - 1] = [];
          }
          var pageMax = Number(val.pageMax);
          var currPage = Number(self.pageNumber);
          var totalItemsOnPage = val.results[self.pageNumber - 1].length;
          var rangeStart = (currPage - 1) * pageMax + 1;
          var rangeEnd = rangeStart + totalItemsOnPage - 1;
          if(val.results[self.pageNumber - 1].length > 0){
            self.currentShowing = rangeStart + ' - ' + rangeEnd;
          }else{
            self.currentShowing = '0 - 0';
          }
          self.totalResults = Number(val.totalResults);
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
