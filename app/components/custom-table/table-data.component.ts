/**
 * TableColumn includes settings for styling and sorting each column,
 * as well as the display value to use for the header row. 
 */
export interface TableColumn {
  
  /**
   * The value to display in the header cell for the column.
   * HTML is not supported.
   */
  headerValue: string;
  
  /**
   * The class used to format the column's data values. They are prepended
   * with either .custom-table-body- or .custom-table-compact- depending on the 
   * value of TableData.isCompactStyle.
   * 
   *    Pre-styled classes include:
   *      * "bold-column": applies a bold style with @masterBrandColor and centers the text
   *      * "image-column": applies a bold style and left-aligns the text
   *      * "data-column": centers the text
   *    If TableData.isCompactStyle is set to true, then the font size for these 
   *    classes will be 12px. Otherwise the font size will be 16px for those classes.
   */
  columnClass: string;
  
  /**
   * If isNumericType is true, then the column's data will be sorted numerically. 
   * Otherwise (if it's undefined or false), the column's data will be
   * sorted alphabetically 
  */  
  isNumericType?: boolean;
  
  /**
   * The direction to sort the data. Defaults to 0 (no-sort) if it is not specified.
   * Possible values:
   *   -1: descending
   *    0: no sort
   *    1: ascending 
   */
  sortDirection?: number;
}

export interface TableRow {
  /**
   * A list of the TableCells to display for the row. The user
   * is expected to list the cells in the same order as their 
   * corresponding columns (in TableData.columns), as the i-th
   * column's columnClass is used to style the i-th TableCell.  
   */
  cells: Array<TableCell>;
  
  /**
   * Set isSelected to true if a particular row should be highlighted as selected.
   * The class '.custom-table-row-selected' is used to style selected rows which
   * defaults to @masterBrandColor for the background and @white for the foreground. 
   */
  isSelected?: boolean;
}

export interface TableCell {
  /**
   * The sortValue is used to sort the rows when the column headers are clicked. 
   * If the column is numeric (ie, the corresponding TableColumn has
   * isNumericType set to true), then the sortValue should be a number and it 
   * will be sorted numerically. Otherwise, sortValue should be a string which
   * will be sorted alphabetically. 
   */
  sortValue: any;
  
  /**
   * The displayValue is what gets displayed in the table for the cell and 
   * HTML elements are supported. No further formatting is applied to the values,
   * so values such as phone numbers, prices, and percents must be formatted as
   * such before setting the displayHtml string.
   */
  displayHtml: string;
}

/**
 * The length of the columns array is expected to match the length of
 * each cell array in the rows array as well as the length of the footer array.
 */
export interface TableData {
  /**
   * The column data and settings for the table. To sort by 
   * a particular column, set sortDirection for that column to either
   * -1 or 1.
   */
  columns: Array<TableColumn>;
  
  /**
   * The list of rows to display in the table.
   */
  rows: Array<TableRow>; 
  
  /**
   * (Optional) The values to display in the footer. HTML elements
   * are supported. The footer (if included) is always displayed at the bottom
   * of the table regardless of the column being sorted. If nothing is
   * set for the footer, it will not be displayed.
   * 
   * The footer style (.custom-table-footer) defaults to 12px bold and centered. 
   */
  footer?: Array<string>;
  
  /**
   * If true, then the table body and footer are given the style ".custom-table-compact",
   * which uses a smaller font-size and smaller table rows.
   * Otherwise, the table body and footer are given the style ".custom-table-body".
   */
  isCompactStyle?: boolean;
}