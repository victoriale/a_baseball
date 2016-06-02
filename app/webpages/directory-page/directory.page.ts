import {Component, OnInit} from '@angular/core';
import {Router, RouteParams} from "@angular/router-deprecated";
import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from "../../global/global-functions";
import {NavigationData, Link} from '../../global/global-interface';
import {DirectoryService, DirectoryType, DirectorySearchParams} from '../../services/directory.service';
import {PagingData, DirectoryProfileItem, DirectoryItems, DirectoryModuleData} from '../../modules/directory/directory.data';
import {DirectoryModule} from '../../modules/directory/directory.module';

@Component({
    selector: 'Directory-page',
    templateUrl: './app/webpages/directory-page/directory.page.html',
    directives: [DirectoryModule],
    providers: [DirectoryService]
})

export class DirectoryPage {
  public data: DirectoryModuleData;
  
  public currentPage: number = 1;
  
  public startsWith: string;
  
  public newlyAdded: boolean = false;
  
  public listingsLimit: number = 25;
  
  public isError: boolean = false;
  
  public pageType: DirectoryType;

  constructor(private router: Router, private _route: RouteParams, private _directoryService: DirectoryService) {
    var page = _route.get("page");
    this.currentPage = Number(page);
    
    var type = _route.get("type");
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
    
    let startsWith = _route.get("startsWith");
    if ( startsWith !== undefined && startsWith !== null ) {
       this.newlyAdded = startsWith.toLowerCase() === "new";
       this.startsWith = !this.newlyAdded && startsWith.length > 0 ? startsWith[0] : undefined;
    }
    
    if ( this.currentPage === 0 ) {
      this.currentPage = 1; //page index starts at one
    }

    // Scroll page to top to fix routerLink bug
    window.scrollTo(0, 0);
  }
  
  getDirectoryData() {    
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
