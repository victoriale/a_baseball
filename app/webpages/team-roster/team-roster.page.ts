import {Component, OnInit, Input, DoCheck, OnChanges} from 'angular2/core';
import {RouteParams} from "angular2/router";
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent, TitleInputData} from "../../components/title/title.component";
import {CircleImage} from '../../components/images/circle-image';
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';
import {RosterComponent, RosterComponentData} from "../../components/roster/roster.component";
import {RosterTabData, RosterTableModel, RosterTableData} from '../../services/roster.data';
import {Division, Conference, MLBPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';
import {RosterService} from '../../services/roster.service';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {CustomTable} from '../../components/custom-table/custom-table.component';
import {TableModel, TableColumn, TableRow, TableCell} from '../../components/custom-table/table-data.component';

export interface TableTabData<T> {
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
    selector: 'Team-roster-page',
    templateUrl: './app/webpages/team-roster/team-roster.page.html',
    directives: [SliderCarousel,
                BackTabComponent,
                TitleComponent,
                RosterComponent,
                LoadingComponent,
                ErrorComponent,
                CustomTable,
                Tabs, Tab
              ],
    providers: [RosterService],
})

export class TeamRosterPage implements OnInit{
  public selectedIndex;
  public carDataArray: Array<SliderCarouselInput> = [];
  public data: RosterComponentData;
  public pageParams: MLBPageParameters = {}
  public titleData: TitleInputData = {
    imageURL: "/app/public/profile_placeholder.png",
    text1: "Last Updated: [date]",
    text2: "United States",
    text3: "Team Roster",
    icon: "fa fa-map-marker"
  }
  footerStyle = {
    ctaBoxClass: "list-footer",
    ctaBtnClass:"list-footer-btn",
    hasIcon: true,
  };
  public tabs: Array<any>;
  private selectedTabTitle: string;

  constructor(private _params: RouteParams,
              private _rosterService: RosterService,
              private _globalFunctions: GlobalFunctions,
              private _mlbFunctions: MLBGlobalFunctions) {

    var teamId = _params.get("teamId");
    if ( teamId !== null && teamId !== undefined ) {
      this.pageParams.teamId = Number(teamId);
      // this.pageParams.teamName = "??"
    }
  }

  ngOnChanges() {
    if ( this.tabs != undefined && this.tabs.length > 0 ) {
      this.tabSelected(this.tabs[0].title);
      this.updateCarousel();
    }
  }

  getSelectedTab(): TableTabData<any> {
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
      selectedTab.sections.forEach((section) => {
        if ( selectedIndex < section.tableData.rows.length + offset ) {
          section.tableData.setRowSelected(selectedIndex);
        }
        else {
          section.tableData.setRowSelected(-1);
          offset += section.tableData.rows.length;
        }
      });
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
    selectedTab.sections.forEach(section => {
      section.tableData.rows
        .map((value) => {
          let item = selectedTab.convertToCarouselItem(value, index);
          if ( section.tableData.isRowSelected(value, index) ) {
            selectedIndex = index;
          }
          index++;
          return item;
        })
        .forEach(value => {
          carDataArray.push(value);
        });
    });

    this.selectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
    this.carDataArray = carDataArray;
  }

  private setupRosterData() {
    let self = this;
    self._rosterService.getRosterservice("full", "2819")
      .subscribe(data => {
        console.log(data);
        this.carDataArray = data.carousel;
      },
      err => {
        console.log("Error getting team roster data");
      });
  }

  ngOnInit() {
    this.setupRosterData();
  }
}
