import {Component, Input, ViewChildren, OnChanges, EventEmitter, Output} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {TableHeader} from '../../components/custom-table/table-header.component';
import {TableModel, TableColumn} from '../../components/custom-table/table-data.component';
import {CircleImage} from '../../components/images/circle-image';

@Component({
  selector: 'custom-table',
  templateUrl: './app/components/custom-table/custom-table.component.html',
  directives: [TableHeader, CircleImage, ROUTER_DIRECTIVES]
})

export class CustomTable implements OnChanges {
  @ViewChildren(TableHeader) _tableHeaders: Array<TableHeader>;
  
  @Output() sortChanged = new EventEmitter();
  
  public isSortDropdownVisible: boolean = false;  
  
  public bodyClass: string;
  
  /**
   * The column data and settings for the table. To sort by 
   * a particular column, set sortDirection for that column to either
   * -1 or 1.
   */
  columns: Array<TableColumn>;
  
  /**
   * (Optional) The values to display in the footer. The footer keys 
   * correspond to the keys defined in the TableColumn array and 
   * the values can contain HTML elements. The footer (if included) 
   * is always displayed at the bottom of the table regardless of
   * the column being sorted. If no values are set for the footer, 
   * it will not be displayed.
   * 
   * 
   * 
   * The footer style (.custom-table-footer) defaults to 12px bold and centered. 
   */
  footer: { [key: string]: string };
  
  @Input() model: TableModel<any>;
  
  /**
   * If true, then the table body and footer are given the style ".custom-table-compact",
   * which uses a smaller font-size and smaller table rows.
   * Otherwise, the table body and footer are given the style ".custom-table-body".
   */
  @Input() isCompactStyle: boolean = false;
  
  ngOnChanges() {
    this.updateData();
  }
  
  updateData() {
    this.bodyClass = this.isCompactStyle ? "custom-table-compact" : "custom-table-body";
    
    if ( this.model === undefined || this.model === null ) {
      return;
    }
    
    var sortedColumn = null;
    var columnIndex = 0;
    
    this.model.columns.forEach((col) => {
      if ( col.sortDirection && !sortedColumn ) {
        sortedColumn = col;
      }
    });
    
    if ( sortedColumn !== null ) {
      this.sortRows(sortedColumn);
    }
  }
  
  setSortColumn($event, $event1) {
    //Remove sort on other columns;
    var sortedColumn = $event[0];
    var sortedIndex = +$event[1]; //make a number
     
    this.model.columns.forEach((col, i) => {
      if ( i !== sortedIndex ) {
        col.sortDirection = 0;
      }
    });
    
    this._tableHeaders.forEach(function(item, index) {    
        item.setSortIcon();
    });
    
    this.sortRows(sortedColumn);
  }
  
  //TODO-CJP: Customize sort for numbers?
  sortRows(tableHdr:TableColumn) {
    this.model.rows.sort((row1, row2) => {
      var value1 = this.model.getSortValueAt(row1, tableHdr);
      var value2 = this.model.getSortValueAt(row2, tableHdr);
      
      if ( value1 > value2 ) {
        return tableHdr.sortDirection * 1;
      }
      
      if ( value1 < value2 ) {
        return tableHdr.sortDirection * -1;
      }
      
      return 0;
    });
    this.sortChanged.next(this.model.rows);
  }
}