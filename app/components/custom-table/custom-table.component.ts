import {Component, OnInit, Input, ViewChildren} from 'angular2/core';
import {TableHeader} from '../../components/custom-table/table-header.component';
import {TableRow, TableData, TableColumn} from '../../components/custom-table/table-data.component';


@Component({
  selector: 'custom-table',
  templateUrl: './app/components/custom-table/custom-table.component.html',
  directives: [TableHeader],
  providers: []
})

export class CustomTable implements OnInit {
  @ViewChildren(TableHeader) _tableHeaders: Array<TableHeader>;
  
  public isSortDropdownVisible: boolean = false;  
  public bodyClass: string;
  public headerData: Array<TableColumn>;  
  public footerData: Array<string>;  
  public rows: Array<TableRow>;
  
  @Input() data: TableData;
  @Input() tableRowClass: string;
  
  ngOnInit() {
    this.updateData();
  }
  
  ngOnChange() {
    this.updateData();
  }
  
  updateData() {
    if ( this.tableRowClass === undefined || this.tableRowClass === null ) {
      this.tableRowClass = "custom-table-row";
    }
    
    this.bodyClass = this.data.isCompactStyle ? "custom-table-compact" : "custom-table-body";
    
    this.headerData = this.data.columns;
    this.rows = this.data.rows;
    this.footerData = this.data.footer;
    
    var tableHdr = null;
    var columnIndex = 0;
    
    for ( var i in this.data.columns ) {
      if ( this.data.columns[i].sortDirection !== 0 ) {
        tableHdr = this.data.columns[i];
        columnIndex = +i;
        break;
      }
    }
    
    if ( tableHdr !== null ) {
      this.sortRows(tableHdr, columnIndex);
    }
  }
  
  setSortColumn($event, $event1) {
    //Remove sort on other columns;
    var sortedColumn = $event[0];
    var sortedIndex = +$event[1]; //make a number
    
    for ( var i in this.data.columns ) {
      if ( +i !== sortedIndex ) {//compare with a number
        this.data.columns[i].sortDirection = 0;
      }      
    }
    
    this._tableHeaders.forEach(function(item, index) {    
        item.setSortIcon();
    });
    
    this.sortRows(sortedColumn, sortedIndex);
  }
  
  //TODO: Customize sort for numbers?
  sortRows(tableHdr:TableColumn, columnIndex:number) {
    this.rows.sort((row1, row2) => {
      var cell1 = row1.cells[columnIndex];
      var cell2 = row2.cells[columnIndex];
      
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