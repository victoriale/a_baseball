import {Component} from 'angular2/core';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent} from '../../components/title/title.component';
import {CustomTable} from '../../components/custom-table/custom-table.component';
<<<<<<< Updated upstream
import {TableRow, TableColumn} from '../../components/custom-table/table-data.component';
=======
import {TableRow, TableData, TableColumn} from '../../components/custom-table/table-data.component';
import {TitleInputData} from "../../components/title/title.component";
>>>>>>> Stashed changes

@Component({
    selector: 'tables-test-page',
    templateUrl: './app/webpages/tables-test-page/tables-test.page.html',
    directives: [BackTabComponent, TitleComponent,CustomTable],
})

export class TablesTestPage {
    titleData: TitleInputData;
    auHeaderTitle: string;
    
    public columns: Array<TableColumn>;
    public rows: Array<TableRow>;
    public footer: { [key:string]: string };

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
      
      this.columns = [
        {
          headerValue: "Player",
          columnClass: "image-column",
          sortDirection: 1,
          key: "player"
        },
        {
          headerValue: "Team",
          columnClass: "bold-column",
          key: "team"
        },
        { 
          headerValue: "Pos.",
          columnClass: "data-column",
          key: "position"
        },
        { 
          headerValue: "Height",
          columnClass: "data-column",
          key: "height"
        },
        { 
          headerValue: "Salary",
          columnClass: "data-column",
          isNumericType: true,
          key: "salary"
        }];
        
        this.rows = [
          {
            isSelected: true,
            cells: {
              "player": {
                sortValue: "Lucas, George",
                displayHtml: "[image] George Lucas",                
              },
              "team": {
                sortValue: "Jayhawks",
                displayHtml: "Jayhawks",                
              },
              "position": {
                sortValue: "Hitter",
                displayHtml: "Hi",                
              },
              "height": {
                sortValue: 66,
                displayHtml: "5'6\"",
              },
              "salary": {
                sortValue: 50000,
                displayHtml: "$50,000",
              }
            }         
          },
          {
            cells: {
              "player": {
                sortValue: "Jones, Jim",
                displayHtml: "[image] Jim Jones",                
              },
              "team": {
                sortValue: "Jayhawks",
                displayHtml: "Jayhawks",                
              },
              "position": {
                sortValue: "Pitcher",
                displayHtml: "Pi",                
              },
              "height": {
                sortValue: 78,
                displayHtml: "6'6\"",                
              },
              "salary": {
                sortValue: 60000,
                displayHtml: "$60,000",
              }
            }          
          },
          {
            cells: {
              "player": {
                sortValue: "Jones, Bob",
                displayHtml: "[image] Bob Jones",                
              },
              "team": {
                sortValue: "Jayhawks",
                displayHtml: "Jayhawks",                
              },
              "position": {
                sortValue: "Catcher",
                displayHtml: "Ca",                
              },
              "height": {
                sortValue: 75,
                displayHtml: "6'3\"",                
              },
              "salary": {
                sortValue: 500000,
                displayHtml: "$500,000",
              }
            }    
          },
          {
            cells: {
              "player": {
                sortValue: "Pavilion, Bob",
                displayHtml: "[image] Bob Pavilion",                
              },
              "team": {
                sortValue: "Jayhawks",
                displayHtml: "Jayhawks",                
              },
              "position": {
                sortValue: "Fielder",
                displayHtml: "Fi",                
              },
              "height": {
                sortValue: 68,
                displayHtml: "5'8\"",                
              },
              "salary": {
                sortValue: 501000,
                displayHtml: "$501,000",
              }
            }     
          },
          {
            cells: {
              "player": {
                sortValue: "Debussy, Claude",
                displayHtml: "[image] Claude Debussy",                
              },
              "team": {
                sortValue: "Jayhawks",
                displayHtml: "Jayhawks",                
              },
              "position": {
                sortValue: "Composer",
                displayHtml: "Co",                
              },
              "height": {
                sortValue: 63,
                displayHtml: "5'3\"",                
              },
              "salary": {
                sortValue: 70100,
                displayHtml: "$70,100",
              }
            }  
          },
        ];
        
        this.footer = {
          "player": "Career",
          "team": "AVERAGE",
          "position": "10",
          "height": "-",
          "salary": "$55,5555"
        };
    }
}
