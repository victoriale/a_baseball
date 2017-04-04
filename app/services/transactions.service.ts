import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {CircleImageData} from '../components/images/image-data';
import {SliderCarousel, SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
import {TransactionModuleData} from '../modules/transactions/transactions.module';
import {TransactionTabData} from '../components/transactions/transactions.component';
import {TransactionsListInput} from '../components/transactions-list-item/transactions-list-item.component';


interface TransactionInfo {
    transactionDate: string;
    id: string;
    teamKey: string;
    personKey: string;
    repDate: string;
    articleId: string;
    headline: string;
    contents: string;
    docId: string;
    teamId: string;
    teamName: string;
    playerId: string;
    playerName: string;
    playerFirstName: string;
    playerLastName: string;
    roleStatus: string;
    active: string;
    uniformNumber: string;
    position: string;
    depth: string;
    height: string;
    weight: string;
    birthDate: string;
    city: string;
    area: string;
    country: string;
    heightInInches: string;
    age: string;
    salary: string;
    pub1PlayerId: string;
    pub1TeamId: string;
    pub2Id: string;
    pub2TeamId: string;
    lastUpdate: string;
    playerHeadshot: string;
    teamLogo: string;
    totalResults: number;
    totalPages: number;
    transactionTimestamp: number;
    backgroundImage: string;
}

@Injectable()
export class TransactionsService {
  private _apiUrl: string = GlobalSettings.getApiUrl();

  constructor(public http: Http) {}

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      return headers;
  }

  getTabs(errorMessagePrepend: string, isPage: boolean): Array<TransactionTabData> {
    var tabs: TransactionTabData[] = [
      {
        tabDataKey  : 'transactions',
        tabDisplay  : 'Transactions',
        isLoaded    : false
      },
      {
        tabDataKey  : 'suspensions',
        tabDisplay  : 'Suspensions',
        isLoaded    : false
      },
      {
        tabDataKey  : 'injuries',
        tabDisplay  : 'Injuries',
        isLoaded    : false
      }];

      tabs.forEach(tab => {
        tab.sortOptions = [
          { key: "recent", value: "Most Recent"},
          { key: "oldest", value: "Oldest First"}
        ],
        tab.selectedSort = "recent",
        tab.errorMessage = errorMessagePrepend + tab.tabDisplay.toLowerCase(),
        tab.includeDropdown = isPage
        tab.carData = this.getEmptyCarousel(tab); //must be called after the rest is set up
      });

      return tabs;
  }

  private getTabSingularName(key: string) {
    switch (key) {
      case "transactions":    return "Transaction";
      case "suspensions":     return "Suspension";
      case "injuries":        return "Injury";
    }
  }

  getTabsForPage(profileName: string, teamId?: number) {
    var errorMessagePrepend;
    if ( teamId ) {
      errorMessagePrepend = "Sorry, the " + profileName + " do not currently have any data for ";
    }
    else { //is league-wide data
      errorMessagePrepend = "Sorry, " + profileName + " does not currently have any data for ";
    }
    return this.getTabs(errorMessagePrepend, true);
  }

  loadAllTabsForModule(profileName: string, teamId?: number): TransactionModuleData {
    var route, errorMessagePrepend;
    if ( teamId ) {
      route = ['Transactions-page',{teamName: GlobalFunctions.toLowerKebab(profileName), teamId:teamId, limit:1000, pageNum: 1}]
      errorMessagePrepend = "Sorry, the " + profileName + " do not currently have any data for ";
    }
    else { //is league-wide data
      route = ['Transactions-mlb-page',{limit:1000, pageNum: 1}];
      errorMessagePrepend = "Sorry, " + profileName + " does not currently have any data for ";
    }

    return {
      tabs: this.getTabs(errorMessagePrepend, false),
      profileName: profileName,
      ctaRoute: route
    }
  }

  getTransactionsService(tab:TransactionTabData, teamId: number, type: string, sort?, limit?, page?){
    //Configure HTTP Headers
    var headers = this.setToken();
    if( sort == "desc" ){
      tab.selectedSort = "recent";
    } else if( sort == "asc" ){
      tab.selectedSort = "oldest";
    } else {
      sort = "desc";
      tab.selectedSort = "recent";
    }
    if( limit == null){ limit = 10;}
    if( page == null){ page = 1;}

    //http://dev-homerunloyal-api.synapsys.us/league/transactions/injuries/desc/5/1
    var callURL = this._apiUrl + '/';
    if ( teamId ) {
       callURL += 'team/transactions/'+teamId + '/';
    }
    else {
       callURL += 'league/transactions/';
    }
    callURL += tab.tabDataKey+'/'+sort+'/'+limit+'/'+page;

    // only set current team if it's a team profile page,
    // this module should also only be on the team profile
    // and MLB profile pages
    var currentTeam = type == "module" ? teamId : null;

    // console.log("transactions url: " + callURL);

    return this.http.get( callURL, {headers: headers})
      .map(res => res.json())
      .map(
        data => {
          tab.carData = this.carTransactions(data.data, type, tab, currentTeam);
          tab.dataArray = this.listTransactions(data.data, type);
          if ( tab.dataArray != null && tab.dataArray.length == 0 ) {
            tab.dataArray = null;
          }
          tab.isLoaded = true;
          return tab;
        },
        err => {
          console.log('Error getting transaction data for ' + tab.tabDataKey);
        }
      );
  }

  getEmptyCarousel(tab: TransactionTabData): Array<SliderCarouselInput> {
    return [SliderCarousel.convertToCarouselItemType1(2, {
      backgroundImage: null,
      copyrightInfo: GlobalSettings.getCopyrightInfo(),
      subheader: [tab.tabDisplay + ' Report'],
      profileNameLink: null,
      description: [tab.isLoaded ? tab.errorMessage : ""],
      lastUpdatedDate: null,
      circleImageUrl: "/app/public/no-image.png",
      circleImageRoute: null
    })];
  }

  //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
  carTransactions(data: Array<TransactionInfo>, type: string, tab: TransactionTabData, teamId): Array<SliderCarouselInput> {
    let self = this;
    var carouselArray = [];
    if(data.length == 0){//if no data is being returned then show proper Error Message in carousel
      carouselArray = this.getEmptyCarousel(tab);
    }else{
      if ( type == "module" ) {
          // module only needs four list items
        data = data.slice(0,4);
      }

      //if data is coming through then run through the transforming function for the module
      carouselArray = data.map((val, index) => {
        var teamRoute = MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId);
        var playerRoute = null;
        if ( ( !val.roleStatus && val.active == 'injured' ) || val.active == 'active' ) {
          playerRoute = MLBGlobalFunctions.formatPlayerRoute(val.playerName, val.playerName, val.playerId);
        }
        var teamLinkText = {
          route: teamId == val.teamId ? null : teamRoute,
          text: val.teamName,
          class: 'text-heavy'
        };
        var playerLinkText = {
          route: playerRoute,
          text: val.playerName,
          class: 'text-heavy'
        };
        return SliderCarousel.convertToCarouselItemType1(index, {
          backgroundImage: GlobalSettings.getBackgroundImageUrl(val.backgroundImage, GlobalSettings._imgProfileMod),
          copyrightInfo: GlobalSettings.getCopyrightInfo(),
          subheader: [tab.tabDisplay + ' Report - ', teamLinkText],
          profileNameLink: playerLinkText,
          description: [
              this.getTabSingularName(tab.tabDataKey) + ' date - ' + val.repDate + ': ' + val.contents
          ],
          // lastUpdatedDate: GlobalFunctions.formatUpdatedDate(val.transactionTimestamp),
          lastUpdatedDate: GlobalFunctions.formatUpdatedDate(val.lastUpdate),
          circleImageUrl: GlobalSettings.getImageUrl(val.playerHeadshot, GlobalSettings._imgLgLogo),
          circleImageRoute: playerRoute
          // subImageUrl: GlobalSettings.getImageUrl(val.teamLogo, GlobalSettings._imgLgLogo),
          // subImageRoute: teamRoute
        });
      });
    }
    return carouselArray;
  }

  listTransactions(data: Array<TransactionInfo>, type: string): Array<TransactionsListInput>{
    let self = this;
    var listDataArray = [];

    if(type == "module"){
      data = data.slice(0,4);
    }

    listDataArray = data.map(function(val, index){
      var playerRoute = null;
      if ( ( !val.roleStatus && val.active == 'injured' ) || val.active == 'active' ) {
        playerRoute = MLBGlobalFunctions.formatPlayerRoute(val.playerName, val.playerName, val.playerId);
      }
      var playerTextLink = {
        route: playerRoute,
        text: val.playerLastName + ", " + val.playerFirstName + " ",
        class: 'text-heavy'
      }
      return {
        dataPoints: [{
          style   : 'transactions-small',
          data    : GlobalFunctions.formatGlobalDate(new Date(val['repDate']),'defaultDate'),
          value   : [playerTextLink, val.contents],
          url     : null
        }],
        imageConfig: TransactionsService.getListImageData(GlobalSettings.getImageUrl(val.playerHeadshot, GlobalSettings._imgSmLogo), playerRoute)
      };
    });
    return listDataArray;
  }//end of function

  static getListImageData(mainImg: string, mainImgRoute: Array<any>){
    if(mainImg == null || mainImg == ''){
      mainImg = "/app/public/no-image.png";
    }
    return { //interface is found in image-data.ts
        imageClass        : "image-48",
        mainImage : {
            imageUrl      : mainImg,
            urlRouteArray : mainImgRoute,
            hoverText     : "<i class='fa fa-mail-forward'></i>",
            imageClass    : "border-1",
        },
        subImages : [],
    };
  }
}
