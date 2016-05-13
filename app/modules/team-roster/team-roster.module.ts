import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {ModuleFooter, ModuleFooterData} from '../../components/module-footer/module-footer.component';
import {Component, OnInit, Input, DoCheck, OnChanges} from 'angular2/core';
import {RouteParams} from "angular2/router";
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent, TitleInputData} from "../../components/title/title.component";
import {CircleImage} from '../../components/images/circle-image';
import {RosterComponent, RosterComponentData} from "../../components/roster/roster.component";
import {RosterTabData, RosterTableModel} from '../../services/roster.data';
import {Division, Conference, MLBPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';
import {RosterService} from '../../services/roster.service';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {CustomTable} from '../../components/custom-table/custom-table.component';
import {TableModel, TableColumn, TableRow, TableCell} from '../../components/custom-table/table-data.component';
import {NoDataBox} from '../../components/error/data-box/data-box.component';

export interface RosterTabData<T> {
  title: string;
  isActive: boolean;
  sections: Array<TableComponentData<T>>;
  convertToCarouselItem(item:T, index:number):SliderCarouselInput
}

export interface TableComponentData<T> {
  groupName: string;
  tableData: TableModel<T>;
}

@Component({
    selector: 'team-roster-module',
    templateUrl: './app/modules/team-roster/team-roster.module.html',
    directives: [SliderCarousel,
                BackTabComponent,
                TitleComponent,
                RosterComponent,
                CustomTable,
                Tabs, Tab,
                ModuleHeader,
                ModuleFooter,
                NoDataBox
              ],
    providers: [RosterService],
})

export class TeamRosterModule implements OnChanges{
  carDataCheck: boolean = true;
  public selectedIndex;
  footerData: Object;
  public dataTable: boolean = true;
  private selectedTabTitle: string;
  public tabs: Array<RosterTabData>;
  public data: RosterComponentData;
  errorData: any = {
    data: "This team is a National League team and has no designated hitters.",
    icon: "fa fa-calendar-o"
  }
  public footerStyle = {
    ctaBoxClass: "list-footer",
    ctaBtnClass:"list-footer-btn",
    hasIcon: true
  };
  public carDataArray: Array<SliderCarouselInput> = [];
  public pageParams: MLBPageParameters = {}
  public headerInfo: ModuleHeaderData = {
    moduleTitle: "Team Roster",
    hasIcon: false,
    iconClass: ""
  };
  public teamId: string;
  constructor(private _params: RouteParams,
              private _rosterService: RosterService,
              private _globalFunctions: GlobalFunctions,
              private _mlbFunctions: MLBGlobalFunctions) {
    this.teamId = _params.get("teamId");
    var teamName = _params.get("teamName");
    this.footerData = {
      infoDesc: 'Want to see everybody involved in this list?',
      text: 'VIEW FULL ROSTER',
      url: ['Team-roster-page',{teamName:'team-name-here', teamId: '2799'}]
    };
    // if ( teamId  && teamName ) {
    //   this.pageParams.teamId = Number(teamId);
    //   this.footerData.url = [
    //     'Team-roster-page',
    //     {
    //       teamId: this.pageParams.teamId,
    //       teamName: teamName
    //     }
    //   ];
    // }
    // else {
    //   this.footerData.url = [
    //     'Error-page'
    //   ];
    // }
  }

  ngOnChanges() {
    if ( this.tabs != undefined && this.tabs.length > 0 ) {
      this.tabSelected(this.tabs[0].title);
      this.updateCarousel();
    }
  }

  getSelectedTab(): RosterTabData {
    var matchingTabs = this.tabs.filter(value => value.title === this.selectedTabTitle);
    if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {
      return matchingTabs[0];
    }
    else {
      return null;
    }
  }

  tabSelected(newTitle) {
    this.selectedTabTitle = newTitle;
    this.updateCarousel();
  }

  indexNum($event) {
    let selectedIndex = Number($event);
    let matchingTabs = this.tabs.filter(value => value.title === this.selectedTabTitle);
    if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {
      let selectedTab = matchingTabs[0];
      let offset = 0;
        if ( selectedIndex < selectedTab.tableData.rows.length + offset ) {
          selectedTab.tableData.setRowSelected(selectedIndex);
        }
        else {
          selectedTab.tableData.setRowSelected(-1);
          offset += selectedTab.tableData.rows.length;
        }
    }
  }

  updateCarousel(sortedRows?) {
    var selectedTab = this.getSelectedTab();
    if ( selectedTab === undefined || selectedTab === null ) {
      return;
    }

    let carDataArray: Array<SliderCarouselInput> = [];
    let index = 0;
    let selectedIndex = -1;
      selectedTab.tableData.rows
        .map((value) => {
          let item = selectedTab.convertToCarouselItem(value, index);
          if ( selectedTab.tableData.isRowSelected(value, index) ) {
            selectedIndex = index;
          }
          index++;
          return item;
        })
        .forEach(value => {
          carDataArray.push(value);
    });

    this.selectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
    this.carDataArray = carDataArray;
    if(this.carDataArray.length < 1){
      this.carDataCheck = false;
    } else {
      this.carDataCheck = true;
    }
  }

  private setupRosterData() {
    let self = this;
    //set tab limit
    self._rosterService.loadAllTabs(this.teamId, 5)
      .subscribe(data => {
        //set up tabs
        this.tabs = data;
        this.tabSelected(this.tabs[0].title);
        this.updateCarousel();
        var teamName = data[0].tableData.rows[0].teamName;
        this.headerInfo.moduleTitle = "Team Roster - " + teamName;
        if(data[3].tableData.rows.length < 1){
          this.dataTable = false;
        }
      },
      err => {
        console.log("Error getting team roster data");
      });
  }

  ngOnInit() {
    this.setupRosterData();
  }
}
