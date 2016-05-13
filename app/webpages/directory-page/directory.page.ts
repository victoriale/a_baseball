import {Component, OnInit} from 'angular2/core';
import {RouteParams, Router} from 'angular2/router';
import {GlobalFunctions} from '../../global/global-functions';
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
  
  public isPartnerSite: boolean = false;

  constructor(private router: Router, private _params: RouteParams, private _globalFunctions: GlobalFunctions, private _directoryService: DirectoryService) {
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
            
    this.router.root
      .subscribe(
      route => {
        this.isPartnerSite = (route.split('/')[0] !== '');
        this.getDirectoryData();            
      }
    );

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
        lowerCaseType = "players";
        titleCaseType = "Players"; 
        break;
        
      case DirectoryType.teams:
        lowerCaseType = "teams";
        titleCaseType = "Teams"; 
        break;
        
      default: 
        lowerCaseType = "[type]";
        titleCaseType = "[Type]"; 
        break;        
    }    
    
    let directoryListTitle = "Latest MLB " + titleCaseType + " Profiles in the Nation.";
    let noResultsMessage = "There are no " + lowerCaseType + " profiles in this category.";
    let pagingDescription = titleCaseType + " profiles";
    let navTitle = "Browse all " + lowerCaseType + " profiles from A to Z";
    let pageName = "Directory-page";
    
    if ( this.startsWith !== undefined && this.startsWith !== null && this.startsWith.length > 0 ) {
      pageParams["startsWith"] = this.startsWith;
      pageName += "-starts-with";
    }
    else if ( this.newlyAdded ) {
      pageParams["startsWith"] = "new";
      pageName += "-starts-with";
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
        links: navigationArray,
        moreLink: {
          text: "Newly Added",
          route: ['Directory-page-starts-with',
            {
              type: DirectoryType[this.pageType],
              page: 1,
              startsWith: "new"
            }]            
        }
      };  
  }
}
