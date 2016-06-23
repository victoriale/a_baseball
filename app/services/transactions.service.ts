import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {CircleImageData} from '../components/images/image-data';
import {SliderCarousel, SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
import {TransactionModuleData} from '../modules/transactions/transactions.module';
import {TransactionTabData} from '../components/transactions/transactions.component';

declare var moment: any;

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
      route = ['Transactions-page',{teamName:profileName, teamId:teamId, limit:1000, pageNum: 1}]
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

  getTransactionsService(tab:TransactionTabData, teamId, type?, sort?, limit?, page?){
    //Configure HTTP Headers
    var headers = this.setToken();
    if( sort == null){ sort = "desc";}
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

    // console.log("transactions url: " + callURL);

    return this.http.get( callURL, {headers: headers})
      .map(res => res.json())
      .map(
        data => {
          tab.carData = this.carTransactions(data.data, type, tab);
          tab.dataArray = this.transactionsData(data.data, type);
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
    let self = this;
    var carouselArray = [];
    return [{
      index:'2',
      imageConfig: self.imageData("image-150","border-large",null,null, null, null,null, null),
      description:[tab.errorMessage],
    }];
  }

  //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
  //FOR THE PAGE
  carTransactions(data: Array<TransactionInfo>, type: string, tab: TransactionTabData): Array<SliderCarouselInput> {
    let self = this;
    var carouselArray = [];
    var dummyImg = "/app/public/Image-Placeholder-2.jpg";
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
        var playerRoute = MLBGlobalFunctions.formatPlayerRoute(val.teamName, val.playerName, val.playerId);
        var teamLinkText = {
          route: teamRoute,
          text: val.teamName
        };
        var playerLinkText = {
          route: playerRoute,
          text: val.playerName
        };
        return SliderCarousel.convertToSliderCarouselItem(index, {
          backgroundImage: val.backgroundImage != null ? GlobalSettings.getImageUrl(val.backgroundImage) : dummyImg,
          copyrightInfo: GlobalSettings.getCopyrightInfo(),
          subheader: [tab.tabDisplay + ' Report - ', teamLinkText],
          profileNameLink: playerLinkText,
          description: [
              this.getTabSingularName(tab.tabDataKey) + ' date - ' + val.repDate + ': ' + val.contents
          ],
          lastUpdatedDate: GlobalFunctions.formatUpdatedDate(val.transactionTimestamp),
          circleImageUrl: GlobalSettings.getImageUrl(val.playerHeadshot),
          circleImageRoute: playerRoute
          // subImageUrl: GlobalSettings.getImageUrl(val.teamLogo),
          // subImageRoute: teamRoute
        });
      });
    }
    return carouselArray;
  }

  transactionsData(data: Array<TransactionInfo>, type: string){
    let self = this;
    var listDataArray = [];

    if(type == "module"){
      data = data.slice(0,4);
    }

    listDataArray = data.map(function(val, index){
      return {
        dataPoints: [{
          style   : 'transactions-small',
          data    : GlobalFunctions.formatDateWithAPMonth(new Date(val['repDate']), "", " DD, YYYY"),
          value   : val.playerLastName + ", " + val.playerFirstName + ": " + val.contents,
          url     : null
        }],
        imageConfig: self.imageData("image-48","border-1",
        GlobalSettings.getImageUrl(val.playerHeadshot),MLBGlobalFunctions.formatPlayerRoute(val.playerName, val.playerName, val.playerId),null,null,null,null)
      };
    });
    return listDataArray;
  }//end of function

  /**
   *this function will have inputs of all required fields that are dynamic and output the full
  **/
  imageData(imageClass, imageBorder, mainImg, mainImgRoute, rank, subImgClass, subImg?, subRoute?){
    if(mainImg == null || mainImg == ''){
      mainImg = "/app/public/no-image.png";
    }
    if(subImg == null || subImg == ''){
      subImg = "/app/public/no-image.png";
    }
    var image = { //interface is found in image-data.ts
        imageClass        : imageClass,
        mainImage : {
            imageUrl      : mainImg,
            urlRouteArray : mainImgRoute,
            hoverText     : imageClass == "image-48" ? "<i class='fa fa-mail-forward'></i>" : "<p>View</p><p>Profile</p>",
            imageClass    : imageBorder,
        },
        subImages : [],
    };
    if(subRoute != null) {
      image.subImages = [
          {
              imageUrl: subImg,
              urlRouteArray: subRoute,
              hoverText: "<i class='fa fa-mail-forward'></i>",
              imageClass: subImgClass + " image-round-lower-right"
          },
      ];
    }
    if(rank != null){
      image.subImages.push( {
        text: "#"+rank,
        imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
      });
    }
    return image;
  }
}
