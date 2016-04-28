import {Component} from 'angular2/core';

import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {ModuleFooter, ModuleFooterData} from '../../components/module-footer/module-footer';
import {SliderCarousel} from '../../components/slider-carousel/slider-carousel.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {CustomTable} from '../../components/custom-table/custom-table.component';
import {TableColumn, TableRow, TableCell} from '../../components/custom-table/table-data.component';

import {StandingsService, StandingsTableData, TeamStandingsData} from '../../services/standings.service';

export interface StandingsTabData {
  title: string;
  tableData: Array<TableRow>;
}

@Component({
  selector: "standings-module",
  templateUrl: "./app/modules/standings/standings.module.html",
  directives: [ModuleHeader, ModuleFooter, SliderCarousel, Tabs, Tab, CustomTable],
  providers: [StandingsService]
})
export class StandingsModule {
  public headerInfo: ModuleHeaderData = {
    moduleTitle: "Standings",
    hasIcon: false,
    iconClass: ""
  };
  
  public footerInfo: ModuleFooterData = {
    infoDesc: "Want to see the full standings page?",
    text: "VIEW FULL STANDINGS",
    url: ['Standings-page']
  };
  
  //Sort by PCT (percentage of wins) by default
  public columnData: Array<TableColumn> = [{
      headerValue: "Team Name",
      columnClass: "image-column",
      key: "name"
    },{
      headerValue: "W",
      columnClass: "data-column",
      isNumericType: true,
      key: "w"
    },{
      headerValue: "L",
      columnClass: "data-column",
      isNumericType: true,
      key: "l"
    },{
      headerValue: "PCT",
      columnClass: "data-column",
      isNumericType: true,
      sortDirection: -1, //descending
      key: "pct"   
    },{
      headerValue: "GB",
      columnClass: "data-column",
      isNumericType: true,
      key: "gb"
    },{
      headerValue: "RS",
      columnClass: "data-column",
      isNumericType: true,
      key: "rs"
    },{
      headerValue: "RA",
      columnClass: "data-column",
      isNumericType: true,
      key: "ra"
    },{
      headerValue: "STRK",
      columnClass: "data-column",
      isNumericType: true,
      key: "strk"
    }];
  
  //TODO-CJP: update once carousel is ready
  public carouselData: any = {};
  public selectedTeam: string = "Baa";
  public tabs: Array<StandingsTabData> = [];
  
  constructor(private _service: StandingsService) {
    this._service.getLeagueData().subscribe(
      data => this.setupData(data),
      err => { console.log("Error getting Profile Header data"); }
    );
  }
  
  changeSelected() {
    console.log("change selected team");
    this.selectedTeam = this.selectedTeam === "Baa" ? "Aaa" : "Baa";
    this.tabs[0].tableData.forEach(row => {
      row.isSelected = ( row.cells["name"].sortValue === this.selectedTeam );
    });
  }
  
  setupData(data: Array<StandingsTableData>) {
    let leagueName = "[League Name]";
    let profileName = "[Profile Name]";
    this.headerInfo.moduleTitle = leagueName + " Standings - " + profileName;
    
    //Carousel
        
    
    //Table tabs
    data.forEach((tabData) => {
      this.tabs.push({
        title: tabData.title,
        tableData: this.formatRowData(tabData.rows, this.selectedTeam)
      })
    });
  }
  
  formatRowData(rowData: Array<TeamStandingsData>, selectedTeam: string): Array<TableRow> {
    return rowData.map((values, index) => {      
      let cells: { [key:string]: TableCell } = {
          "name": this.formatTeamNameData(values),
          "w": this.formatNumberData(values.wins),
          "l": this.formatNumberData(values.losses),
          "pct": this.formatPercentageData(values.winPercentage),
          "gb": this.formatNumberData(values.groundBalls),
          "rs": this.formatNumberData(values.runsSaved),
          "ra": this.formatNumberData(values.runsAllowed),
          "strk": this.formatStrikeData(values.strikes)
      };
      console.log("creating rows: " + values.teamName);
      return { 
        isSelected: (values.teamName === selectedTeam),  
        cells: cells
      };
    });
  }
  
  formatTeamNameData(values: TeamStandingsData): TableCell {
    return {
        sortValue: values.teamName,
        displayHtml: values.teamName,
        profileImageConfig: {
          imageClass: "image-50",
          mainImage: {
            imageUrl: values.teamImageUrl,
            placeholderImageUrl: "/app/public/profile_placeholder.png",
            imageClass: "border-2"
          }
        }
    }
  }
  
  formatNumberData(value:number): TableCell {
    return {
        sortValue: value,
        displayHtml: value.toString()
    }
  }
  
  formatPercentageData(value: number): TableCell {
    return {
        sortValue: value,
        displayHtml: value.toPrecision(3).replace(/0\./, ".") //remove leading 0
    }
  }
  
  formatStrikeData(strikes: number): TableCell {
    return {
        sortValue: strikes,
        displayHtml: "W-" + strikes
    }
  }
}