import {Component, OnInit} from '@angular/core';
import {RouteParams, Router} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {GlobalFunctions} from '../../global/global-functions';
import {GlobalSettings} from "../../global/global-settings";
import {NavigationData, Link} from '../../global/global-interface';
import {DirectoryService, DirectoryType, DirectorySearchParams} from '../../services/directory.service';
import {PagingData, DirectoryProfileItem, DirectoryItems, DirectoryModuleData} from '../../modules/directory/directory.data';
import {DirectoryModule} from '../../modules/directory/directory.module';
import {SeoService} from '../../seo.service'

@Component({
    selector: 'Directory-page',
    templateUrl: './app/webpages/directory-page/directory.page.html',
    directives: [DirectoryModule],
    providers: [DirectoryService, Title]
})

export class DirectoryPage {
  public data: DirectoryModuleData;

  public currentPage: number = 1;

  public startsWith: string;

  public newlyAdded: boolean = false;

  public listingsLimit: number = 25;

  public isError: boolean = false;

  public pageType: DirectoryType;

  constructor(private _params: RouteParams, private _directoryService: DirectoryService, private _title: Title, private _router:Router, private _seoService:SeoService) {
    _title.setTitle(GlobalSettings.getPageTitle("Directory"));
    var page = _params.get("page");
    this.currentPage = Number(page);

    var type = _params.get("type");
    switch ( type ) {
      case "players":
        this.pageType = DirectoryType.players;
        break;

      case "teams":
        this.pageType = DirectoryType.teams;
        break;

      default:
        this.pageType = DirectoryType.none;
        break;
    }

    let startsWith = _params.get("startsWith");
    if ( startsWith !== undefined && startsWith !== null ) {
       this.newlyAdded = startsWith.toLowerCase() === "new";
       this.startsWith = !this.newlyAdded && startsWith.length > 0 ? startsWith[0] : undefined;
    }

    if ( this.currentPage === 0 ) {
      this.currentPage = 1; //page index starts at one
    }
    //This call will remove all meta tags from the head.
    this._seoService.removeMetaTags();
    //create meta description that is below 160 characters otherwise will be truncated
    let metaDesc = 'Directory of all the players and team profiles for the MLB starting with the letter ' + startsWith.toUpperCase();
    let link = window.location.href;
    this._seoService.setCanonicalLink(this._params.params, this._router);
    this._seoService.setOgTitle('Directory - ' + startsWith);
    this._seoService.setOgDesc(metaDesc);
    this._seoService.setOgType('image');
    this._seoService.setOgUrl(link);
    this._seoService.setOgImage('./app/public/mainLogo.png');
    this._seoService.setTitle('Directory');
    this._seoService.setMetaDescription(metaDesc);
    this._seoService.setMetaRobots('INDEX, FOLLOW');
    this._seoService.setPageDescription(metaDesc);
  }

  ngOnInit() {
      this.getDirectoryData();
  }

  getDirectoryData() {
    window.scrollTo(0, 0);

    let params: DirectorySearchParams = {
      page: this.currentPage,
      listingsLimit: this.listingsLimit,
      startsWith: this.startsWith,
      newlyAdded: this.newlyAdded
    }

    this._directoryService.getData(this.pageType, params)
      .subscribe(
          data => this.setupData(data),
          err => {
              console.log('Error - Getting directory listings: ', err);
              this.isError = true;
          }
      );
  }

  setupData(listings: DirectoryItems) {
    let pageParams = {
      type: DirectoryType[this.pageType]
    };
    let lowerCaseType = "";
    let titleCaseType = "";

    switch ( this.pageType ) {
      case DirectoryType.players:
        lowerCaseType = "player";
        titleCaseType = "Player";
        break;

      case DirectoryType.teams:
        lowerCaseType = "team";
        titleCaseType = "Team";
        break;

      default:
        lowerCaseType = "[type]";
        titleCaseType = "[Type]";
        break;
    }

    let directoryListTitle = "Latest MLB " + titleCaseType + " Profiles in the Nation.";
    let noResultsMessage = "Sorry, there are no results for " + titleCaseType + "s";
    let pagingDescription = titleCaseType + " profiles";
    let navTitle = "Browse all " + lowerCaseType + " profiles from A to Z";
    let pageName = "Directory-page-starts-with";

    if ( this.startsWith !== undefined && this.startsWith !== null && this.startsWith.length > 0 ) {
      pageParams["startsWith"] = this.startsWith;
      noResultsMessage = "Sorry, there are no results for " + titleCaseType + "s starting with the letter '" + this.startsWith + "'";
    }

    let data:DirectoryModuleData = {
      pageName: pageName,
      breadcrumbList: [{
        text: "United States"
      }],
      directoryListTitle: directoryListTitle,
      hasListings: false,
      noResultsMessage: noResultsMessage,
      listingItems: null,
      listingsLimit: this.listingsLimit,
      navigationData: this.setupAlphabeticalNavigation(navTitle),
      pagingDescription: pagingDescription,
      pageParams: pageParams
    };
    ;
    if(listings !== undefined && listings !== null ) {
      // this.setupPaginationParameters(data);
      data.hasListings = listings.items.length > 0;
      data.listingItems = listings;
    }
    else {
      data.hasListings = false;
      data.listingItems = null;
    }

    this.data = data;
  }

  setupAlphabeticalNavigation(title: string): NavigationData {
      var navigationArray = GlobalFunctions.setupAlphabeticalNavigation(DirectoryType[this.pageType]);

      return {
        title: title,
        links: navigationArray
      };
  }
}
