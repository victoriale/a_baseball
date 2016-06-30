import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {NgClass} from '@angular/common';
import {RouteParams, ROUTER_DIRECTIVES, RouteConfig, Router} from '@angular/router-deprecated';
import {GlobalFunctions} from '../../global/global-functions';
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';
import {DateTimePipe} from '../../pipes/datetime-format.pipe';
import {Link} from '../../global/global-interface';
import {PagingData, DirectoryModuleData} from './directory.data';
import {DirectoryPagination} from './directory-pagination.component';
import {NoDataBox} from '../../components/error/data-box/data-box.component';

@Component({
    selector: 'directory-module',
    templateUrl: './app/modules/directory/directory.module.html',
    directives: [ROUTER_DIRECTIVES, NgClass, LoadingComponent, ErrorComponent, DirectoryPagination, NoDataBox],
    providers: [],
    pipes: [DateTimePipe]
})

export class DirectoryModule implements OnChanges {
  @Input() data: DirectoryModuleData;

  @Input() currentPage: number = 0;

  //Boolean to determine if an error has occurred
  @Input() isError: boolean = false;

  public isLoading: boolean = true;
  public pagingDescription: PagingData;
  public nextLink: Link = {
    text: "Next"
  }
  public prevLink: Link = {
    text: "Back"
  }

  constructor(private router: Router) {}

  ngOnChanges() {
    this.setupData();
  }

  setupData() {
    if ( this.data === undefined || this.data === null  ){
      this.pagingDescription = null;
      this.isLoading = true; //it may still be loading
      return;
    }

    if ( this.data.listingItems === undefined || this.data.listingItems === null  ){
      console.error("Unable to set up paging parameters: listing data is undefined");
      this.pagingDescription = null;
      return;
    }

    this.isLoading = false;

    var pageName:string = this.data.pageName;
    var maxPageCount: number = Math.ceil(this.data.listingItems.totalItems / this.data.listingsLimit);
    var currPage: number = this.currentPage;

    //Next Page
    this.nextLink.route = [pageName, { page: currPage + 1 }]
    this.setPageParams(this.nextLink);

    //Previous Page
    this.prevLink.route = [pageName, { page: currPage - 1 }]
    this.setPageParams(this.prevLink);

    //Determine range display for directory page (ex. 1-20, 22-40, etc)
    var rangeStart = 0;
    var rangeEnd = 0;    
    var totalItems = 0;
    if ( this.data.hasListings ) {
      rangeStart = (currPage - 1) * this.data.listingsLimit + 1;
      rangeEnd = (currPage * this.data.listingsLimit <= this.data.listingItems.totalItems) ? (currPage * this.data.listingsLimit) : this.data.listingItems.totalItems;
      totalItems = this.data.listingItems.totalItems;
    }

    this.pagingDescription = {
      rangeText: GlobalFunctions.commaSeparateNumber(rangeStart) + "-" + GlobalFunctions.commaSeparateNumber(rangeEnd),
      totalItems: totalItems,
      totalPages: maxPageCount,
      currentPage: currPage,
      description: this.data.pagingDescription
    }
  }

  setPageParams(link: Link) {
    for ( var key in this.data.pageParams ) {
      //assuming key is field.
      link.route[1][key] = this.data.pageParams[key];
    }
  }
}
