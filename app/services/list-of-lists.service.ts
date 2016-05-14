import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions}  from '../global/mlb-global-functions';
import {GlobalSettings}  from '../global/global-settings';

@Injectable()
export class ListOfListsService {
  private _apiUrl: string = GlobalSettings.getApiUrl();

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

  getListOfListsService(version, type, id, scope?, count?, page?){
    // Configure HTTP Headers
    var headers = this.setToken();
    // Set url variables
    var scopePath;
    if(type=="player"){
      scopePath = scope != null && type == "player" ? '/' + scope : "/league";
    }
    else{
      scopePath = "";
    }
    if( scope == null ){scope = ""};
    var count = count != null ? count : 4;
    var page = page != null ? page : 1;

    var callURL = this._apiUrl + '/listOfLists/' + type + '/' + id + scopePath +'/'+ count +'/' + page;

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
              carData: this.carDataPage(data.data, scope),
              listData: this.detailedData(data.data, scope),
              targetData: this.getTargetData(data.data),
            };
          }else{
            return {
              carData: this.carDataPage(data.data, scope),
              listData: this.detailedData(data.data, scope),
              targetData: this.getTargetData(data.data),
            };
          }
        },
        err => {
          console.log('INVALID DATA');
        }
      )
  }
  getTargetData(data) {
    return(data[0].targetData);
  }

  //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
  carDataPage(data, scope){
    let self = this;
    var carouselArray = [];
    var dummyImg = GlobalSettings.getImageUrl("/mlb/players/no-image.png");
    var dummyRoute = ['Disclaimer-page'];
    var dummyRank = '##';

    if(data.length == 0){
      var Carousel = {
        index:'2',
        imageConfig: self.imageData("image-150","border-large",dummyImg,'',"image-50-sub",dummyImg,'',1, false),
        description:[
          '<p style="font-size:20px"><b>Sorry, we currently do not have any data for this list.</b><p>',
        ],
      };
      carouselArray.push(Carousel);
    }else{
      //if data is coming through then run through the transforming function for the module
      data.forEach(function(val, index){
        if( val.listData[0] == null) return;
        let itemData          = val.listData[0];
        let itemInfo          = val.listInfo;
        let itemTargetData    = val.targetData;
        let itemImgUrl        = itemTargetData.imageUrl != null ? GlobalSettings.getImageUrl(itemTargetData.imageUrl) : GlobalSettings.getImageUrl(itemTargetData.teamLogo);
        let itemRoute         = index > 0 ? dummyRoute : null;
        let itemSubImg        = itemTargetData.playerName != null ? MLBGlobalFunctions.formatTeamLogo(itemTargetData.teamName) : null;

        var Carousel = {
          index:'2',
          // imageData(imageClass, imageBorder, mainImg, mainImgRoute, subImgClass?, subImg?, subRoute?, rank?, hasHover?){
          imageConfig: self.imageData("image-150", "border-large", itemImgUrl , itemRoute,"image-50-sub", itemSubImg,dummyRoute, itemTargetData.rank, false),
          description:[
            '<p class="font-12 fw-400 lh-12 titlecase"><i class="fa fa-circle"></i> Related List - ' + itemTargetData.playerName + '</p>',
            '<p class="font-22 fw-900 lh-25" style="padding-bottom:16px;">'+ itemInfo.name +'</p>',
            '<p class="font-14 fw-400 lh-18" style="padding-bottom:6px;">This list contains <b>[##] player profiles</b> ranked by <b>[data point 1]</b>. <b>[Current Profile Name]</b> is <b>ranked [##] over-all</b> with a <b>[data point 1]</b> of <b>[data value]</b> for [YYYY].</p>',
            '<p class="font-10 fw-400 lh-25">Last Updated on [Day Of The Week], [Month] [Day], [YYYY]</p>'
          ],
          footerInfo: {
            infoDesc:'Interested in discovering more about this player?',
            text:'View This List',
            url:['Team-page',{teamName:'team-name-here', teamId: '2796'}],//NEED TO CHANGE
          }
        };
        carouselArray.push(Carousel);
      });
    }
    // console.log('TRANSFORMED CAROUSEL', carouselArray);
    return carouselArray;
  }

  detailedData(data, scope){
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
    let dummyListRank     = 1;
    let dummyIcon         = "fa fa-share";

    data.forEach(function(item, index){
      let itemListData = item.listData;
      if( itemListData.length<1 ) return;
      itemListData.unshift(item.targetData);

      let itemListInfo = item.listInfo;
      console.log("itemListInfo", itemListInfo);

      var listData = {
        url           : itemListInfo.url           != null  ? itemListInfo.url          : dummyUrl,
        name          : itemListInfo.name          != null  ? itemListInfo.name         : dummyName,
        target        : itemListInfo.playerName    != null  ? "player"                  : "team",
        stat          : itemListInfo.stat          != null  ? itemListInfo.stat         : dummyStat,
        ordering      : itemListInfo.ordering      != null  ? itemListInfo.ordering     : dummyOrdering,
        scope         : itemListInfo.scope         != null  ? itemListInfo.scope        : dummyScope,
        conference    : itemListInfo.conference    != null  ? itemListInfo.conference   : dummyConference,
        division      : itemListInfo.division      != null  ? itemListInfo.division     : dummyDivision,
        listCount     : itemListInfo.listCount     != null  ? itemListInfo.listCount    : dummyListCount,
        pageCount     : itemListInfo.pageCount     != null  ? itemListInfo.pageCount    : dummyPageCount,
        listRank      : itemListInfo.listRank      != null  ? itemListInfo.listRank     : dummyListRank,
        icon          : itemListInfo.icon          != null  ? itemListInfo.icon         : dummyIcon,
        dataPoints    : [],
        ctaBtn        : '',
        ctaText       : 'View The List',
        ctaUrl        : ['Disclaimer-page']
      };

      itemListData.forEach(function(val, index){
        let itemUrlRouteArray   = [];

        // reset  the target since data is always returning player //TODO Backend
        itemListInfo.target = itemListInfo.playerName != null  ? "player" : "team";

        if( index > 0 ){
          itemUrlRouteArray = itemListInfo.target == "player" ? MLBGlobalFunctions.formatPlayerRoute(val.teamName, val.playerName, val.playerId) : MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId);
        }

        console.log("ili target:",itemListInfo.target);
        listData.dataPoints.push(
          {
            imageClass : index > 0 ? "image-43" : "image-121",
            mainImage: {
              imageUrl        : val.imageUrl != null ? GlobalSettings.getImageUrl(val.imageUrl) : GlobalSettings.getImageUrl(val.teamLogo),
              urlRouteArray   : index > 0 ? itemUrlRouteArray : null,
              hoverText       : index > 0 ? "<i class='fa fa-mail-forward'></i>" : "<p>View</p><p>Profile</p>",
              imageClass      : index > 0 ? "border-1" : "border-2"
            },
            subImages         : index > 0 ? null : [
              {
                imageUrl      : itemListInfo.target == "player" ? MLBGlobalFunctions.formatTeamLogo(val.teamName) : null,
                urlRouteArray : itemListInfo.target == "player" ? MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId) : null,
                hoverText     : itemListInfo.target == "player" ? "<i class='fa fa-mail-forward'></i>" : null,
                imageClass    : itemListInfo.target == "player" ? "image-round-sub image-40-sub image-round-lower-right" : null
              },
              {
              text: "#"+ val.rank,
              imageClass: "image-38-rank image-round-upper-left image-round-sub-text"
            }]
          }
        )
      });
      listDataArray.push(listData);
    });
    return listDataArray;
  }

  imageData(imageClass, imageBorder, mainImg, mainImgRoute, subImgClass?, subImg?, subRoute?, rank?, hasHover?){
    if(typeof mainImg =='undefined' || mainImg == ''){
      mainImg = GlobalSettings.getImageUrl("/mlb/players/no-image.png");
    }
    if(typeof subImg =='undefined' || subImg == ''){
      mainImg = GlobalSettings.getImageUrl("/mlb/players/no-image.png");
    }
    if(typeof rank == 'undefined' || rank == 0){
      rank = 0;
    }
    var image = {//interface is found in image-data.ts
      imageClass: imageClass,
      mainImage: {
        imageUrl       : mainImg,
        urlRouteArray  : hasHover ? mainImgRoute : null,
        hoverText      : hasHover ? "<p>View</p><p>Profile</p>" : null,
        imageClass     : imageBorder
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
          imageClass: "image-48-rank image-round-upper-left image-round-sub-text"
        }
      ],
    };
    return image;
  }
}
