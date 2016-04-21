import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, Renderer} from 'angular2/core';
import {TableColumn} from '../../components/custom-table/table-data.component';

@Component({
  selector: 'custom-table-header',
  templateUrl: './app/components/custom-table/table-header.component.html',
  providers: []
})

export class TableHeader implements OnInit, OnDestroy {
  private SORT_NONE: number = 0;
  private SORT_ASC: number = 1;
  private SORT_DESC: number = -1;
  
  public isSortDropdownVisible: boolean = false;
  
  public iconSortDirection: string;
  public iconSortType: string;
  
  private hideDropdownListener: Function;
  
  @Input() headerData: TableColumn;
  @Input() headerIndex: number;
  
  @Output() sortSwitched = new EventEmitter();
  
  constructor(private _renderer: Renderer) {}
  
  ngOnInit() {
    this.iconSortType = this.headerData.isNumericType ? "numeric" : "alpha";
    this.setSortIcon();
  }
  
  displaySortDropdown() {
    this.isSortDropdownVisible = !this.isSortDropdownVisible;
    
    if ( this.hideDropdownListener === undefined ) {
      //timeout is needed so that click doesn't happen for click.
      setTimeout(() => {
        this.hideDropdownListener = this._renderer.listenGlobal('document', 'click', (event) => {
          this.isSortDropdownVisible = false;
          
          
          this.hideDropdownListener(); 
          this.hideDropdownListener = undefined;
        });
      }, 0);
    }
  }
  
  setSortIcon() {    
    switch ( this.headerData.sortDirection ) {
      case this.SORT_ASC: 
        this.iconSortDirection = "fa-sort-up";
        break;
        
      case this.SORT_DESC:
        this.iconSortDirection = "fa-sort-down";
        break;
      
      default:
      case this.SORT_NONE: 
        this.iconSortDirection = "fa-sort"; 
        break;
    }
  }
  
  sortAscending($event) {
    this.headerData.sortDirection = this.SORT_ASC;
    this.setSortIcon();
    this.sortSwitched.next([this.headerData, this.headerIndex]);
  }
  
  sortDescending($event) {
    this.headerData.sortDirection = this.SORT_DESC;
    this.setSortIcon();
    this.sortSwitched.next([this.headerData, this.headerIndex]);
  }
  
  ngOnDestroy() {
    if ( this.hideDropdownListener !== undefined ) {
       this.hideDropdownListener(); 
       this.hideDropdownListener = undefined;
    }
  }  
}