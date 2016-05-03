import {Component, Input} from 'angular2/core';

import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {ModuleFooter, ModuleFooterData} from '../../components/module-footer/module-footer';
import {SliderCarousel} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {CustomTable} from '../../components/custom-table/custom-table.component';

import {TableColumn, TableRow, TableCell} from '../../components/custom-table/table-data.component';
import {Division, Conference, MLBPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';

import {StandingsService} from '../../services/standings.service';
import {StandingsTableData, TeamStandingsData} from '../../services/standings.data';

export interface StandingsTabData {
  title: string;
  tableData: StandingsTableData; //TODO-CJP: get list of tables, since some tabs have multiple tables
}

// export interface StandingsTable {
//   subtitle: string;
//   tableData: Array<TableRow>
// }

//TODO-CJP: limit table rows to 5? Or should the API do that? Also, componentize by moving out shared page/module logic
@Component({
  selector: "standings-module",
  templateUrl: "./app/modules/standings/standings.module.html",
  directives: [ModuleHeader, ModuleFooter, SliderCarousel, Tabs, Tab, CustomTable],
  providers: [StandingsService]
})
export class StandingsModule {
  @Input() pageParams: MLBPageParameters;

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

  //TODO-CJP: update once carousel is ready

  public carouselData: any = {};

  /**
   * Three tabs for standings information
   */
  public tabs: Array<StandingsTabData> = [null, null, null]; // will be created in setupTabData function

  constructor(private _service: StandingsService, private _globalFunctions: GlobalFunctions) {
    if ( this.pageParams === undefined || this.pageParams === null ) {
      this.pageParams = {
        division: Division.east,
        conference: Conference.american
      };
    }

    this.setupData();
  }

  formatGroupName(conference?: Conference, division?: Division) {
    if ( conference !== undefined && conference !== null ) {
      let leagueName = this._globalFunctions.toTitleCase(Conference[conference]) + " League";
      if ( division !== undefined && division !== null ) {
        return leagueName + " " + this._globalFunctions.toTitleCase(Division[division]);
      }
      else {
        return leagueName;
      }
    }
    else {
      return "MLB";
    }
  }

  setupData() {
    let groupName = this.formatGroupName(this.pageParams.conference, this.pageParams.division);

    this.headerInfo.moduleTitle = groupName + " Standings";
    if ( this.pageParams.teamName !== undefined && this.pageParams.teamName !== null ) {
      this.headerInfo.moduleTitle += " - " + this.pageParams.teamName;
    }

    if ( this.pageParams.division !== undefined && this.pageParams.division !== null ) {
      //is team or division profile page.
      this.loadTabData(0, this.pageParams.conference, this.pageParams.division);
      this.loadTabData(1, this.pageParams.conference);
      this.loadTabData(2);
    } else {
      //is league profile page.
      this.loadTabData(0); //TODO-CJP: order of divisions??
      this.loadTabData(1, Conference.american);
      this.loadTabData(2, Conference.national);
    }
  }

  loadTabData(index:number, conference?: Conference, division?: Division) {
    this._service.getDefaultData(conference, division).subscribe(
      data => this.setupTabData(index, conference, division, data),
      err => { console.log("Error getting standings data for " + Conference[conference] + " and division " + Division[division]); }
    );
  }

  setupTabData(index:number, conference: Conference, division: Division, table: StandingsTableData) {
    if ( index >= 3 ) {
      console.error("! invalid tab index for standings module; returning");
      return;
    }
    let groupName = this.formatGroupName(conference, division);

    //Table tabs
    this.tabs[index] = {
      title: groupName + " Standings",
      tableData: table
    };

    this.setupCarouselData(this.tabs[index], 0);
  }

  setupCarouselData(tab: StandingsTabData, rowIndex: number) {
    //TODO-CJP: Standings Carousel
    if ( tab.tableData.rows.length > rowIndex ) {
      var row = tab.tableData.rows[rowIndex];
      var teamRoute = ['Disclaimer-page'];

      //Carousel Data Below is an array of dummy carouselData that should be replaced with real data
      var sampleImage = "./app/public/placeholder-location.jpg";
      var carouselData =[
        {
          index:'1',
          imageConfig: {
            imageClass: "image-150",
            mainImage: {
              imageUrl: sampleImage,
              urlRouteArray: ['Disclaimer-page'],
              hoverText: "<p>View</p>Profile",
              imageClass: "border-large"
            },
            subImages: [
              {
                imageUrl: sampleImage,
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "image-50-sub image-round-lower-right"
              },
              {
                text: "#1",
                imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
              }
            ]
          },
          description: [
            "<p>Line4</p>",
            "<p>Line7</p>",
            "<p>Line8</p>",
            "<p>Line3</p>",
          ],
        },
        {
          index:'2',
          imageConfig: {
            imageClass: "image-150",
            mainImage: {
              imageUrl: sampleImage,
              urlRouteArray: ['Disclaimer-page'],
              hoverText: "<p>View</p>Profile",
              imageClass: "border-large"
            },
            subImages: [
              {
                imageUrl: sampleImage,
                urlRouteArray: ['Disclaimer-page'],
                hoverText: "<i class='fa fa-mail-forward'></i>",
                imageClass: "image-50-sub image-round-lower-right"
              },
              {
                text: "#1",
                imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
              }
            ]
          },
          description: [
            "<p>Line1</p>",
            "<p>Line2</p>",
            "<p>Line3</p>",
            "<p>Line4</p>",
          ],
        },]//END OF DUMMY DATA
      this.carouselData = carouselData;
    }
  }

  //TODO-CJP: link to carousel left/right buttons
  changeSelected() {
    var selectedTab:StandingsTabData = this.tabs[0];
    let selectedIndex = selectedTab.tableData.selectedIndex;
    selectedIndex = (selectedIndex+1) % selectedTab.tableData.rows.length;
    selectedTab.tableData.selectedIndex = selectedIndex;
  }
}
