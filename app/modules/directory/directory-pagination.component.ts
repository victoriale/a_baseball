import {Component, OnInit, Input, OnChanges} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Link, PagingData} from './directory.data';

@Component({
    selector: 'directory-pagination',
    templateUrl: './app/modules/directory/directory-pagination.component.html',
    directives: [ROUTER_DIRECTIVES, NgClass],
    providers: []
})

export class DirectoryPagination implements OnChanges {
  @Input() data: PagingData;
  @Input() nextLink: Link;
  @Input() prevLink: Link;
  
  public enablePrev: boolean;
  public enableNext: boolean;
  
  constructor() {
    this.pagesUpdated();
  }
  
  ngOnChanges() {
    this.pagesUpdated(); 
  }
  
  pagesUpdated() {
    if ( this.data !== undefined && this.data !== null ) {
      this.enableNext = this.data.currentPage + 1 <= this.data.totalPages;
      this.enablePrev = this.data.currentPage -1 > 0;
    }
    else {
      this.enableNext = false;
      this.enablePrev = false;
    }
  }
}