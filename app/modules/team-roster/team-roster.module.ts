import {Component} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {ModuleFooter, ModuleFooterData} from '../../components/module-footer/module-footer';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {Carousel} from '../../components/carousels/carousel';
import {CustomTable} from '../../components/custom-table/custom-table.component';
import {TableColumn, TableRow, TableCell} from '../../components/custom-table/table-data.component';

import {RosterService, RosterTableData, TeamRosterData} from '../../services/roster.service';

export interface RosterTabData {
  title: string;
  tableData: Array<TableRow>;
}
@Component({
    selector: 'team-roster-module',
    templateUrl: './app/modules/team-roster/team-roster.module.html',
    directives:[ModuleHeader, ModuleFooter, Tabs, Tab, Carousel, CustomTable],
    providers: [RosterService]
})

export class TeamRosterModule{
  public carouselData: any = {};
  public selectedPlayer: string = "Baa";
  public tabs: Array<RosterTabData> = [];
  public headerInfo: ModuleHeaderData = {
    moduleTitle: "Team Roster",
    hasIcon: false,
    iconClass: ""
  };

  public footerInfo: ModuleFooterData = {
    infoDesc: "Want to see the full team roster?",
    text: "VIEW FULL ROSTER",
    url: ['Home-page']
  };

  public columnData: Array<TableColumn> = [{
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

  constructor(private _service: RosterService) {
    this._service.getTeamRosterData().subscribe(
      data => this.setupData(data),
      err => { console.log("Error getting Profile Header data"); }
    );
  }
  changeSelected() {
    console.log("change selected team");
    this.selectedPlayer = this.selectedPlayer === "Baa" ? "Atlanta Braves" : "Minnesota Twins";
    this.tabs[0].tableData.forEach(row => {
      row.isSelected = ( row.cells["name"].sortValue === this.selectedPlayer );
    });
  }
  setupData(data: Array<RosterTableData>) {
    let leagueName = "[League Name]";
    let profileName = "[Profile Name]";
    this.headerInfo.moduleTitle = leagueName + " Standings - " + profileName;
    //Carousel
    //Table tabs
    data.forEach((tabData) => {
      this.tabs.push({
        title: tabData.title,
        tableData: this.formatRowData(tabData.rows, this.selectedPlayer)
      })
    });
  }
  formatRowData(rowData: Array<TeamRosterData>, selectedPlayer: string): Array<TableRow> {
    return rowData.map((values, index) => {
      let cells: { [key:string]: TableCell } = {
          "name": this.formatPlayerNameData(values),
          "position": this.formatPlayerPos(values),
          "height": this.formatPlayerHeight(values),
          "weight": this.formatNumberData(values.playerWeight, " lbs"),
          "age": this.formatNumberData(values.playerAge),
          "salary": this.formatPlayerSalary(values)

      };
      console.log("creating rows: " + values.playerName);
      return {
        isSelected: (values.playerName === selectedPlayer),
        cells: cells
      };
    });
  }
  formatNumberData(value:number, zeroDef?:string): TableCell {
    return {
        sortValue: value,
        displayHtml: (value == 0 && zeroDef) ? zeroDef : value.toString()
    }
  }
  formatPlayerNameData(values: TeamRosterData): TableCell {
    return {
        sortValue: values.playerName,
        displayHtml: values.playerName,
        profileImageConfig: {
          imageClass: "image-50",
          mainImage: {
            imageUrl: values.playerImageUrl,
            placeholderImageUrl: "/app/public/profile_placeholder.png",
            imageClass: "border-2"
          }
        }
    }
  }//formatPlayerNameData ends
  formatPlayerPos(values: TeamRosterData): TableCell{
    return{
      sortValue: values.playerPos,
      displayHtml: values.playerPos
    }
  }
  formatPlayerHeight(values: TeamRosterData): TableCell{
    return{
      sortValue: values.playerHeight,
      displayHtml: values.playerHeight
    }
  }
  formatPlayerSalary(values: TeamRosterData): TableCell{
    return{
      sortValue: values.playerSalary,
      displayHtml: values.playerSalary
    }
  }
}
