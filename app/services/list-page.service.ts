import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';

@Injectable()
export class ListPageService {
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

  getListPageService(){//TODO replace data points for list page
  //Configure HTTP Headers
  var headers = this.setToken();
  //for MLB season starts and ends in the same year so return current season

  var callURL = this._apiUrl + '/team/draftHistory/2791/';
  // console.log(callURL);

  return this.http.get( callURL, {
      headers: headers
    })
    .map(
      res => res.json()
    )
    .map(
      data => {
        // console.log(data);
      },
      err => {
        console.log('INVALID DATA');
      }
    )
  }

  //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
  carDataPage(data){//TODO replace data points for list page
    let self = this;
    var carouselArray = [];
    var dummyImg = "./app/public/placeholder-location.jpg";
    var dummyRoute = ['Disclaimer-page'];
    var dummyRank = '##';

    if(data.length == 0){
      var Carousel = {
        index:'2',
        //TODO
        imageConfig: self.imageData("image-150","border-large",dummyImg,'',"image-50-sub",dummyImg,'',1),
        description:[
          '<p style="font-size:20px"><b>Sorry, the We currently do not have any data for this years draft history</b><p>',
        ],
      };
      carouselArray.push(Carousel);
    }else{
      //if data is coming through then run through the transforming function for the module
      data.forEach(function(val, index){

        var Carousel = {
          index:'2',
          //TODO
          imageConfig: self.imageData("image-150","border-large",dummyImg,dummyRoute,"image-50-sub",dummyImg,dummyRoute,index+1),
          description:[
            '<p style="font-size:24px"><b>'+val.playerName+'</b></p>',
            '<p>Hometown: <b>'+val.draftTeamName+'</b></p>',
            '<br>',
            '<p style="font-size:24px"><b>'+(index+1)+'<sup>'+self.globalFunc.Suffix(Number(index+1))+'</sup>Pick for Round '+val.selectionLevel+'</b></p>',
            '<p>'+val.selectionOverall+' Overall</p>',
          ],
          footerInfo: {
            infoDesc:'Interested in discovering more about this player?',
            text:'VIEW PROFILE',
            url:['Team-page',{teamName:val.draftTeamName, teamId: val.draftTeam}],//NEED TO CHANGE
          }
        };
        carouselArray.push(Carousel);
      });
    }
    // console.log('TRANSFORMED CAROUSEL', carouselArray);
    return carouselArray;
  }

  detailedData(data){//TODO replace data points for list page
    let self = this;
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
        imageConfig: self.imageData("image-121","border-2",
        dummyImg,dummyRoute,"image-40-sub",dummyImg,dummyRoute,(index+1)),
        hasCTA:true,
        ctaDesc:'Want more info about this [profile type]?',
        ctaBtn:'',
        ctaText:'View Profile',
        ctaUrl:['Team-page']
      };
      listDataArray.push(listData);
    });
    // console.log('TRANSFORMED List Data', listDataArray);
    return listDataArray;
  }//end of function

  /**
   *this function will have inputs of all required fields that are dynamic and output the full
  **/
  //TODO replace data points for list page
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

  //TODO replace data points for list page
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
