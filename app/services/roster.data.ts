import {TableModel, TableColumn} from '../components/custom-table/table-data.component';
import {CircleImageData} from '../components/images/image-data';

export interface TeamRosterData {
  playerKey: string,
  playerName: string,
  playerPos: string,
  playerHeight: string,
  playerWeight: number,
  playerAge: number,
  playerSalary: string,
  lastUpdatedDate: Date,
  playerImageUrl: string,
}

export class RosterTableData implements TableModel<TeamRosterData> {  
  title: string;
  
  columns: Array<TableColumn> = [{
      headerValue: "Player",
      columnClass: "image-column",
      key: "name"
    },{
      headerValue: "POS.",
      columnClass: "data-column",
      key: "position"
    },{
      headerValue: "HEIGHT",
      columnClass: "data-column",
      key: "height"
    },{
      headerValue: "WEIGHT",
      columnClass: "data-column",
      isNumericType: true,
      // sortDirection: -1, //descending
      key: "weight"
    },{
      headerValue: "AGE",
      columnClass: "data-column",
      isNumericType: true,
      key: "age"
    },{
      headerValue: "SALARY",
      columnClass: "data-column",
      key: "salary"
    }];
  
  rows: Array<TeamRosterData>;
  
  selectedKey:string = null;
  
  constructor(title:string, rows: Array<TeamRosterData>) {
    this.title = title;
    this.rows = rows;
    if ( this.rows === undefined || this.rows === null ) {
      this.rows = [];
    }
    else if ( rows.length > 0 ) {
      this.selectedKey = rows[0].playerKey;
    }
  }
  
  setRowSelected(rowIndex:number) {
    if ( rowIndex >= 0 && rowIndex < this.rows.length ) {
      this.selectedKey = this.rows[rowIndex].playerKey;
    }
    else {
      this.selectedKey = null;
    }
  }
  
  isRowSelected(item:TeamRosterData, rowIndex:number): boolean {
    return this.selectedKey === item.playerKey;
  }
  
  getDisplayValueAt(item:TeamRosterData, column:TableColumn):string {
    var s = "";
    switch (column.key) {
      case "name": 
        s = item.playerName;
        break;
      
      case "position": 
        s = item.playerPos;
        break;
      
      case "height": 
        s = item.playerHeight;
        break;
      
      case "weight": 
        s = item.playerWeight + " lbs";
        break;
      
      case "age": 
        s = item.playerAge.toString();
        break;
      
      case "salary": 
        s = item.playerSalary;
        break;   
    }    
    return s;
  }
  
  getSortValueAt(item:TeamRosterData, column:TableColumn):any {
    var o: any = null;
    switch (column.key) {
      case "name": 
        o = item.playerName;
        break;
      
      case "position": 
        o = item.playerPos;
        break;
      
      case "height": 
        o = item.playerHeight;
        break;
      
      case "weight": 
        o = item.playerWeight;
        break;
      
      case "age": 
        o = item.playerAge;
        break;
      
      case "salary": 
        o = item.playerSalary;
        break;   
    }    
    return o;
  }
  
  getImageConfigAt(item:TeamRosterData, column:TableColumn):CircleImageData {
    if ( column.key === "name" ) {
      return {
          imageClass: "image-50",
          mainImage: {
            imageUrl: item.playerImageUrl,
            placeholderImageUrl: "/app/public/profile_placeholder.png",
            imageClass: "border-2"
          },
          subImages: []
        };
    }
    else {
      return undefined;
    }
  }
  
  hasImageConfigAt(column:TableColumn):boolean {
    return column.key === "name";
  }  
}