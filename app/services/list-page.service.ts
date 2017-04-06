import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {DetailListInput} from '../components/detailed-list-item/detailed-list-item.component';
import {MVPTabData} from '../components/mvp-list/mvp-list.component';
import {SliderCarousel, SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
import {CircleImageData, ImageData} from '../components/images/image-data';
import {Link} from '../global/global-interface';
import {TitleInputData} from '../components/title/title.component';


interface PlayerItem {
    teamName: string,
    teamId: string,
    conferenceName: string,
    divisionName: string,
    stat: string,
    rank: string,
    playerId: string,
    playerName: string,
    playerFirstName: string,
    playerLastName: string,
    imageUrl: string,
    uniformNumber: string,
    position: string[],
    pitchWins: string,
    pitchLosses: string,
    teamState: string,
    teamCity: string,
    teamFirstName: string,
    teamLastName: string,
    teamVenue: string,
    teamLogo: string,
    lastUpdated: string,
    backgroundImage: string
}

interface ListData {
  listInfo: any;
  listData: Array<PlayerItem>;
  query: any;
}

export class BaseballMVPTabData implements MVPTabData {
  tabDataKey: string;
  tabDisplayTitle: string;
  errorData: any = {
      data: "Sorry, we do not currently have any data for this MVP list",
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
    return ListPageService.carDataPage(this.data, this.profileType, this.errorData.data);
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
  getListPageService(query, errorMessage: string,seasonBase?:string){
  //Configure HTTP Headers
  var headers = this.setToken();

  var callURL = this._apiUrl+'/list';
  for(var q in query){
    callURL += "/" + query[q];
  }
  return this.http.get( callURL, {headers: headers})
    .map(res => res.json())
    .map(
      data => {
        data.data['query'] = query;
        this.formatData(data.data.listInfo.stat, data.data.listData);
        return {
          profHeader: ListPageService.profileHeader(data.data),
          carData: ListPageService.carDataPage(data.data, 'page', errorMessage),
          listData: ListPageService.detailedData(data.data,seasonBase),
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
      tabArray.push(new BaseballMVPTabData('OBP', 'batter-on-base-percentage', profileType));
    }

    return tabArray;
  }

  //moduleType can be either 'pitcher' or 'batter' to generate the tabs list used to generate a static list for MVP module
  getListModuleService(tab: BaseballMVPTabData, query: Array<any>,seasonBase?:string): Observable<BaseballMVPTabData> {
    //Configure HTTP Headers
    var headers = this.setToken();
    var callURL = this._apiUrl+'/list';
    var apiYear;
    if(seasonBase == null || typeof seasonBase == 'undefined') {
      apiYear = new Date().getFullYear;
    } else {
      switch(seasonBase['curr_season']){
        case 0:
          apiYear = Number(seasonBase['season_id']) - 1
          break;
        case 1:
          apiYear = seasonBase['season_id'];
          break;
        case 3:
          apiYear = seasonBase['season_id'];
          break;
      }
    }

    for(var q in query){
      callURL += "/" + query[q];
    }
    // console.log("list module url: " + callURL);
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(
        data => {
          data.data['query'] = query;//used in some functions below
          this.formatData(data.data.listInfo.stat, data.data.listData);
          tab.data = data.data;
          tab.isLoaded = true;
          tab.listData = ListPageService.detailedData(data.data,apiYear);
          return tab;
        }
      );
  }

  formatData(key: string, data: Array<PlayerItem>) {
      data.forEach(item => {
        switch (key) {
          case 'pitcher-strikeouts':
          case "pitcher-innings-pitched":
          case 'pitcher-hits-allowed':
          case 'batter-bases-on-balls':
          case 'batter-home-runs':
          case 'batter-runs-batted-in':
          case 'batter-hits':
              // format as integer
              var temp = Number(item.stat);
              item.stat = temp.toFixed(0);
            break;

          case 'pitcher-earned-run-average':
              var temp = Number(item.stat);
              item.stat = temp.toFixed(2); // format as integer
              break;
          case 'batter-on-base-percentage':
          case 'batter-batting-average':
              var temp = Number(item.stat);
              item.stat = temp.toFixed(3); // format as integer
              break;

          default:
            //do nothing
        }
      });
  }

  static profileHeader(data): TitleInputData {
    var profile = data.listInfo;
    return {
      imageURL: GlobalSettings.getSiteLogoUrl(), //TODO
      imageRoute: ["Home-page"],
      text1: 'Last Updated: '+ GlobalFunctions.formatUpdatedDate(data.listData[0].lastUpdate),
      text2: 'United States ' + '| <p class="data-by-text">Data Provided By: ' + '<b>' + GlobalSettings.getDataProvidedBy() + '</b></p>',
      text3: profile.name,
      icon: 'fa fa-map-marker'
    };
  }

  //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
  static carDataPage(data: ListData, profileType: string, errorMessage: string){
    var carouselArray = [];
    var currentYear = data.listInfo.season//TODO FOR POSSIBLE past season stats but for now we have lists for current year season
    var carData = data.listData;
    var carInfo = data.listInfo;
    if(carData.length == 0){
      carouselArray.push(SliderCarousel.convertToEmptyCarousel(errorMessage));
    } else{
      //if data is coming through then run through the transforming function for the module
      carouselArray = carData.map(function(val, index){
        var carouselItem;
        var rank = ((Number(data.query.pageNum) - 1) * Number(data.query.limit)) + (index+1);
        val.rank = rank.toString();

        var teamRoute = MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId);
        var teamLinkText = {
          route: teamRoute,
          text: val.teamName
        };

        var ctaDesc: string;
        var primaryRoute: Array<any>;
        var primaryImage: string;
        var profileLinkText: Link;
        var description: Array<Link | string>;

        if(data.query.profile == 'team') {
          ctaDesc = 'Interested in discovering more about this team?';
          primaryRoute = teamRoute;
          primaryImage = GlobalSettings.getImageUrl(val.teamLogo, GlobalSettings._imgLgLogo);

          profileLinkText = teamLinkText;

          description = ['<i class="fa fa-map-marker text-master"></i>', val.teamCity + ', ' + val.teamState];
        } else { //if profile == 'player'
          ctaDesc = 'Interested in discovering more about this player?';
          primaryRoute = MLBGlobalFunctions.formatPlayerRoute(val.teamName,val.playerName,val.playerId.toString());
          primaryImage = GlobalSettings.getImageUrl(val.imageUrl, GlobalSettings._imgLgLogo);

          profileLinkText = {
            route: primaryRoute,
            text: val.playerName
          };

          var position = val.position.join(", ");
          description = [
            teamLinkText,
            '<span class="separator">   |   </span> ',
            'Jersey: #'+val.uniformNumber,
            ' <span class="separator">   |   </span> ',
            position
          ];
        }

        carouselItem = SliderCarousel.convertToCarouselItemType2(index, {
          isPageCarousel: profileType == 'page',
          backgroundImage: GlobalSettings.getBackgroundImageUrl(val.backgroundImage, GlobalSettings._imgProfileMod),
          copyrightInfo: GlobalSettings.getCopyrightInfo(),
          profileNameLink: profileLinkText,
          description: description,
          dataValue: val.stat,
          dataLabel: MLBGlobalFunctions.formatStatName(carInfo.stat)+' for '+ currentYear,
          circleImageUrl: primaryImage,
          circleImageRoute: primaryRoute,
          rank: val.rank
        });
        return carouselItem;
      });
    }
    // console.log('TRANSFORMED CAROUSEL', carouselArray);
    return carouselArray;
  }

  static detailedData(data,seasonBase?:string): DetailListInput[]{//TODO replace data points for list page
    let self = this;
    var currentYear = data.listInfo.season;
    //var currentYear = Number(seasonBase);//TODO FOR POSSIBLE past season stats but for now we have lists for current year season
    if(currentYear == null || typeof currentYear == 'undefined'){
      currentYear = new Date().getFullYear();
    }
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
              {text: "   |   ", class: "separator"},
              {text: "Division: " + divisionName},
            ],
            statDescription,
            'fa fa-map-marker'),
          imageConfig: ListPageService.imageData("list", GlobalSettings.getImageUrl(val.teamLogo, GlobalSettings._imgMdLogo), teamRoute, val.listRank),
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
              {text: "   |   ", class: "separator"},
              {text: "Jersey: #" + val.uniformNumber},
              {text: "   |   ", class: "separator"},
              {text: position},
            ],
            statDescription,
            null),
            imageConfig: ListPageService.imageData("list",GlobalSettings.getImageUrl(val.imageUrl, GlobalSettings._imgMdLogo),playerRoute, val.listRank, '', null),
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
    var dataRightText = []
    if(dataRightValue != null){
      dataRightText.push(dataRightValue);
    }

    var details = [
      {
        style:'detail-small',
        leftText: dataLeftText,
        rightText: dataRightText
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
