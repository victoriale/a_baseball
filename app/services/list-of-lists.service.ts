import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions}  from '../global/mlb-global-functions';

@Injectable()
export class ListOfListsService {
  private _apiUrl: string = 'http://dev-homerunloyal-api.synapsys.us';
  private _imageUrl = "http://prod-sports-images.synapsys.us";

  // private _apiToken: string = 'BApA7KEfj';
  // private _headerName: string = 'X-SNT-TOKEN';

  constructor(public http: Http, public globalFunc: GlobalFunctions, public mlbFunc: MLBGlobalFunctions){
  }

  //Function to set custom headers
  setToken(){
    var headers = new Headers();
    //headers.append(this.headerName, this.apiToken);
    return headers;
  }

  getListOfListsService(version, type?, scope?, conference?, count?, page?){
    // Configure HTTP Headers
    var headers = this.setToken();
    // Set url variables
    var type = type != null ? type : "all";
    var scope = scope != null ? scope : "all";
    var count = count != null ? count : 6;
    var page = page != null ? page : 1;

    var callURL = this._apiUrl + '/listOfLists/player/'+ scope +'/'+ conference +'/'+ count +'/' + page;

    return this.http.get( callURL, {
        headers: headers
      })
      .map(
        res => res.json()
      )
      .map(
        data => {
          if(version == 'module'){
            return {
              // no need for carousel data
              listData: this.detailedData(data.data),
              raw: data
            };
          }else{
            return {
              //carData: this.carDataPage(data.data),
              listData: this.detailedData(data.data),
              raw: data
            };
          }
        },
        err => {
          console.log('INVALID DATA');
        }
      )
  }

  //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
  carDataPage(data){
    let self = this;
    var carouselArray = [];
    var dummyImg = "./app/public/placeholder-location.jpg";
    var dummyRoute = ['Disclaimer-page'];
    var dummyRank = '##';

    if(data.length == 0){
      var Carousel = {
        index:'2',
        imageConfig: self.imageData("image-150","border-large",dummyImg,'',"image-50-sub",dummyImg,'',1),
        description:[
          '<p style="font-size:20px"><b>Sorry, we currently do not have any data for this list.</b><p>',
        ],
      };
      carouselArray.push(Carousel);
    }else{
      //if data is coming through then run through the transforming function for the module
      data.forEach(function(val, index){
        var Carousel = {
          index:'2',
          imageConfig: self.imageData("image-150","border-large",dummyImg,dummyRoute,"image-50-sub",dummyImg,dummyRoute,index+1),
          description:[
            '<p style="font-size:24px"><b>'+val.playerName+'</b></p>',
            '<p>Hometown: <b></b></p>',
            '<br>',
            '<p style="font-size:24px"><b>'+(index+1)+'<sup>'+self.globalFunc.Suffix(Number(index+1))+'</sup>Pick for Round '+val.selectionLevel+'</b></p>',
            '<p>'+' Overall</p>',
          ],
          footerInfo: {
            infoDesc:'Interested in discovering more about this player?',
            text:'VIEW PROFILE',
            url:['Team-page'],//NEED TO CHANGE
          }
        };
        carouselArray.push(Carousel);
      });
    }
    // console.log('TRANSFORMED CAROUSEL', carouselArray);
    return carouselArray;
  }

  detailedData(data){
    let self              = this;
    let listDataArray     = [];
    let dummyUrl          = "/list/player/batter-home-runs/asc/National";
    let dummyName         = "Batters with the most home runs in the National League";
    let dummyTarget       = "player";
    let dummyStat         = "batter-home-runs";
    let dummyOrdering     = "asc";
    let dummyScope        = "conference";
    let dummyConference   = "National";
    let dummyDivision     = "all";
    let dummyListCount    = 1;
    let dummyPageCount    = 1;
    let dummyRank         = 1;
    let dummyIcon         = "fa fa-share";

    data.forEach(function(item, index){
      let itemListData = item.listData;
      if( itemListData.length<1 ) return;

      let itemListInfo = item.listInfo;

      var listData = {
        url           : itemListInfo.url           != null  ? itemListInfo.url          : dummyUrl,
        name          : itemListInfo.name          != null  ? itemListInfo.name         : dummyName,
        target        : itemListInfo.target        != null  ? itemListInfo.target       : dummyTarget,
        stat          : itemListInfo.stat          != null  ? itemListInfo.stat         : dummyStat,
        ordering      : itemListInfo.ordering      != null  ? itemListInfo.ordering     : dummyOrdering,
        scope         : itemListInfo.scope         != null  ? itemListInfo.scope        : dummyScope,
        conference    : itemListInfo.conference    != null  ? itemListInfo.conference   : dummyConference,
        division      : itemListInfo.division      != null  ? itemListInfo.division     : dummyDivision,
        listCount     : itemListInfo.listCount     != null  ? itemListInfo.listCount    : dummyListCount,
        pageCount     : itemListInfo.pageCount     != null  ? itemListInfo.pageCount    : dummyPageCount,
        rank          : itemListInfo.rank          != null  ? itemListInfo.rank         : dummyRank,
        icon          : itemListInfo.icon          != null  ? itemListInfo.icon         : dummyIcon,
        dataPoints    : [],
        ctaBtn        : '';
        ctaText       : 'View The List';
        ctaUrl        : ['Disclaimer-page'];
      };

      itemListData.forEach(function(val, index){
        listData.dataPoints.push(
          {
            imageClass : index > 0 ? "image-43" : "image-121",
            mainImage: {
              imageUrl        : val.imageUrl != null ? self._imageUrl + val.imageUrl : "./app/public/placeholder-location.jpg",
              urlRouteArray   : itemListInfo.target == "player" ? self.mlbFunc.formatPlayerRoute(val.teamName, val.playerName, val.playerId) : self.mlbFunc.formatTeamRoute(val.teamName, val.teamId),
              hoverText       : index > 0 ? "<i class='fa fa-mail-forward'></i>" : "<p>View</p><p>Profile</p>",
              imageClass      : index > 0 ? "border-1" : "border-2"
            },
            subImages         : index > 0 ? null : [{
              text: listData.rank,
              imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
            }]
          }
        )
      });
      listDataArray.push(listData);
    });
    return listDataArray;
  }
}

