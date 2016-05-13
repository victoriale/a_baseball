import {Component, OnInit, Input, DoCheck, OnChanges} from 'angular2/core';
import {RouteParams} from "angular2/router";
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent, TitleInputData} from "../../components/title/title.component";
import {CircleImage} from '../../components/images/circle-image';
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';
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
import {ProfileHeaderService} from '../../services/profile-header.service';
import {GlobalSettings} from '../../global/global-settings';

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
    selector: 'Team-roster-page',
    templateUrl: './app/webpages/team-roster/team-roster.page.html',
    directives: [SliderCarousel,
                BackTabComponent,
                TitleComponent,
                RosterComponent,
                LoadingComponent,
                ErrorComponent,
                CustomTable,
                Tabs, Tab,
                NoDataBox
              ],
    providers: [RosterService, ProfileHeaderService],
})

export class TeamRosterPage implements OnInit{
  public carDataCheck: boolean = true;
  public selectedIndex;
  public carDataArray: Array<SliderCarouselInput> = [];
  public data: RosterComponentData;
  public pageParams: MLBPageParameters = {}
  public titleData: TitleInputData;
  public hasError: boolean = false;
  public footerData = {
      infoDesc: 'Interested in discovering more about this player?',
      text: 'View Profile',
      url: ['Disclaimer-page']
  };
  //footer style for carousel footer
  public footerStyle = {
    ctaBoxClass: "list-footer",
    ctaBtnClass:"list-footer-btn",
    hasIcon: true
  };
  errorData: any = {
    data: "This team is a National League team and has no designated hitters.",
    icon: "fa fa-remove"
  }
  public tabs: Array<RosterTabData>;
  private selectedTabTitle: string;

  constructor(private _params: RouteParams,
              private _profileService: ProfileHeaderService,
              private _rosterService: RosterService,
              private _globalFunctions: GlobalFunctions,
              private _mlbFunctions: MLBGlobalFunctions) {

    var teamId = _params.get("teamId");
    if ( teamId !== null && teamId !== undefined ) {
      this.pageParams.teamId = Number(teamId);
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
  private setupTitleData(title: string, imageUrl?: string) {
    this.titleData = {
      imageURL: imageUrl,
      text1: "Last Updated: [date]",
      text2: "United States",
      text3: title,
      icon: "fa fa-map-marker"
    };
  }

  private setupRosterData(imageURL?: string) {
    var title = this._rosterService.getPageTitle(this.pageParams);
    this.setupTitleData(title, imageURL);
    this.setupTitleData(title);

    this._rosterService.loadAllTabs("2799", 20)
      .subscribe(data => {
        //set up tabs
        this.tabs = data;
        this.tabSelected(this.tabs[0].title);
        this.updateCarousel();
        var lastUpdate = data[0].tableData.rows[0].lastUpdate;
        this.titleData.text1 = "Last Updated: " + GlobalFunctions.formatUpdatedDate(lastUpdate, false);
        var teamName = data[0].tableData.rows[0].teamName;
        this.titleData.text3 = "Team Roster - " + teamName;
        var teamLogo = GlobalSettings.getImageUrl(data[0].tableData.rows[0].teamLogo);
        this.titleData.imageURL = teamLogo;
      },
      err => {
        console.log("Error getting team roster data");
        this.hasError = true;
      });
  }

  getData(){
    if ( this.pageParams.teamId ) {
      this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
        data => {
          this.pageParams = data;
          this.setupRosterData();
        },
        err => {
          console.log("Error getting team profile data for " + this.pageParams.teamId + ": " + err);
        }
      );
    }
    else {
      this.setupRosterData();
    }
  }

  ngOnInit() {
    this.getData();
  }

  ngOnChanges() {
    if ( this.tabs != undefined && this.tabs.length > 0 ) {
      this.tabSelected(this.tabs[0].title);
      this.updateCarousel();
    }
  }

}
