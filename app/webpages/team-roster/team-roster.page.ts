import {Component, OnInit, Input, DoCheck, OnChanges} from 'angular2/core';
import {RouteParams} from "angular2/router";
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent, TitleInputData} from "../../components/title/title.component";
import {CircleImage} from '../../components/images/circle-image';
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';
import {RosterComponent, RosterTabData} from "../../components/roster/roster.component";
import {TeamRosterData, MLBRosterTabData} from '../../services/roster.data';
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

// export interface RosterTabData<T> {
//   title: string;
//   isActive: boolean;
//   sections: Array<TableComponentData<T>>;
//   convertToCarouselItem(item:T, index:number):SliderCarouselInput
// }

// export interface TableComponentData<T> {
//   groupName: string;
//   tableData: TableModel<T>;
// }

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
  // public teamId: string;
  // public selectedIndex;
  // public carDataArray: Array<SliderCarouselInput> = [];
  // public data: RosterComponentData;
  public pageParams: MLBPageParameters = {}
  public titleData: TitleInputData;
  public hasError: boolean = false;
  public footerData = {
      infoDesc: 'Interested in discovering more about this player?',
      text: 'View Profile',
      url: ['Team-roster-page']
  };
  //footer style for carousel footer
  public footerStyle = {
    ctaBoxClass: "list-footer",
    ctaBtnClass:"list-footer-btn",
    hasIcon: true
  };
  public errorData: any = {
    data: "This team is a National League team and has no designated hitters.",
    icon: "fa fa-remove"
  }
  public tabs: Array<MLBRosterTabData>;
  private selectedTabTitle: string;

  constructor(private _params: RouteParams,
              private _profileService: ProfileHeaderService,
              private _rosterService: RosterService) {
    let teamId = _params.get("teamId");
    if ( teamId !== null && teamId !== undefined ) {
      this.pageParams.teamId = Number(teamId);
    }
  }

  ngOnInit() {
    this.getData();
  }

  getData(){
    if ( this.pageParams.teamId ) {
      this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
        data => {
          this.pageParams = data.pageParams;
          this.setupTitleData(data.teamName, data.fullProfileImageUrl, data.headerData.lastUpdated)
          this.setupRosterData();
        },
        err => {
          console.log("Error getting team profile data for " + this.pageParams.teamId + ": " + err);
        }
      );
    }
    else {
      //TODO - Load error page since a team is required to show a roster?
    }
  }

  // getSelectedTab(): RosterTabData {
  //   var matchingTabs = this.tabs.filter(value => value.title === this.selectedTabTitle);
  //   if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {
  //     return matchingTabs[0];
  //   }
  //   else {
  //     return null;
  //   }
  // }

  // tabSelected(newTitle) {
  //   this.selectedTabTitle = newTitle;
  //   this.updateCarousel();
  // }

  // indexNum($event) {
  //   let selectedIndex = Number($event);
  //   let matchingTabs = this.tabs.filter(value => value.title === this.selectedTabTitle);
  //   if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {
  //     let selectedTab = matchingTabs[0];
  //     let offset = 0;
  //       if ( selectedIndex < selectedTab.tableData.rows.length + offset ) {
  //         selectedTab.tableData.setRowSelected(selectedIndex);
  //       }
  //       else {
  //         selectedTab.tableData.setRowSelected(-1);
  //         offset += selectedTab.tableData.rows.length;
  //       }
  //   }
  // }

  // updateCarousel(sortedRows?) {
  //   var selectedTab = this.getSelectedTab();
  //   if ( selectedTab === undefined || selectedTab === null ) {
  //     return;
  //   }

  //   let carDataArray: Array<SliderCarouselInput> = [];
  //   let index = 0;
  //   let selectedIndex = -1;
  //     selectedTab.tableData.rows
  //       .map((value) => {
  //         let item = selectedTab.convertToCarouselItem(value, index);
  //         if ( selectedTab.tableData.isRowSelected(value, index) ) {
  //           selectedIndex = index;
  //         }
  //         index++;
  //         return item;
  //       })
  //       .forEach(value => {
  //         carDataArray.push(value);
  //   });

  //   this.selectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
  //   this.carDataArray = carDataArray;
  //   if(this.carDataArray.length < 1){
  //     this.carDataCheck = false;
  //   } else {
  //     this.carDataCheck = true;
  //   }
  // }
  
  private setupTitleData(teamName: string, imageUrl: string, lastUpdated: string) {
    this.titleData = {
      imageURL: imageUrl,
      text1: "Last Updated - " + GlobalFunctions.formatUpdatedDate(lastUpdated),
      text2: "United States",
      text3: this._rosterService.getPageTitle(teamName),
      icon: "fa fa-map-marker"
    };
  }

  private setupRosterData() {
    this.tabs = this._rosterService.initializeAllTabs(this.pageParams.teamId);
      // .subscribe(data => {
      //   //set up tabs
      //   this.tabs = data;
      //   // this.tabSelected(this.tabs[0].title);
      //   // this.updateCarousel();
      // },
      // err => {
      //   console.log("Error getting team roster data");
      //   this.hasError = true;
      // });
  }
  
  private rosterTabSelected(tab: MLBRosterTabData) {    
    this._rosterService.getRosterTabData(tab, this.pageParams.teamId);
  }
}
