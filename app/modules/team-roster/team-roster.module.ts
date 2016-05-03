import {Component} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {ModuleFooter, ModuleFooterData} from '../../components/module-footer/module-footer';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {SliderCarousel} from '../../components/carousels/slider-carousel/slider-carousel.component';
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
    directives:[ModuleHeader, ModuleFooter, Tabs, Tab, SliderCarousel, CustomTable],
    providers: [RosterService]
})

export class TeamRosterModule{
  public carouselData: Array<any>;
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
    this.carData();
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

  carData(){
    //Carousel Data Below is an array of dummy carouselData that should be replaced with real data
    var sampleImage = "./app/public/placeholder-location.jpg";
    var carouselData =[
      {
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
          ],
        },
        description: [
          "<p>Line4</p>",
          "<p>Line7</p>",
          "<p>Line8</p>",
          "<p>Line3</p>",
        ],
      },
      {
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
          ],
        },
        description: [
          "<p>Line1</p>",
          "<p>Line2</p>",
          "<p>Line3</p>",
          "<p>Line4</p>",
        ],
      },]
    this.carouselData = carouselData;
  }
}
