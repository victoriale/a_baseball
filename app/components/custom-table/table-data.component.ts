
export interface TableColumn {
  headerValue: string;
  
  columnClass: string;
  
  isNumericType?: boolean;
  
  sortDirection?: number; //-1: descending; 0: none; 1: ascending
}

export interface TableRow {
  cells: Array<TableCell>;
  
  isSelected?: boolean;
}

export interface TableCell {
  sortValue: any; //used for sorting the rows when the column headers are clicked
  
  displayHtml: string; //can be HTML
}

/**
 * cells in each row is expected to have the same
 * length as columns in TableData
 */
export interface TableData {
  columns: Array<TableColumn>;
  
  rows: Array<TableRow>; 
  
  footer?: Array<string>;
  
  isCompactStyle?: boolean;
}