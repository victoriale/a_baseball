import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {CircleImageData} from '../components/images/image-data';

@Injectable()
export class DraftHistoryService {
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

  getDraftHistoryService(year, teamId,type?){
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

  var callURL = this._apiUrl + '/team/draftHistory/'+teamId+'/'+year;
  // console.log(callURL);

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
            carData:this.carDraftHistory(data.data, type),
            listData:this.detailedData(data.data),
            tabArray:tabArray,
          };
        }else{
          return returnData = {
            carData:this.carDraftHistory(data.data, type),
            listData:this.detailedData(data.data),
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
  carDraftHistory(data, type){
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
          imageConfig: self.imageData("image-150","border-large",GlobalSettings.getImageUrl(val.imageUrl),MLBGlobalFunctions.formatPlayerRoute(val.draftTeamName, playerFullName, val.personId), (index+1), "image-50-sub",GlobalSettings.getImageUrl(val.teamLogo),MLBGlobalFunctions.formatTeamRoute(val.draftTeamName, val.draftTeam)),
          description:[
            '<p style="font-size:24px"><b>'+val.playerName+'</b></p>',
            '<p>Hometown: <b>'+val.draftTeamName+'</b></p>',
            '<br>',
            '<p style="font-size:24px"><b>'+val.selectionOverall+' Overall</b></p>',
            '<p>Draft Round '+val.selectionLevel+'</p>',
          ],
        };
        if(type == 'page'){
          Carousel['footerInfo'] = {
            infoDesc:'Interested in discovering more about this player?',
            text:'VIEW PROFILE',
            url:MLBGlobalFunctions.formatPlayerRoute(val.draftTeamName, playerFullName, val.personId),
          }
        }
        carouselArray.push(Carousel);
      });
    }
    // console.log('TRANSFORMED CAROUSEL', carouselArray);
    return carouselArray;
  }

  detailedData(data){
    let self = this;
    var listDataArray = [];

    var dummyImg = "/app/public/no-image.png";
    var dummyRoute = ['Disclaimer-page'];
    var dummyRank = '#4';

    var dummyProfile = "[Profile Name]";
    var dummyProfVal = "[Data Value 1]";
    var dummyProfUrl = ['Disclaimer-page'];
    var dummySubData = "[Data Value]: [City], [ST]";
    var dummySubDesc = "[Data Description]";
    var dummySubUrl = ['Disclaimer-page'];

    data.forEach(function(val, index){
      var playerFullName = val.playerFirstName + " " + val.playerLastName;
      var listData = {
        dataPoints: self.detailsData(
          val.playerName,
          val.selectionOverall+' Overall',
          MLBGlobalFunctions.formatPlayerRoute(val.draftTeamName,
          playerFullName, val.personId),
          'Hometown: '+'[NEED CITY STATE]',
          'Draft Round '+val.selectionLevel,
          MLBGlobalFunctions.formatTeamRoute(val.draftTeamName, val.draftTeam)
        ),
        imageConfig: self.imageData("image-121","border-2",
        GlobalSettings.getImageUrl(val.imageUrl),MLBGlobalFunctions.formatPlayerRoute(val.draftTeamName, playerFullName, val.personId),(index+1),"image-40-sub",GlobalSettings.getImageUrl(val.teamLogo),MLBGlobalFunctions.formatTeamRoute(val.draftTeamName, val.draftTeam)),
        hasCTA:true,
        ctaDesc:'Want more info about this player?',
        ctaBtn:'',
        ctaText:'View Profile',
        ctaUrl:MLBGlobalFunctions.formatPlayerRoute(val.draftTeamName, playerFullName, val.personId)
      };
      listDataArray.push(listData);
    });
    // console.log('TRANSFORMED List Data', listDataArray);
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
