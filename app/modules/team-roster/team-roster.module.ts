import {Component} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {ModuleFooter, ModuleFooterData} from '../../components/module-footer/module-footer';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {SliderCarousel} from '../../components/slider-carousel/slider-carousel.component';
import {BoxSortComponent} from '../../components/box-sort/box-sort.component';
import {PlayerDetailRowComponent} from '../../components/player-detail-row/player-detail-row.component';
import {TableColumn, TableRow, TableCell} from '../../components/custom-table/table-data.component';
import {CustomTable} from '../../components/custom-table/custom-table.component';
import {RosterService, RosterTableData, TeamRosterData} from '../../services/roster.service';

export interface TeamRosterTabData {
  title: string;
  tableData: Array<TableRow>;
}

@Component({
    selector: 'team-roster-module',
    templateUrl: './app/modules/team-roster/team-roster.module.html',
    directives:[CustomTable, PlayerDetailRowComponent, BoxSortComponent, ModuleHeader, ModuleFooter, Tabs, Tab, SliderCarousel],
    providers: [RosterService]
})
export class TeamRosterModule{
  public headerInfo: ModuleHeaderData = {
    moduleTitle: "Team Roster",
    hasIcon: false,
    iconClass: ""
  };
  public footerInfo: ModuleFooterData = {
    infoDesc: "Want to see the full team roster?",
    text: "VIEW FULL ROSTER",
    url: ['Roster-page']
  };
  public columnData: Array<TableColumn> = [{
      headerValue: "PLAYER",
      columnClass: "image-column",
      key: "name"
    },{
      headerValue: "POS.",
      columnClass: "data-column",
      key: "pos"
    },{
      headerValue: "HEIGHT",
      columnClass: "data-column",
      isNumericType: true,
      key: "height"
    },{
      headerValue: "WEIGHT",
      columnClass: "data-column",
      isNumericType: true,
      key: "weight"
    },{
      headerValue: "AGE",
      columnClass: "data-column",
      isNumericType: true,
      key: "age"
    },{
      headerValue: "SALARY",
      columnClass: "data-column",
      isNumericType: true,
      key: "salary"
    }];

    public moduleTitle: string = 'Team Roster - [Team Name]';
    public teamRosterRowData: Object;
    public carouselData: any = {};
    public selectedPlayer: string = "Baa";
    public tabs: Array<TeamRosterTabData> = [];

    constructor(private _service: RosterService) {
      this._service.getLeagueData().subscribe(
        data => this.setupData(data),
        err => { console.log("Error getting Profile Header data"); }
      );
    }

    changeSelected() {
      console.log("change selected team");
      this.selectedPlayer = this.selectedPlayer === "Baa" ? "Aaa" : "Baa";
      this.tabs[0].tableData.forEach(row => {
        row.isSelected = ( row.cells["name"].sortValue === this.selectedPlayer );
      });
    }

    setupData(data: Array<RosterTableData>) {
      let leagueName = "[League Name]";
      let profileName = "[Profile Name]";
      this.headerInfo.moduleTitle = 'Team Roster - [Team Name]' + profileName;
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
            // "pos": values.position,
            "height": this.formatNumberData(values.height),
            "weight": this.formatPercentageData(values.weight),
            "age": this.formatNumberData(values.age),
            "salary": this.formatNumberData(values.salary),
        };
        return {
          isSelected: (values.playerName === selectedPlayer),
          cells: cells
        };
      });
    }

    formatPlayerNameData(values: TeamRosterData): TableCell {
      return {
          sortValue: values.playerName,
          displayHtml: values.playerName,
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
//285px PLAYER
