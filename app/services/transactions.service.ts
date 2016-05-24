import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {CircleImageData} from '../components/images/image-data';

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

  getTransactionsService(year, teamId, type?){
  //Configure HTTP Headers
  var headers = this.setToken();
  //var tabArray = ['Transactions', 'Suspensions', 'Injury Reports' ];
    var tabArray = [
      {
        tabData     : 'transactions',
        tabDisplay  : 'Transactions'
      },
      {
        tabData     : 'suspensions',
        tabDisplay  : 'Suspensions'
      },
      {
        tabData     : 'injuries',
        tabDisplay  : 'Injury Reports'
      }
    ];

  var callURL = this._apiUrl + '/team/transactions/'+teamId+'/'+year;

  return this.http.get( callURL, {
      headers: headers
    })
    .map(
      res => res.json()
    )
    .map(
      data => {
        var returnData = {}
        if(type == 'module'){
          return returnData = {
            carData:this.carTransactions(data.data, type),
            listData:this.detailedData(data.data, type),
            tabArray:tabArray,
          };
        }else{
          return returnData = {
            carData:this.carTransactions(data.data, type),
            listData:this.detailedData(data.data, type),
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
  carTransactions(data, type){
    let self = this;
    var carouselArray = [];
    var dummyImg = "/app/public/no-image.png";
    var dummyRoute = ['Disclaimer-page'];
    var dummyRank = '##';
    if(data.length == 0){//if no data is being returned then show proper Error Message in carousel
      var Carousel = {
        index:'2',
        //TODO
        imageConfig: self.imageData("image-150","border-large",dummyImg,'', 1, "image-50-sub",dummyImg,''),
        description:[
          "<p style='font-size:20px'><b>Sorry, we currently do not have any data for this year's draft history</b><p>",
        ],
      };
      carouselArray.push(Carousel);
    }else{
      //if data is coming through then run through the transforming function for the module
      data.forEach(function(val, index){
        var playerFullName = val.playerFirstName + " " + val.playerLastName;
        var Carousel = {
          index:index,
          //TODO
          imageConfig: self.imageData("image-150","border-large",GlobalSettings.getImageUrl(val.imageUrl),MLBGlobalFunctions.formatPlayerRoute(val['draftTeamName'], playerFullName, val['personId']), (index+1), "image-50-sub",GlobalSettings.getImageUrl(val.teamLogo),MLBGlobalFunctions.formatTeamRoute(val['draftTeamName'], val.draftTeam)),
          description:[
            '<p class="font-12 fw-400 lh-12 titlecase"><i class="fa fa-circle"></i> Transactions Report for ' + val.teamName + '</p>',
            '<p class="font-22 fw-800 lh-25" style="padding-bottom:16px;">'+ val.teamName +'</p>',
            '<p class="font-14 fw-400 lh-18" style="padding-bottom:6px;">'+ val.playerLastName + ', ' + val.playerFirstName + ': ' + val.contents + '<p>',
            '<p class="font-10 fw-400 lh-25">'+ val['repDate'] +'</p>',
            '<p class="font-10 fw-400 lh-25">Last Updated on '+ moment(val.lastUpdate).format('ddd MMM DD YYYY') +'</p>'
          ],
        };
        if(type == 'page'){
          Carousel['footerInfo'] = {
            infoDesc:'Interested in discovering more about this player?',
            text:'VIEW PROFILE',
            url:MLBGlobalFunctions.formatPlayerRoute(val['draftTeamName'], playerFullName, val['personId']),
          }
        }
        carouselArray.push(Carousel);
      });
    }
    return carouselArray;
  }

  detailedData(data, type){
    let self = this;
    var listDataArray = [];

    data.forEach(function(val, index){
      if(type == "module" && index >= 4){
        // module only needs two list items
        return false;
      }
      var playerFullName = val.playerFirstName + " " + val.playerLastName;
      console.log("each List data:",listData);
      var listData = {
        dataPoints: self.detailsData(
          val.playerName,
          val['selectionOverall']+' Overall',
          MLBGlobalFunctions.formatPlayerRoute(val['draftTeamName'],
          playerFullName, val['personId']),
          'Hometown: '+'[NEED CITY STATE]',
          'Transaction '+val['selectionLevel'],
          MLBGlobalFunctions.formatTeamRoute(val['draftTeamName'], val.draftTeam)
        ),
        imageConfig: self.imageData("image-121","border-2",
        GlobalSettings.getImageUrl(val.imageUrl),MLBGlobalFunctions.formatPlayerRoute(val['draftTeamName'], playerFullName, val['personId']),(index+1),"image-40-sub",GlobalSettings.getImageUrl(val.teamLogo),MLBGlobalFunctions.formatTeamRoute(val['draftTeamName'], val.draftTeam)),
        hasCTA:true,
        ctaDesc:'Want more info about this player?',
        ctaBtn:'',
        ctaText:'View Profile',
        ctaUrl:MLBGlobalFunctions.formatPlayerRoute(val['draftTeamName'], playerFullName, val['personId'])
      };
      listDataArray.push(listData);
    });
    return listDataArray;
  }//end of function

  /**
   *this function will have inputs of all required fields that are dynamic and output the full
  **/
  imageData(imageClass, imageBorder, mainImg, mainImgRoute, rank, subImgClass, subImg?, subRoute?){
    if(typeof mainImg =='undefined' || mainImg == ''){
      mainImg = "/app/public/no-image.png";
    }
    if(typeof subImg =='undefined' || subImg == ''){
      subImg = "/app/public/no-image.png";
    }
    if(typeof rank == 'undefined' || rank == 0){
      rank = 0;
    }
    var image = {//interface is found in image-data.ts
        imageClass: imageClass,
        mainImage: {
            imageUrl: mainImg,
            urlRouteArray: mainImgRoute,
            hoverText: "<p>View</p><p>Profile</p>",
            imageClass: imageBorder,
        },
        subImages: [
          {
            text: "#"+rank,
            imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
          }
        ],
    };
    if(typeof subRoute != 'undefined') {
      image.subImages = [
          {
              imageUrl: subImg,
              urlRouteArray: subRoute,
              hoverText: "<i class='fa fa-mail-forward'></i>",
              imageClass: subImgClass + " image-round-lower-right"
          },
          {
              text: "#"+rank,
              imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
          }
      ];
    }
    return image;
  }


  detailsData(mainP1,mainV1,mainUrl1,subP1,subV2,subUrl2,dataP3?,dataV3?,dataUrl3?){
    if(typeof dataP3 == 'undefined'){
      dataP3 = '';
    }
    if(typeof dataV3 == 'undefined'){
      dataV3 = '';
    }

    var details = [
      {
        style:'detail-small',
        data:dataP3,
        value:dataV3,
        url:dataUrl3,
      },
      {
        style:'detail-large',
        data:mainP1,
        value:mainV1,
        url:mainUrl1,
      },
      {
        style:'detail-medium',
        data:subP1,
        value:subV2,
        url:subUrl2,
        icon:'fa fa-map-marker',
      },
    ];
    return details;
  }
}
