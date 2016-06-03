import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions}  from '../global/mlb-global-functions';
import {GlobalSettings}  from '../global/global-settings';

declare var moment: any;
@Injectable()
export class ListOfListsService {
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

  getListOfListsService(urlParams, version){
    // Configure HTTP Headers
    var headers = this.setToken();

    let type    = urlParams.type;
    let id      = urlParams.id;
    var limit   = urlParams.limit != null ? urlParams.limit: 4;
    var pageNum = urlParams.pageNum != null ? urlParams.pageNum : 1;
    var scope   = urlParams.scope != null ? urlParams.scope : null;

    // Set scope for url based on type
    let scopePath;
    if(type=="player"){
      // if no scope is set for player list, default to league scope
      scopePath = scope != null && type == "player" ? '/' + scope : "/league";
    }
    else{
      scopePath = "";
    }

    var callURL = this._apiUrl + '/listOfLists/' + type + '/' + id + scopePath +'/'+ limit +'/' + pageNum;

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
              carData: this.carDataPage(data.data, version, type),
              listData: this.detailedData(data.data, version, type),
              targetData: this.getTargetData(data.data),
              pagination: data.data[0].listInfo
            };
          }else{
            return {
              carData: this.carDataPage(data.data, version, type),
              listData: this.detailedData(data.data, version, type),
              targetData: this.getTargetData(data.data),
              pagination: data.data[0].listInfo
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
  carDataPage(data, version, type){
    let self = this;
    var carouselArray = [];
    var dummyImg = GlobalSettings.getImageUrl("/mlb/players/no-image.png");

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
        let itemInfo          = val['listInfo'];
        let itemTargetData    = val.targetData;
        let itemProfile       = itemTargetData.playerName != null ? itemTargetData.playerName : itemTargetData.teamName;
        let itemImgUrl        = itemTargetData.imageUrl != null ? GlobalSettings.getImageUrl(itemTargetData.imageUrl) : GlobalSettings.getImageUrl(itemTargetData.teamLogo);
        let itemRoute         = version == "page"               ? MLBGlobalFunctions.formatPlayerRoute(itemTargetData.teamName, itemTargetData.playerName, itemTargetData.playerId) : MLBGlobalFunctions.formatTeamRoute(itemTargetData.teamName, itemTargetData.teamId);
        let itemSubImg        = type == "player"                ? MLBGlobalFunctions.formatTeamLogo(itemTargetData.teamName) : null;
        let itemSubRoute      = type == "player"                ? MLBGlobalFunctions.formatTeamRoute(itemTargetData.teamName, itemTargetData.teamId) : null;
        let itemHasHover      = version == "page";
        let ctaUrlArray       = itemInfo.url.split("/");
        let itemStatName      = (itemInfo.stat).replace(/-/g," ");
        let updatedDate       = moment(itemTargetData.lastUpdated).format('dddd, MMMM Do, YYYY');
        let itemDescription   = "";
        let rankStr           = itemTargetData.rank;
        rankStr += GlobalFunctions.Suffix(rankStr);

        if( type == "player"){
          itemDescription += "<b>"+ itemProfile + "</b> is currently ranked <b>"+ rankStr +"</b> in the <b>"+ itemInfo.scope +"</b> with the most <b>" + itemStatName + "</b>.";
        }else{
          itemDescription += "The <b>"+ itemProfile + "</b> are currently ranked <b>"+ rankStr +"</b> in the <b>"+ itemInfo.scope +"</b> with the most <b>" + itemStatName + "</b>.";
        }

        // removes first empty item and second "list" item
        ctaUrlArray.splice(0,2);
        ctaUrlArray.push.apply(ctaUrlArray,["10","1"]);

        var Carousel = {
          index:'2',
          // imageData(imageClass, imageBorder, mainImg, mainImgRoute, subImgClass?, subImg?, subRoute?, rank?, hasHover?){
          imageConfig: self.imageData("image-150", "border-large", itemImgUrl , itemRoute,"image-50-sub", itemSubImg, itemSubRoute, itemTargetData.rank, itemHasHover),
          description:[
            '<p class="font-12 fw-400 lh-12 titlecase"><i class="fa fa-circle"></i> Related List - ' + itemProfile + '</p>',
            '<p class="font-22 fw-800 lh-25" style="padding-bottom:16px;">'+ itemInfo.name +'</p>',
            '<p class="font-14 fw-400 lh-18" style="padding-bottom:6px;">'+ itemDescription +'<p>',
            '<p class="font-10 fw-400 lh-25">Last Updated on '+ updatedDate +'</p>'
          ],
          footerInfo: {
            infoDesc  :'Interested in discovering more about this ' + type +'?',
            text      :'View This List',
            url       : MLBGlobalFunctions.formatListRoute(ctaUrlArray)
            //url:['Team-page',{teamName:'team-name-here', teamId: '2796'}],//NEED TO CHANGE
          }
        };
        carouselArray.push(Carousel);
      });
    }
    // console.log('TRANSFORMED CAROUSEL', carouselArray);
    return carouselArray;
  }

  detailedData(data, version, type){
    let listDataArray     = [];
    let dummyUrl          = "/list/player/batter-home-runs/asc/National";
    let dummyName         = "Batters with the most home runs in the National League";
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

      let itemListInfo = item['listInfo'];
      let ctaUrlArray = itemListInfo.url.split("/");
      // removes first empty item and second "list" item
      ctaUrlArray.splice(0,2);
      ctaUrlArray.push.apply(ctaUrlArray,["10","1"]);

      var listData = {
        url           : itemListInfo.url           != null  ? itemListInfo.url          : dummyUrl,
        name          : itemListInfo.name          != null  ? itemListInfo.name         : dummyName,
        target        : type == "player"                    ? "player"                  : "team",
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
        ctaUrl        : MLBGlobalFunctions.formatListRoute(ctaUrlArray)
      };

      itemListData.forEach(function(val, index){
        // reset  the target since data is always returning player //TODO Backend
        itemListInfo.target   = type == "player"  ? type : "team";
        let itemUrlRouteArray = type == "player"  ? MLBGlobalFunctions.formatPlayerRoute(val.teamName, val.playerName, val.playerId) : MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId); let firstItemHover    = version == "page" ? "<p>View</p><p>Profile</p>" : null;

        listData.dataPoints.push(
          {
            imageClass : index > 0 ? "image-43" : "image-121",
            mainImage: {
              imageUrl        : val.imageUrl != null ? GlobalSettings.getImageUrl(val.imageUrl) : GlobalSettings.getImageUrl(val.teamLogo),
              urlRouteArray   : version == "page" || index > 0 ? itemUrlRouteArray : null,
              hoverText       : index > 0 ? "<i class='fa fa-mail-forward'></i>" : firstItemHover,
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
