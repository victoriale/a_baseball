import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';

@Injectable()
export class DraftHistoryService {
  private _apiUrl: string = 'http://dev-homerunloyal-api.synapsys.us';
  // private _apiToken: string = 'BApA7KEfj';
  // private _headerName: string = 'X-SNT-TOKEN';

  constructor(public http: Http, public globalFunc: GlobalFunctions){

  }

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      //headers.append(this.headerName, this.apiToken);
      return headers;
  }

  getDraftHistoryService(year){
  //Configure HTTP Headers
  var headers = this.setToken();

  //for MLB season starts and ends in the same year so return current season
  //get past 5 years for tabs
  var tabDates = Number(year);
  var tabArray = [];
  for(var i = 0; i <5; i++){
    if(i == 0){
      var currentYear = 'Current Season';
    }else{
      var currentYear = (tabDates - i).toString();
    }
    tabArray.push({
      tabData:tabDates - i,
      tabDisplay:currentYear,
    });
  }

  var callURL = this._apiUrl + '/team/draftHistory/2791/'+year;
  // console.log(callURL);
  return this.http.get( callURL, {
      headers: headers
    })
    .map(
      res => res.json()
    )
    .map(
      data => {
        // this.carData(data.data);
        // this.detailedData(data.data);
        console.log('full data return',data);
        return {
          carData:this.carData(data.data),
          listData:this.detailedData(data.data),
          tabArray:tabArray,
        };
      },
      err => {
        console.log('INVALID DATA');
      }
    )
  }

  //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
  carData(data){
    // console.log('carousel transform',data);
    var self = this;
    var carouselArray = [];
    var dummyImg = "./app/public/placeholder-location.jpg";
    var dummyRoute = ['Disclaimer-page'];
    var dummyRank = '#4';

    data.forEach(function(val, index){
      var Carousel = {
        index:'2',
        //imageData(mainImg, mainImgRoute, subImg, subRoute, rank)
        imageConfig: self.imageData("image-150","border-large",dummyImg,dummyRoute,"image-50-sub",dummyImg,dummyRoute,index+1),
        description:[
          '<p><b>'+val.playerName+'</b><p>',
          '<p>Hometown: <b>'+val.draftTeamName+'</b><p>',
          '<p><b>'+(index+1)+'<sup>'+self.globalFunc.Suffix(Number(index+1))+'</sup>Pick for Round '+val.selectionLevel+'</b><p>',
          '<p>'+val.selectionOverall+' Overall<p>',
        ],
        footerInfo: {
          infoDesc:'Want to see more info about this player?',
          text:'VIEW PROFILE',
          url:['Disclaimer-page'],
        }
      };
      carouselArray.push(Carousel);
    });
    // console.log('TRANSFORMED CAROUSEL', carouselArray);
    return carouselArray;
  }

  detailedData(data){
    // console.log('list data transform',data);
    var self = this;
    var listDataArray = [];

    var dummyImg = "./app/public/placeholder-location.jpg";
    var dummyRoute = ['Disclaimer-page'];
    var dummyRank = '#4';

    var dummyProfile = "[Profile Name]";
    var dummyProfVal = "[Data Value 1]";
    var dummyProfUrl = ['Disclaimer-page'];
    var dummySubData = "[Data Value]: [City], [ST]";
    var dummySubDesc = "[Data Description]";
    var dummySubUrl = ['Disclaimer-page'];

    data.forEach(function(val, index){
      var listData = {
        dataPoints: self.detailsData(val.playerName,(val.selectionLevel+' Round'),dummyProfUrl,val.draftTeamName,(val.selectionOverall +' Overall'),dummySubUrl),
        //detailsData(mainP1,mainV1,subP1,subV2,subUrl2,dataP3?,dataV3?,dataUrl3?)
        imageConfig: self.imageData("image-121","border-2",
        dummyImg,dummyRoute,"image-40-sub",dummyImg,dummyRoute,(index+1)),
        hasCTA:true,
        ctaDesc:'Want more info about this [profile type]?',
        ctaBtn:'',
        ctaText:'View Profile',
        ctaUrl:['Disclaimer-page']
      };
      listDataArray.push(listData);
    });
    // console.log('TRANSFORMED List Data', listDataArray);
    return listDataArray;
  }//end of function

  /**
   *
   *
   *this function will have inputs of all required fields that are dynamic and output the full
   *
   *
  **/
  imageData(imageClass, imageBorder, mainImg, mainImgRoute, subImgClass?, subImg?, subRoute?, rank?){
    if(typeof mainImg =='undefined' || mainImg == ''){
      mainImg = "./app/public/placeholder-location.jpg";
    }
    if(typeof subImg =='undefined' || subImg == ''){
      mainImg = "./app/public/placeholder-location.jpg";
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
            imageClass: imageBorder
        },
        subImages: [
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
        ],
    };
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
    return details
  }
}
