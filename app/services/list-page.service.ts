import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {DetailListInput} from '../components/detailed-list-item/detailed-list-item.component';
import {MVPTabData} from '../components/mvp-list/mvp-list.component';
import {SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
import {CircleImageData, ImageData} from '../components/images/image-data';
import {Link} from '../global/global-interface';

declare var moment;

export class BaseballMVPTabData implements MVPTabData {
  tabDataKey: string;
  tabDisplayTitle: string;
  errorData: any = {
      data: "Sorry, we do not currently have any data for this mvp list",
      icon: "fa fa-remove"
  };
  listData: DetailListInput[] = null;
  isLoaded: boolean = false;
  profileType: string
  data: any;

  constructor(title: string, key: string, profileType: string) {
    this.profileType = profileType; //'page' carousel is slightly different from 'module' version
    this.tabDataKey = key;
    this.tabDisplayTitle = title;
  }

  getCarouselData(): Array<SliderCarouselInput> {
    return ListPageService.carDataPage(this.data, this.profileType);
  }
}

@Injectable()
export class ListPageService {
  private _apiUrl: string = GlobalSettings.getApiUrl();

  constructor(public http: Http) {}

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
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
          profHeader: ListPageService.profileHeader(data.data),
          carData: ListPageService.carDataPage(data.data, 'page'),
          listData: ListPageService.detailedData(data.data),
          pagination: data.data.listInfo,
          listDisplayName: data.data.listInfo.name
        }
      },
      err => {
        console.log('INVALID DATA');
      }
    )
  }

  //moduleType can be either 'pitcher' or 'batter' to generate the tabs list used to generate a static list for MVP module
  getMVPTabs(moduleType: string, profileType: string): Array<BaseballMVPTabData>{
    var tabArray: Array<BaseballMVPTabData> = [];
    //generate a static list of tab array based on the moduleType to emit the tabData and have a tabDisplay for the DOM
    if(moduleType == 'pitcher'){
      tabArray.push(new BaseballMVPTabData('W/L', 'pitcher-win-record', profileType));
      tabArray.push(new BaseballMVPTabData('Innings Pitched', 'pitcher-innings-pitched', profileType));
      tabArray.push(new BaseballMVPTabData('Strikeouts', 'pitcher-strikeouts', profileType));
      tabArray.push(new BaseballMVPTabData('ERA', 'pitcher-earned-run-average', profileType));
      tabArray.push(new BaseballMVPTabData('Hits', 'pitcher-hits-allowed', profileType));
    } else {//defaults to 'batter' if nothing is sent to moduleType
      tabArray.push(new BaseballMVPTabData('Home Runs', 'batter-home-runs', profileType));
      tabArray.push(new BaseballMVPTabData('Batting Avg.', 'batter-batting-average', profileType));
      tabArray.push(new BaseballMVPTabData('RBIs', 'batter-runs-batted-in', profileType));
      tabArray.push(new BaseballMVPTabData('Hits', 'batter-hits', profileType));
      tabArray.push(new BaseballMVPTabData('Walks', 'batter-bases-on-balls', profileType));
    }

    return tabArray;
  }

  //moduleType can be either 'pitcher' or 'batter' to generate the tabs list used to generate a static list for MVP module
  getListModuleService(tab: BaseballMVPTabData, query: Array<any>): Observable<BaseballMVPTabData> {
    //Configure HTTP Headers
    var headers = this.setToken();

    var callURL = this._apiUrl+'/list';

    for(var q in query){
      callURL += "/" + query[q];
    }
    // console.log("list module url: " + callURL);
    return this.http.get(callURL, {
        headers: headers
      })
      .map(res => res.json())
      .map(
        data => {
          data.data['query'] = query;//used in some functions below
          this.formatData(data.data.listInfo.stat, data.data.listData);
          tab.data = data.data;
          tab.isLoaded = true;
          tab.listData = ListPageService.detailedData(data.data);
          return tab;
        }
      );
  }

  formatData(key: string, data: Array<any>) {    
      data.forEach(item => {
        switch (key) {
          case 'pitcher-strikeouts':
          case "pitcher-innings-pitched":
          case 'pitcher-hits-allowed':
          case 'batter-home-runs':
              // format as integer
              var temp = Number(item.stat);
              item.stat = temp.toFixed(0); 
            break;

          case 'pitcher-earned-run-average':
              var temp = Number(item.stat);
              item.stat = temp.toFixed(2); // format as integer
              break;

          case 'batter-runs-batted-in':
          case 'batter-hits':
          case 'batter-batting-average':
          case 'batter-bases-on-balls':
              var temp = Number(item.stat);
              item.stat = temp.toFixed(3); // format as integer
              break;

          default: 
            //do nothing          
        }
      });
  }

  static profileHeader(data){
    var profile = data.listInfo;
    var profileData = {
      imageURL: GlobalSettings.getSiteLogoUrl(), //TODO
      text1: 'Last Updated: '+ GlobalFunctions.formatUpdatedDate(data.listData[0].lastUpdate),
      text2: 'United States',
      text3: profile.name,
      icon: 'fa fa-map-marker',
      hasHover : true,
    };
    return profileData;
  }

  //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
  static carDataPage(data, profileType: string){
    var carouselArray = [];
    var currentYear = new Date().getFullYear();//TODO FOR POSSIBLE past season stats but for now we have lists for current year season
    var carData = data.listData;
    var carInfo = data.listInfo;
    if(carData.length == 0){
      var dummyImg = "/app/public/no-image.png";
      var dummyRoute = ['Error-page'];
      var dummyRank = '##';
      carouselArray = [{// dummy data if empty array is sent back
        index:'2',
        imageConfig: ListPageService.imageData("carousel", dummyImg, dummyRoute, 1),
        description:[
          '<p style="font-size:20px"><span class="text-heavy">Sorry, we currently do not have any data for this particular list</span><p>',
        ],
      }];
    } else{
      //if data is coming through then run through the transforming function for the module
      carouselArray = carData.map(function(val, index){
        var carouselItem;
        var rank = ((Number(data.query.pageNum) - 1) * Number(data.query.limit)) + (index+1);
        var mainFontSize = (profileType == 'page' ? 24 : 22);
        val.listRank = rank;
        
        var teamNameLink = {
                     wrapperStyle: {},
                     beforeLink: "",
                     linkObj: MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId),
                     linkText: val.teamName,
                     afterLink: ""
                  };

        if(data.query.profile == 'team'){
          teamNameLink.wrapperStyle = {'font-size': mainFontSize + 'px', 'font-weight': '800', 'line-height': '1.4em'};
          carouselItem = {
            index:index,
            imageConfig: ListPageService.imageData("carousel",
              GlobalSettings.getImageUrl(val.teamLogo),
              MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId),
              val.listRank),
            description:[
              '<br>',
              teamNameLink,
              '<p><i class="fa fa-map-marker text-master"></i> '+val.teamCity +', '+val.teamState+'</p>',
              '<br>',
              '<p style="font-size:24px; line-height:26px"><b>'+val.stat+'</b></p>',
              '<p style="font-size:16px"> '+ MLBGlobalFunctions.formatStatName(carInfo.stat)+' for '+ currentYear +'</p>',
            ],
          };
          if(profileType == 'page'){
            carouselItem['footerInfo'] = {
              infoDesc:'Interested in discovering more about this team?',
              text:'View Profile',
              url:MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId),
            }
          }
        }else if(data.query.profile == 'player'){
          var position = '';
          position = val.position.join(", ");

          var playerNameLink = {
                      wrapperStyle: {'font-size': mainFontSize + 'px', 'font-weight': '800', 'line-height': '1.4em'},
                      beforeLink: "",
                      linkObj: MLBGlobalFunctions.formatPlayerRoute(val.teamName,val.playerName,val.playerId.toString()),
                      linkText: val.playerName,
                      afterLink: ""
                    };

          var playerFullName = val.playerFirstName + " " + val.playerLastName;
          carouselItem = {
            index:index,
            imageConfig: ListPageService.imageData("carousel",
              GlobalSettings.getImageUrl(val.imageUrl),
              MLBGlobalFunctions.formatPlayerRoute(val.teamName, playerFullName, val.playerId),
              val.listRank,
              GlobalSettings.getImageUrl(val.teamLogo),
              MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId)),
            description:[
              '<br>',
              playerNameLink,
              '<br>',
              teamNameLink,
              '<span class="separator">|</span> Jersey: #'+val.uniformNumber+' <span class="separator">|</span> '+position+'</p>',
              '<br>',
              '<p style="font-size:24px; line-height:26px"><span class="text-heavy">'+val.stat+'</span></p>',
              '<p style="font-size:16px"> '+ MLBGlobalFunctions.formatStatName(carInfo.stat) +' for '+ currentYear+'</p>',
            ],
          };
          if(profileType == 'page'){
            carouselItem['footerInfo'] = {
              infoDesc:'Interested in discovering more about this player?',
              text:'View Profile',
              url:MLBGlobalFunctions.formatPlayerRoute(val.teamName, playerFullName, val.playerId),
            }
          }
        }
        return carouselItem;
      });
    }
    // console.log('TRANSFORMED CAROUSEL', carouselArray);
    return carouselArray;
  }

  static detailedData(data): DetailListInput[]{//TODO replace data points for list page
    let self = this;

    var dummyImg = "/app/public/no-image.png";
    var dummyRoute = ['Disclaimer-page'];
    var dummyRank = '#4';

    var dummyProfile = "[Profile Name]";
    var dummyProfVal = "[Data Value 1]";
    var dummyProfUrl = ['Disclaimer-page'];
    var dummySubData = "[Data Value]: [City], [ST]";
    var dummySubDesc = "[Data Description]";
    var dummySubUrl = ['Disclaimer-page'];

    var currentYear = new Date().getFullYear();//TODO FOR POSSIBLE past season stats but for now we have lists for current year season

    var detailData = data.listData;
    var detailInfo = data.listInfo;
    return detailData.map(function(val, index){
      var teamRoute = MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId);
      var teamLocation = val.teamCity + ", " + val.teamState;
      var statDescription = MLBGlobalFunctions.formatStatName(detailInfo.stat) + ' for ' + currentYear;
      var rank = ((Number(data.query.pageNum) - 1) * Number(data.query.limit)) + (index+1);
      val.listRank = rank;
      if(data.query.profile == 'team'){
        var divisionName = MLBGlobalFunctions.formatShortNameDivison(val.conferenceName) + val.divisionName.charAt(0).toUpperCase();
        return {
          dataPoints: ListPageService.detailsData(
            [ //main left text
              {route: teamRoute, text: val.teamName, class: "dataBox-mainLink"}
            ],
            val.stat,
            [ //sub left text
              {text: teamLocation},
              {text: "|", class: "separator"},
              {text: "Division: " + divisionName},
            ],
            statDescription,
            'fa fa-map-marker'),
          imageConfig: ListPageService.imageData("list", GlobalSettings.getImageUrl(val.teamLogo), teamRoute, val.listRank),
          hasCTA:true,
          ctaDesc:'Want more info about this team?',
          ctaBtn:'',
          ctaText:'View Profile',
          ctaUrl:teamRoute
        };
      }else if(data.query.profile == 'player'){
        var playerFullName = val.playerFirstName + " " + val.playerLastName;
        var playerRoute = MLBGlobalFunctions.formatPlayerRoute(val.teamName, playerFullName, val.playerId);
        var position = val.position.join(", ");
        return {
          dataPoints: ListPageService.detailsData(
            [ //main left text
              {route: playerRoute, text: playerFullName, class: "dataBox-mainLink"}
            ],
            val.stat,
            [ //sub left text
              {route: teamRoute, text: val.teamName, class: "dataBox-subLink"},
              {text: "|", class: "separator"},
              {text: "Jersey: #" + val.uniformNumber},
              {text: "|", class: "separator"},
              {text: position},
            ],
            statDescription,
            null),           
            imageConfig: ListPageService.imageData("list",GlobalSettings.getImageUrl(val.imageUrl),playerRoute, val.listRank,
                                                    GlobalSettings.getImageUrl(val.teamLogo),teamRoute),
          hasCTA:true,
          ctaDesc:'Want more info about this player?',
          ctaBtn:'',
          ctaText:'View Profile',
          ctaUrl: playerRoute
        };
      }
    });
  }//end of function

  /**
   *this function will have inputs of all required fields that are dynamic and output the full
  **/
  static imageData(imageType: string, mainImgUrl: string, mainImgRoute: Array<any>, rank: number, subImgUrl?: string, subImgRoute?: Array<any>): CircleImageData {
    var borderClass, mainImageClass, subImageClass, rankClass;
    if ( imageType == "carousel" ) {
      mainImageClass = "image-150";
      borderClass = "border-large";
      rankClass = "image-48-rank";
      subImageClass = "image-50-sub";
    }
    else {
      mainImageClass = "image-121";
      borderClass = "border-2";
      rankClass = "image-38-rank";
      subImageClass = "image-40-sub";
    }
    if(!mainImgUrl || mainImgUrl == ''){
      mainImgUrl = "/app/public/no-image.png";
    }
    if(!rank){
      rank = 0;
    }
    //Add rank image
    var subImages: ImageData[] = [{
      text: "#" + rank,
      imageClass: rankClass + " image-round-upper-left image-round-sub-text"
    }];
    if ( subImgRoute ) {
      //Add sub image if route exists.
      if(!subImgUrl || subImgUrl == ''){
        subImgUrl = "/app/public/no-image.png";
      }
      subImages.push({
          imageUrl: subImgUrl,
          urlRouteArray: subImgRoute,
          hoverText: "<i class='fa fa-mail-forward'></i>",
          imageClass: subImageClass + ' image-round-lower-right'
      });
    }

    return {
        imageClass: mainImageClass,
        mainImage: {
            imageUrl: mainImgUrl,
            urlRouteArray: mainImgRoute,
            hoverText: "<p>View</p><p>Profile</p>",
            imageClass: borderClass,
        },
        subImages: subImages,
    };
  }

  static detailsData(mainLeftText: Link[], mainRightValue: string, 
                     subLeftText: Link[], subRightValue: string, subIcon?: string, 
                     dataLeftText?: Link[], dataRightValue?: string) {

    if(!dataLeftText) {
      dataLeftText = [];
    }
    if(dataRightValue == null){
      dataRightValue = '';
    }

    var details = [
      {
        style:'detail-small',
        leftText: dataLeftText,
        rightText:[{text: dataRightValue}]
      },
      {
        style:'detail-large',
        leftText: mainLeftText,
        rightText:[{text: mainRightValue}]
      },
      {
        style:'detail-medium',
        leftText: subLeftText,
        rightText:[{text: subRightValue}],
        icon:subIcon,
      },
    ];
    return details;
  }

}
