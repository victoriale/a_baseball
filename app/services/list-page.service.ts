import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';

declare var moment;
@Injectable()
export class ListPageService {
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

  /*
    query:{
    profile: //profile type ex: 'team' or 'player'
    listname: //list name sent back as lower kebab case  ex: 'batter-runs'
    sort: //sorting the list by 'desc' or 'asc'
    conference: //sort list by conference, but if sort by entire league then 'all' would be in place
    division: //sort list by division, but if sort by all divisions then 'all' would be in place. conference is required if 'all' is in place
    limit: // limit the amount of data points come back but a number amount
    pageNum: //  determined by the limit as well detects what page to view based on the limit ex: limit: 10  page 1 holds 1-10 and page 2 holds 11-20
    }
  */
  getListPageService(query){
  //Configure HTTP Headers
  var headers = this.setToken();

  var callURL = this._apiUrl+'/list';

  for(var q in query){
    callURL += "/" + query[q];
  }
  // console.log(callURL);
  return this.http.get( callURL, {
      headers: headers
    })
    .map(
      res => res.json()
    )
    .map(
      data => {
        data.data['query'] = query;
        return {
          profHeader: this.profileHeader(data.data),
          carData: this.carDataPage(data.data, 'page'),
          listData: this.detailedData(data.data),
          pagination: data.data.listInfo
        }
      },
      err => {
        console.log('INVALID DATA');
      }
    )
  }

  //moduleType can be either 'pitcher' or 'batter' to generate the tabs list used to generate a static list for MVP module
  getListModuleService(query, moduleType){
  //Configure HTTP Headers
  var headers = this.setToken();

  var callURL = this._apiUrl+'/list';

  //generate a static list of tab array based on the moduleType to emit the tabData and have a tabDisplay for the DOM
  if(moduleType == 'pitcher'){
    var tabArray = [
      {
        tabData:'pitcher-innings-pitched',
        tabDisplay: 'Innings Pitched',
      },
      {
        tabData:'pitcher-strikeouts',
        tabDisplay: 'Strike Outs',
      },
      {
        tabData:'pitcher-earned-run-average',
        tabDisplay: 'ERA',
      },
      {
        tabData:'pitcher-hits-allowed',
        tabDisplay: 'Hits',
      },
    ];
  }else{//defaults to 'batter' if nothing is sent to moduleType
    var tabArray = [
      {
        tabData:'batter-home-runs',
        tabDisplay: 'Home Runs',
      },
      {
        tabData:'batter-batting-average',
        tabDisplay: 'Batting Avg.',
      },
      {
        tabData:'batter-runs-batted-in',
        tabDisplay: 'Runs Batted In',
      },
      {
        tabData:'batter-hits',
        tabDisplay: 'Hits',
      },
      {
        tabData:'batter-bases-on-balls',
        tabDisplay: 'Walks',
      },
    ];
  }

  for(var q in query){
    callURL += "/" + query[q];
  }
  // console.log(callURL);
  return this.http.get( callURL, {
      headers: headers
    })
    .map(
      res => res.json()
    )
    .map(
      data => {
        data.data['query'] = query;//used in some functions below
        return {
          tabArray:tabArray,
          profHeader: this.profileHeader(data.data),
          carData: this.carDataPage(data.data,'module'),
          listData: this.detailedData(data.data),
          pagination: data.data.listInfo
        }
      },
      err => {
        console.log('INVALID DATA');
      }
    )
  }

  profileHeader(data){
    var profile = data.listInfo;
    var profileData = {
      imageURL: '/app/public/mainLogo.png', //TODO
      text1: 'Last Updated: '+ moment(data.listData[0].lastUpdate).format('dddd, MMMM Do, YYYY') + ' at ' + moment(data.listData[0].lastUpdate).format('hh:mm A') + ' ET', //TODO
      text2: 'United States',
      text3: profile.name,
      icon: 'fa fa-map-marker',
      hasHover : true,
    };
    return profileData;
  }

  //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
  carDataPage(data, profileType){
    // console.log('original carousel data', data);
    let self = this;
    var carouselArray = [];
    var dummyImg = "/app/public/no-image.png";
    var dummyRoute = ['Error-page'];
    var dummyRank = '##';

    var carData = data.listData;
    var carInfo = data.listInfo;
    if(carData.length == 0){
      var Carousel = {// dummy data if empty array is sent back
        index:'2',
        imageConfig: self.imageData("image-150","border-large",dummyImg,dummyRoute, 1, 'image-38-rank',"image-50-sub"),
        description:[
          '<p style="font-size:20px"><b>Sorry, we currently do not have any data for this particular list</b><p>',
        ],
      };
      carouselArray.push(Carousel);
    }else{
      //if data is coming through then run through the transforming function for the module
      carData.forEach(function(val, index){
        var rank = ((Number(data.query.pageNum) - 1) * Number(data.query.limit)) + (index+1);
        val.listRank = rank;

        if(data.query.profile == 'team'){
          var Carousel = {
            index:index,
            imageConfig: self.imageData(
              "image-150",
              "border-large",
              GlobalSettings.getImageUrl(val.teamLogo),
              MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId),
              val.listRank,
              'image-48-rank',
              'image-50-sub'),
            description:[
              '<p style="font-size:24px"><b>'+val.teamName+'</b></p>',
              '<p><i class="fa fa-map-marker text-master"></i>'+val.teamCity +', '+val.teamState+'</p>',
              '<br>',
              '<p style="font-size:24px"><b>'+val.stat+'</b></p>',
              '<p style="font-size:20px"> '+ carInfo.stat.replace(/-/g, ' ') +'</p>',
            ],
          };
          if(profileType == 'page'){
            Carousel['footerInfo'] = {
              infoDesc:'Interested in discovering more about this team?',
              text:'View Profile',
              url:MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId),
            }
          }
        }else if(data.query.profile == 'player'){
          var position = '';
          for(var i = 0; i < val.position.length ;i++){
            if((i+1) != val.position.length){
              position += val.position[i] + ", ";
            }else{
              position += val.position[i];
            }
          }
          var playerFullName = val.playerFirstName + " " + val.playerLastName;
          var Carousel = {
            index:index,
            imageConfig: self.imageData(
              "image-150",
              "border-large",
              GlobalSettings.getImageUrl(val.imageUrl),
              MLBGlobalFunctions.formatPlayerRoute(val.teamName, playerFullName, val.playerId),
              val.listRank,
              'image-48-rank',
              'image-50-sub',
              GlobalSettings.getImageUrl(val.teamLogo),
              MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId)),
            description:[
              '<br>',
              '<p style="font-size:24px"><b>'+playerFullName+'</b></p>',
              '<p></i> <b> '+val.teamName+' | Jersey: #'+val.uniformNumber+' Pos: '+position+'</b></p>',
              '<br>',
              '<p style="font-size:24px"><b>'+val.stat+'</b></p>',
              '<p style="font-size:20px"> '+ carInfo.stat.replace(/-/g, ' ') +'</p>',
            ],
          };
          if(profileType == 'page'){
            Carousel['footerInfo'] = {
              infoDesc:'Interested in discovering more about this player?',
              text:'View Profile',
              url:MLBGlobalFunctions.formatPlayerRoute(val.teamName, playerFullName, val.playerId),
            }
          }
        }
        carouselArray.push(Carousel);
      });
    }
    // console.log('TRANSFORMED CAROUSEL', carouselArray);
    return carouselArray;
  }

  detailedData(data){//TODO replace data points for list page
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

    var detailData = data.listData;
    var detailInfo = data.listInfo;
    detailData.forEach(function(val, index){
      var rank = ((Number(data.query.pageNum) - 1) * Number(data.query.limit)) + (index+1);
      val.listRank = rank;
      if(data.query.profile == 'team'){
        var listData = {
          dataPoints: self.detailsData(
            val.teamName,
            (val.stat),
            MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId),
            val.teamCity +', '+val.teamState + ' | Division: '+ MLBGlobalFunctions.formatShortNameDivison(val.conferenceName) + val['divisionName'].charAt(0).toUpperCase(),
            self.globalFunc.toTitleCase(detailInfo.stat.replace(/-/g, ' ')),
            MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId),'fa fa-map-marker'),
            imageConfig: self.imageData("image-121","border-2",
            GlobalSettings.getImageUrl(
            val.teamLogo),
            MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId),
            val.listRank,
            'image-38-rank',
            'image-40-sub'),
          hasCTA:true,
          ctaDesc:'Want more info about this team?',
          ctaBtn:'',
          ctaText:'View Profile',
          ctaUrl:MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId)
        };
      }else if(data.query.profile == 'player'){
        var playerFullName = val.playerFirstName + " " + val.playerLastName;
        var position = '';
        for(var i = 0; i < val.position.length ;i++){
          if((i+1) != val.position.length){
            position += val.position[i] + ", ";
          }else{
            position += val.position[i];
          }
        }
        var listData = {
          dataPoints: self.detailsData(
            playerFullName,
            (val.stat),
            MLBGlobalFunctions.formatPlayerRoute(val.teamName, playerFullName, val.playerId),
            val.teamName +' | Position: ' + position,
            self.globalFunc.toTitleCase(detailInfo.stat.replace(/-/g, ' ')),
            MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId)),
            imageConfig: self.imageData(
            "image-121",
            "border-2",
            GlobalSettings.getImageUrl(val.imageUrl),
            MLBGlobalFunctions.formatPlayerRoute(val.teamName, playerFullName, val.playerId),
            val.listRank,
            'image-38-rank',
            'image-40-sub',
            GlobalSettings.getImageUrl(val.teamLogo),
            MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId)),
          hasCTA:true,
          ctaDesc:'Want more info about this player?',
          ctaBtn:'',
          ctaText:'View Profile',
          ctaUrl: MLBGlobalFunctions.formatPlayerRoute(val.teamName, playerFullName, val.playerId)
        };
      }

      listDataArray.push(listData);
    });
    // console.log('TRANSFORMED List Data', listDataArray);
    return listDataArray;
  }//end of function

  /**
   *this function will have inputs of all required fields that are dynamic and output the full
  **/
  //TODO replace data points for list page
  imageData(imageClass, imageBorder, mainImg, mainImgRoute, rank, rankClass, subImgClass, subImg?, subRoute?){
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
              imageUrl: '',
              urlRouteArray: '',
              hoverText: '',
              imageClass: ''
          },
          {
            text: "#"+rank,
            imageClass: rankClass+" image-round-upper-left image-round-sub-text"
          }
        ],
    };
    if(typeof subRoute != 'undefined'){
      image['subImages'] = [];
      image['subImages'] = [
          {
              imageUrl: subImg,
              urlRouteArray: subRoute,
              hoverText: "<i class='fa fa-mail-forward'></i>",
              imageClass: subImgClass + " image-round-lower-right"
          },
          {
              text: "#"+rank,
              imageClass: rankClass+" image-round-upper-left image-round-sub-text"
          }
      ];
    }
    return image;
  }

  //TODO replace data points for list page
  detailsData(mainP1,mainV1,mainUrl1,subP1,subV2,subUrl2, icon?, dataP3?,dataV3?,dataUrl3?){
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
        icon:icon,
      },
    ];
    return details;
  }


}
