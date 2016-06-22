import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {CircleImageData} from '../components/images/image-data';
import {SliderCarousel} from '../components/carousels/slider-carousel/slider-carousel.component';

declare var moment: any;

@Injectable()
export class TransactionsService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  // private _apiToken: string = 'BApA7KEfj';
  // private _headerName: string = 'X-SNT-TOKEN';

  constructor(public http: Http){

  }

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      //headers.append(this.headerName, this.apiToken);
      return headers;
  }

  getTransactionsService(transactionType, teamId, type?, sort?, limit?, page?){
  //Configure HTTP Headers
  var headers = this.setToken();
  if( sort == null){ sort = "desc";}
  if( limit == null){ limit = 10;}
  if( page == null){ page = 1;}

  var tabArray = [
    {
      tabData     : 'transactions',
      tabDisplay  : 'Transactions',
      sortOptions : [
        { key: "recent", value: "Most Recent"},
        { key: "oldest", value: "Oldest First"}
        ]
    },
    {
      tabData     : 'suspensions',
      tabDisplay  : 'Suspensions',
      sortOptions : [
        { key: "recent", value: "Most Recent"},
        { key: "oldest", value: "Oldest First"}
      ]
    },
    {
      tabData     : 'injuries',
      tabDisplay  : 'Injuries',
      sortOptions : [
        { key: "recent", value: "Most Recent"},
        { key: "oldest", value: "Oldest First"}
      ]
    }
  ];

  var callURL = this._apiUrl + '/team/transactions/'+teamId+'/'+transactionType+'/'+sort+'/'+limit+'/'+page;

  return this.http.get( callURL, {
      headers: headers
    })
    .map(
      res => res.json()
    )
    .map(
      data => {
        if(type == 'module'){
          return {
            carData:this.carTransactions(data.data, type),
            listData:this.transactionsData(data.data, type),
            tabArray:tabArray,
          };
        }else{
          return {
            carData:this.carTransactions(data.data, type),
            listData:this.transactionsData(data.data, type),
            tabArray:tabArray,
          };
        }
      },
      err => {
        console.log('INVALID DATA');
      }
    )
  }

  //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
  //FOR THE PAGE
  carTransactions(data: Array<any>, type) {
    let self = this;
    var carouselArray = [];
    var dummyImg = "/app/public/Image-Placeholder-2.jpg";
    if(data.length == 0){//if no data is being returned then show proper Error Message in carousel
      var Carousel = {
        index:'2',
        //TODO
        imageConfig: self.imageData("image-150","border-large",null,null, null, null,null, null),
        description:[
          "<p style='font-size:20px'><b>Sorry, we currently do not have any data for this transaction type.</b><p>",
        ],
      };
      carouselArray.push(Carousel);
    }else{
      if ( type == "module" ) {
          // module only needs four list items
        data = data.slice(4);
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
          subheader: [' Transaction Report - ', teamLinkText],
          profileNameLink: playerLinkText,
          description: [
              'Transaction date - ' + val.repDate + ': ' + val.contents
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

  transactionsData(data, type){
    let self = this;
    var listDataArray = [];

    data.forEach(function(val, index){
      if(type == "module" && index >= 4){
        // module only needs two list items
        return false;
      }
      var listData = {
        dataPoints: [{
          style   : 'transactions-small',
          data    : GlobalFunctions.formatDateWithAPMonth(new Date(val['repDate']), "", " DD, YYYY"),
          value   : val.playerLastName + ", " + val.playerFirstName + ": " + val.contents,
          url     : null
        }],
        imageConfig: self.imageData("image-48","border-1",
        GlobalSettings.getImageUrl(val.playerHeadshot),MLBGlobalFunctions.formatPlayerRoute(val.playerName, val.playerName, val.playerId),null,null,null,null)
      };
      listDataArray.push(listData);
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
