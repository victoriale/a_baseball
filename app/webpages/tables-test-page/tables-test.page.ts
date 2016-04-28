import {Component} from 'angular2/core';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent} from '../../components/title/title.component';
import {CustomTable} from '../../components/custom-table/custom-table.component';
<<<<<<< HEAD
import {TableRow, TableColumn} from '../../components/custom-table/table-data.component';
import {TitleInputData} from "../../components/title/title.component";
=======
import {TableRow, TableData, TableColumn} from '../../components/custom-table/table-data.component';
>>>>>>> develop

@Component({
    selector: 'tables-test-page',
    templateUrl: './app/webpages/tables-test-page/tables-test.page.html',
    directives: [BackTabComponent, TitleComponent,CustomTable],
})

export class TablesTestPage {
    titleData: TitleInputData;
    auHeaderTitle: string;
    
    public tableData: TableData;

    constructor() {
      this.getData();
    }

    getData(){
      //About us title
      this.titleData = {
          imageURL : '/app/public/joyfulhome_house.png',
          text1 : 'Last Updated: Monday, February 26, 2016',
          text2 : ' United States of America',
          text3 : 'Tables test Page',
          text4 : 'A test page for designing and viewing CSS styles',
          icon: 'fa fa-map-marker',
          hasHover: false
      };
      
      this.tableData = {
        isCompactStyle: true,
        columns: [
          {
            headerValue: "Player",
            columnClass: "image-column",
            sortDirection: 1
          },
          {
            headerValue: "Team",
            columnClass: "bold-column"
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
                sortValue: "Jayhawks",
                displayHtml: "Jayhawks",                
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
                sortValue: "Jayhawks",
                displayHtml: "Jayhawks",                
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
                sortValue: "Jayhawks",
                displayHtml: "Jayhawks",                
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
                sortValue: "Jayhawks",
                displayHtml: "Jayhawks",                
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
          {
            cells: [
              {
                sortValue: "Debussy, Claude",
                displayHtml: "[image] Claude Debussy",                
              },
              {
                sortValue: "Jayhawks",
                displayHtml: "Jayhawks",                
              },
              {
                sortValue: "Composer",
                displayHtml: "Co",                
              },
              {
                sortValue: 63,
                displayHtml: "5'3\"",                
              },
              {
                sortValue: 70100,
                displayHtml: "$70,100",
              }
            ]            
          },
        ],
        footer: [
          "Career",
          "AVERAGE",
          "10",
          "-",
          "$55,5555"
        ]
      };
    }
}
