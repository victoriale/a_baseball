import {Component} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {ModuleFooter, ModuleFooterData} from '../../components/module-footer/module-footer';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {Carousel} from '../../components/carousels/carousel.component';
import {CustomTable} from '../../components/custom-table/custom-table.component';
import {TableColumn, TableRow, TableCell} from '../../components/custom-table/table-data.component';

import {RosterService} from '../../services/roster.service';
import {RosterTableData, TeamRosterData} from '../../services/roster.data';

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
  public tabs: Array<RosterTableData> = [];
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

  constructor(private _service: RosterService) {
    this._service.getTeamRosterData().subscribe(
      data => this.setupData(data),
      err => { console.log("Error getting Profile Header data"); }
    );
  }

  setupData(data: Array<RosterTableData>) {
    let leagueName = "[League Name]";
    let profileName = "[Profile Name]";
    this.headerInfo.moduleTitle = profileName + " Roster";
    //Carousel
    //Table tabs
    data.forEach((tabData) => {
      this.tabs.push(tabData)
    });
  }

  changeSelected() {
    var selectedTab = this.tabs[0];
    let selectedIndex = selectedTab.selectedIndex;
    selectedIndex = (selectedIndex+1) % selectedTab.rows.length;
    selectedTab.selectedIndex = selectedIndex;
  }
}
