import {Component, OnInit} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {TitleComponent, TitleInputData} from '../../components/title/title.component';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {DraftHistoryService} from '../../services/draft-history.service';
import {ListPageService, BaseballMVPTabData} from '../../services/list-page.service';
import {FooterStyle} from '../../components/module-footer/module-footer.component';
import {ProfileHeaderService} from '../../services/profile-header.service';
import {PaginationFooter, PaginationParameters} from '../../components/pagination-footer/pagination-footer.component';
import {LoadingComponent} from "../../components/loading/loading.component";
import {ErrorComponent} from "../../components/error/error.component";
import {GlobalFunctions} from "../../global/global-functions";
import {GlobalSettings} from "../../global/global-settings";
import {DynamicWidgetCall} from "../../services/dynamic-list-page.service";
import {SidekickWrapper} from "../../components/sidekick-wrapper/sidekick-wrapper.component";
import {MVPListComponent, MVPTabData} from '../../components/mvp-list/mvp-list.component';
import {ResponsiveWidget} from '../../components/responsive-widget/responsive-widget.component';

@Component({
    selector: 'mvp-list-page',
    templateUrl: './app/webpages/mvp-list-page/mvp-list.page.html',
    directives: [ROUTER_DIRECTIVES, SidekickWrapper, ErrorComponent, LoadingComponent, PaginationFooter, BackTabComponent, TitleComponent, MVPListComponent, ResponsiveWidget],
    providers: [ListPageService, ProfileHeaderService, Title],
    inputs:[]
})

export class MVPListPage implements OnInit {
  tabs: Array<BaseballMVPTabData>;
  profileHeaderData: TitleInputData;

  paginationParameters:PaginationParameters;
  listType: string;
  queryParams: any;
  isError: boolean = false;
  selectedTabName: string;

  footerStyle: FooterStyle = {
    ctaBoxClass: " mvp-page-car-footer",
    ctaBtnClass:"",
    hasIcon: true,
  };

  constructor(private _service:ListPageService,
              private _params: RouteParams,
              private _profileService: ProfileHeaderService,
              private _title: Title, private _router: Router) {
    _title.setTitle(GlobalSettings.getPageTitle("MLB's Most Valuable Players"));

    this.listType = _params.get("type");
    if ( this.listType != "pitcher" ) {
      this.listType = "batter";
    }

    var pageNumber = Number(_params.get("pageNum"));
    if ( !pageNumber ) {
      pageNumber = 1;
    }

    var tabKey = _params.get("tab");
    this.queryParams = { //Initial load for mvp Data
        profile: 'player',
        listname: tabKey,
        sort: 'asc',
        conference: 'all',
        division: 'all',
        limit: 10,
        pageNum: pageNumber
    };
  }

  ngOnInit(){
    this.profileHeaderData = {
      imageURL: GlobalSettings.getSiteLogoUrl(), //TODO
      imageRoute: ["MLB-page"],
      text1: 'Last Updated: ',//+ GlobalFunctions.formatUpdatedDate(data.listData[0].lastUpdate),
      text2: 'United States',
      text3: "MLB's Most Valuable Players",
      icon: 'fa fa-map-marker'
    };

    this._profileService.getMLBProfile()
      .subscribe(data => {
        this.profileHeaderData = {
          imageURL: GlobalSettings.getImageUrl(data.headerData.logo, GlobalSettings._imgProfileLogo),
          imageRoute: ["MLB-page"],
          text1: 'Last Updated: ' + GlobalFunctions.formatUpdatedDate(data.headerData.lastUpdated),
          text2: 'United States',
          text3: "MLB's Most Valuable Players",
          icon: 'fa fa-map-marker'
        };
        this.loadTabs();
      }, err => {
        console.log("Error loading MLB profile");
      });
  }

  loadTabs() {

    this.tabs = this._service.getMVPTabs(this.listType, 'page');
    if ( this.tabs != null && this.tabs.length > 0 ) {
      var selectedTab = this.tabs[0];
      if ( this.queryParams.listname ) {
        var matchingTabs = this.tabs.filter(tab => tab.tabDataKey == this.queryParams.listname);
        if ( matchingTabs.length > 0 ) {
          selectedTab = matchingTabs[0];
        }
      }
      this.selectedTabName = selectedTab.tabDisplayTitle;
      this.getStandardList(selectedTab);
    }
  }

  //PAGINATION
  //sets the total pages for particular lists to allow client to
  //move from page to page without losing the sorting of the list
  setPaginationParams(input) {
    if (!input) return;

    var navigationParams = {
      type: this.listType,
      tab: input.stat,
      pageNum: input.pageNum
    };

    this.paginationParameters = {
      index: input.pageNum,
      max: Number(input.pageCount),
      paginationType: 'page',
      navigationPage: "MVP-list-tab-page",
      navigationParams: navigationParams,
      indexKey: 'pageNum'
    };
  }

  getStandardList(tab: BaseballMVPTabData){
    this.queryParams.listname = tab.tabDataKey;
    this._service.getListModuleService(tab, this.queryParams)
      .subscribe(
        tab => {
          if ( tab.data.listInfo ) {
            tab.data.listInfo.pageNum = this.queryParams.pageNum;
          }
          this.setPaginationParams(tab.data.listInfo);
        },
        err => {
          this.isError = true;
          console.log('Error: List MVP API: ', err);
        }
      );
  }

  tabSelected(tab: BaseballMVPTabData) {
    var tabRoute;
    var tabNameFrom = this.selectedTabName; //get the tab we are changing from into a var before we change it
    var tabNameTo = tab.tabDisplayTitle;
    if ( this.selectedTabName != tab.tabDisplayTitle ) {
      this.queryParams.pageNum = 1;
    }
    if (!tab.listData) { //let the page handle the service call if there's no data
      this.getStandardList(tab);
    }
    else {
      this.setPaginationParams(tab.data.listInfo);
    }
    this.selectedTabName = tab.tabDisplayTitle;//line added to update the current tab variable when tabs are changed without reloading the page

    //actually redirect the page on tab change to update the URL for deep linking and to fix the pagination bug
    if (tabNameTo !== tabNameFrom) {
      tabRoute = ["MVP-list-tab-page", { type: this._params.params['type'], tab: tab.tabDataKey, pageNum: "1"}];
      this._router.navigate(tabRoute);
     }

  }
}
