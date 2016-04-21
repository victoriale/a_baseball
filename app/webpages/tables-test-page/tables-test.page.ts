import {Component} from 'angular2/core';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent} from '../../components/title/title.component';
import {CustomTable} from '../../components/custom-table/custom-table.component';
import {TableRow, TableData, TableColumn} from '../../components/custom-table/table-data.component';

@Component({
    selector: 'tables-test-page',
    templateUrl: './app/webpages/tables-test-page/tables-test.page.html',
    directives: [BackTabComponent, TitleComponent,CustomTable],
})

export class TablesTestPage {
    titleData: {};
    auHeaderTitle: string;
    
    public tableData: TableData;

    constructor() {
      this.getData();
    }

    getData(){
      //About us title
      this.titleData = {
          imageURL : '/app/public/joyfulhome_house.png',
          smallText1 : 'Last Updated: Monday, February 26, 2016',
          smallText2 : ' United States of America',
          heading1 : 'Tables test Page',
          heading2 : '',
          heading3 : 'A test page for designing and viewing CSS styles',
          heading4 : '',
          icon: 'fa fa-map-marker',
          hasHover: false
      };
      
      this.tableData = {
        isCompactStyle: false,
        columns: [
          {
            headerValue: "Player",
            columnClass: "image-column"
          },
          { 
            headerValue: "Pos.",
            columnClass: "data-column"
          },
          { 
            headerValue: "Height",
            columnClass: "data-column"
          },
          { 
            headerValue: "Salary",
            columnClass: "data-column",
            isNumericType: true
          }
        ],
        rows: [
          {
            isSelected: true,
            cells: [
              {
                sortValue: "Lucas, George",
                displayHtml: "[image] George Lucas",                
              },
              {
                sortValue: "Hitter",
                displayHtml: "Hi",                
              },
              {
                sortValue: 66,
                displayHtml: "5'6\"",
              },
              {
                sortValue: 50000,
                displayHtml: "$50,000",
              }
            ]            
          },
          {
            cells: [
              {
                sortValue: "Jones, Jim",
                displayHtml: "[image] Jim Jones",                
              },
              {
                sortValue: "Pitcher",
                displayHtml: "Pi",                
              },
              {
                sortValue: 78,
                displayHtml: "6'6\"",                
              },
              {
                sortValue: 60000,
                displayHtml: "$60,000",
              }
            ]            
          },
          {
            cells: [
              {
                sortValue: "Jones, Bob",
                displayHtml: "[image] Bob Jones",                
              },
              {
                sortValue: "Catcher",
                displayHtml: "Ca",                
              },
              {
                sortValue: 75,
                displayHtml: "6'3\"",                
              },
              {
                sortValue: 500000,
                displayHtml: "$500,000",
              }
            ]            
          },
          {
            cells: [
              {
                sortValue: "Pavilion, Bob",
                displayHtml: "[image] Bob Pavilion",                
              },
              {
                sortValue: "Fielder",
                displayHtml: "Fi",                
              },
              {
                sortValue: 68,
                displayHtml: "5'8\"",                
              },
              {
                sortValue: 501000,
                displayHtml: "$501,000",
              }
            ]            
          },
        ],
        // footer: [
        //   "Average",
        //   "10",
        //   "-",
        //   "$555555"
        // ]
      };
    }
}
