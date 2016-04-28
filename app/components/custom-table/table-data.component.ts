import {CircleImageData} from '../../components/images/image-data';

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
  
  /** 
   * The key used to look up the appropriate value for the column's cells.
   * Each row must contain a TableCell corresponding to this key.
   */
  key: string;
}

export interface TableRow {
  /** 
   * A hashmap of TableCells to display for the row. The key for
   * a cell should match the corresponding column's key (defined 
   * in the TableColumn object).   
   */
  cells: { [key:string]: TableCell }
  
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
  
  /** 
   * If a table cell contains a profile image, the configuration for that image
   * is set here. The images are inserted to the left of the displayHtml
   */
  profileImageConfig?: CircleImageData
}