import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {SliderCarousel, SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
import {CircleImageData} from '../components/images/image-data';
import {ListPageService} from './list-page.service';
import {IProfileData} from './profile-header.service';
import {DetailListInput} from '../components/detailed-list-item/detailed-list-item.component';

export interface DraftHistoryTab {
  tabTitle: string;
  tabKey: string;
  isLoaded: boolean;
  detailedDataArray: Array<DetailListInput>;
  carouselDataArray: Array<SliderCarouselInput>;
  errorMessage: string;
}

export interface DraftHistoryData {
  detailedDataArray: Array<DetailListInput>;
  carouselDataArray: Array<SliderCarouselInput>;
}

@Injectable() 
export class DraftHistoryService {

  getDraftHistoryTabs(profileData: IProfileData): DraftHistoryTab[] {
    // console.log("interface - getDraftHistoryTabs")
    return [];
  }
  
  getDraftHistoryService(profileData: IProfileData, tab: DraftHistoryTab, type: string): Observable<DraftHistoryData> {
    // console.log("interface - getDraftHistoryService")
    return null;
  }

}

@Injectable()
export class MLBDraftHistoryService extends DraftHistoryService {
  private _apiUrl: string = GlobalSettings.getApiUrl();

  constructor(public http: Http){
    super();
  }

  getDraftHistoryTabs(profileData: IProfileData): DraftHistoryTab[] {
    // console.log("concrete - getDraftHistoryTabs")

    let profilePageDesc = (profileData.profileType == "team" ? "the " + profileData.profileName + " do" : profileData.profileName + " does");
    let errorPrefix = "Sorry, " + profilePageDesc + " not currently have any draft history data for the ";

    //for MLB season starts and ends in the same year so return current season
    //get past 5 years for tabs
    var currentYear = new Date().getFullYear();
    var year = currentYear;
    var tabArray = [];
    for(var i = 0; i <5; i++) {
      tabArray.push({
        tabTitle: i == 0 ? 'Current Season' : year.toString(),
        tabKey: year.toString(),
        isLoaded: false,
        errorMessage: errorPrefix + year + " season."
      });
      year--;
    }
    return tabArray;
  }

/**
 * @param {string} type - 'page' or 'module'
 */
  getDraftHistoryService(profileData: IProfileData, tab: DraftHistoryTab, type: string): Observable<DraftHistoryData> {
    // console.log("concrete - getDraftHistoryService");
    
    let year = tab.tabKey;

    var callURL;
    if ( profileData.profileType == "team" ) {
      callURL = this._apiUrl + '/team/draftHistory/'+profileData.profileId+'/'+year;
    }
    else {
      //http://dev-homerunloyal-api.synapsys.us/league/draftHistory/2016
      callURL = this._apiUrl + '/league/draftHistory/'+ year;
    }
    // console.log(callURL);

    return this.http.get(callURL)
    .map(res => res.json())
    .map(data => {
        if(type == 'module'){
          if(data.data.length > 1) {
            // the module should only have 2 data points displaying
            data.data = data.data.slice(0,2);
          } 
        }
        return {
          carouselDataArray: this.carDraftHistory(data.data, tab.errorMessage, type),
          detailedDataArray: this.detailedData(data.data),
        };
      });
  }

  //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
  //FOR THE PAGE
  private carDraftHistory(data, errorMessage: string, type){
    let self = this;
    var carouselArray = [];
    var dummyImg = "/app/public/no-image.png";
    if(data.length == 0){//if no data is being returned then show proper Error Message in carousel
      carouselArray.push(SliderCarousel.convertToEmptyCarousel(errorMessage));
    }else{
      //if data is coming through then run through the transforming function for the module
      data.forEach(function(val, index){
        var playerFullName = val.playerFirstName + " " + val.playerLastName;

        var playerRoute = MLBGlobalFunctions.formatPlayerRoute(val.draftTeamName, playerFullName, val.personId);
        var playerLinkText = {
          route: playerRoute,
          text: playerFullName
        };

        var rank = (index+1).toString();
        var location = GlobalFunctions.toTitleCase(val.city) + ', ' + GlobalFunctions.stateToAP(val.area);
        var carouselItem = SliderCarousel.convertToCarouselItemType2(index, {
          isPageCarousel: false, 
          backgroundImage: GlobalSettings.getBackgroundImageUrl(val.backgroundImage),
          copyrightInfo: GlobalSettings.getCopyrightInfo(),
          profileNameLink: playerLinkText,
          description: ['Hometown: ', location],
          dataValue: val.selectionOverall + " Overall",
          dataLabel: "Draft Round " + val.selectionLevel,
          circleImageUrl: GlobalSettings.getImageUrl(val.imageUrl),
          circleImageRoute: playerRoute,
          rank: rank
        });
        // if(type == 'page'){ //removed from spec
        //   carouselItem.footerInfo = {
        //     infoDesc:'Interested in discovering more about this player?',
        //     text:'View Profile',
        //     url:playerRoute,
        //   }
        // }
        carouselArray.push(carouselItem);
      });
    }
    // console.log('TRANSFORMED CAROUSEL', carouselArray);
    return carouselArray;
  }

  private detailedData(data){
    var listDataArray = data.map(function(val, index){
      var playerFullName = val.playerFirstName + " " + val.playerLastName;
      var location = GlobalFunctions.toTitleCase(val.city) + ', ' + GlobalFunctions.stateToAP(val.area);
      var rank = (index+1);

      var playerRoute = MLBGlobalFunctions.formatPlayerRoute(val.draftTeamName, playerFullName, val.personId);
      var teamRoute = MLBGlobalFunctions.formatTeamRoute(val.draftTeamName, val.draftTeam);   

      var listData = {
        dataPoints: ListPageService.detailsData(
          [//main left text
            { route: playerRoute, text: playerFullName, class: "dataBox-mainLink" }
          ],
          val.selectionOverall+' Overall',
          [//sub left text
            {text: "Hometown: " + location}
          ],
          'Draft Round '+val.selectionLevel,
          'fa fa-map-marker'),
        imageConfig: ListPageService.imageData("list", GlobalSettings.getImageUrl(val.imageUrl), playerRoute, rank),
        hasCTA:true,
        ctaDesc:'Want more info about this player?',
        ctaBtn:'',
        ctaText:'View Profile',
        ctaUrl: playerRoute
      };
      return listData;
    });
    // console.log('TRANSFORMED List Data', listDataArray);
    return listDataArray.length > 0 ? listDataArray : null;
  }//end of function
}
