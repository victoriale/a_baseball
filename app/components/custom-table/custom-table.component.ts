import {Component, OnInit, Input, ViewChildren, OnChanges} from 'angular2/core';
import {TableHeader} from '../../components/custom-table/table-header.component';
import {TableRow, TableColumn} from '../../components/custom-table/table-data.component';
import {CircleImage} from '../../components/images/circle-image';

@Component({
  selector: 'custom-table',
  templateUrl: './app/components/custom-table/custom-table.component.html',
  directives: [TableHeader, CircleImage],
  providers: []
})

export class CustomTable implements OnInit, OnChanges {
  @ViewChildren(TableHeader) _tableHeaders: Array<TableHeader>;
  
  public isSortDropdownVisible: boolean = false;  
  public bodyClass: string;
  
  /**
   * The list of rows to display in the table. 
   * 
  * The length of the columns array is expected to match the length of
  * each cell array in the rows array as well as the length of the footer array.
   */
  @Input() rows: Array<TableRow>;
  
  /**
   * The column data and settings for the table. To sort by 
   * a particular column, set sortDirection for that column to either
   * -1 or 1.
   */
  @Input() columns: Array<TableColumn>;
  
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
  @Input() footer: { [key: string]: string };
  
  /**
   * If true, then the table body and footer are given the style ".custom-table-compact",
   * which uses a smaller font-size and smaller table rows.
   * Otherwise, the table body and footer are given the style ".custom-table-body".
   */
  @Input() isCompactStyle: boolean = false;
  
  ngOnInit() {
    this.updateData();
  }
  
  ngOnChanges() {
    this.updateData();
  }
  
  updateData() {    
    this.bodyClass = this.isCompactStyle ? "custom-table-compact" : "custom-table-body";
    
    var tableHdr = null;
    var columnIndex = 0;
    
    this.columns.forEach((col) => {
      if ( col.sortDirection !== 0 && tableHdr !== null ) {
        tableHdr = col;
      }
    });
    
    if ( tableHdr !== null ) {
      this.sortRows(tableHdr);
    }
  }
  
  setSortColumn($event, $event1) {
    //Remove sort on other columns;
    var sortedColumn = $event[0];
    var sortedIndex = +$event[1]; //make a number
     
    this.columns.forEach((col, i) => {
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
    this.rows.sort((row1, row2) => {
      var cell1 = row1.cells[tableHdr.key];
      var cell2 = row2.cells[tableHdr.key];
      
      if ( cell1.sortValue > cell2.sortValue ) {
        return tableHdr.sortDirection * 1;
      }
      
      if ( cell1.sortValue < cell2.sortValue ) {
        return tableHdr.sortDirection * -1;
      }
      
      return 0;
    });
  }
}