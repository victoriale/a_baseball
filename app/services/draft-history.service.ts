import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {SliderCarousel, SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
import {CircleImageData} from '../components/images/image-data';
import {ListPageService} from './list-page.service';
import {IProfileData} from './profile-header.service';
import {DetailListInput} from '../components/detailed-list-item/detailed-list-item.component';
import {PaginationParameters} from '../components/pagination-footer/pagination-footer.component';

export interface DraftHistoryTab {
  tabTitle: string;
  tabKey: string;
  isLoaded: boolean;
  detailedDataArray: Array<Array<DetailListInput>>;
  carouselDataArray: Array<Array<SliderCarouselInput>>;
  paginationDetails: PaginationParameters;
  errorMessage: string;
}

export interface DraftHistoryData {
  detailedDataArray: Array<Array<DetailListInput>>;
  carouselDataArray: Array<Array<SliderCarouselInput>>;
  paginationDetails: PaginationParameters;
}

export interface PlayerDraftData {
  playerId: string;
  playerFirstName: string;
  playerLastName: string;
  roleStatus: string;
  active: string;
  teamId: string;
  teamName: string;
  entryReason: string;
  selectionLevel: string;
  selectionOverall: string;
  startDate: string;
  city: string;
  area: string;
  country: string;
  backgroundImage: string;
  imageUrl: string;
}

@Injectable()
export class DraftHistoryService {

  getDraftHistoryTabs(profileData: IProfileData,seasonId?:string): DraftHistoryTab[] {
    // console.log("interface - getDraftHistoryTabs")
    return [];
  }

  getDraftHistoryService(profileData: IProfileData, tab: DraftHistoryTab, currIndex: number, type: string,seasonId?:string): Observable<DraftHistoryData> {
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

  getDraftHistoryTabs(profileData: IProfileData,seasonId?:string): DraftHistoryTab[] {
    // console.log("concrete - getDraftHistoryTabs")
    let errorMessage; // {0} is for the season name
    // if ( profileData.isLegit && year == currentYear ) {
      if ( profileData.profileType == "team" ) {
        //team names are plural, and should have a determative
        errorMessage = "Currently, there are no drafted players assigned to the " + GlobalFunctions.convertToPossessive(profileData.profileName) + " roster for the {0}.";
      }
      else {
        //otherwise it's MLB, which is singular and a proper name
        errorMessage = "Currently, there are no drafted players assigned to a team's roster for the {0}.";
      }
    // }
    // else {
    //   if ( profileData.profileType == "team" ) {
    //     //team names are plural, and should have a determative
    //     errorMessage = "Sorry, the " + profileData.profileName + " do not currently have any draft history data for the {0}.";
    //   }
    //   else {
    //     //otherwise it's MLB, which is singular and a proper name
    //     errorMessage = "Sorry, " + profileData.profileName + " does not currently have any draft history data for the {0}.";
    //   }
    // }

    //for MLB season starts and ends in the same year so return current season. Shows season year if season has ended
    //get past 5 years for tabs
    var currentYear;
    if(seasonId == null || typeof seasonId == 'undefined') {
      currentYear = new Date().getFullYear.toString();
    } else {
      switch(seasonId['curr_season']){
        case 0:
          currentYear = (Number(seasonId['season_id']) - 1).toString();
          break;
        case 1:
          currentYear = 'Current';
          break;
        case 2:
          currentYear = seasonId['season_id'];
          break;
      }
    }
    // if(seasonId == null || typeof seasonId == 'undefined' || seasonId == new Date().getFullYear().toString()){
    //   currentYear = new Date().getFullYear();
    // } else {
    //   currentYear = seasonId;
    // }

    var year = currentYear;
    var tabArray = [];
    for(var i = 0; i <5; i++) {
      var seasonName = year + " season";
      tabArray.push({
        tabTitle: i == 0 ? year : year.toString(),
        tabKey: year.toString(),
        isLoaded: false,
        errorMessage: errorMessage.replace("{0}", seasonName)
      });
      year--;
    }
    return tabArray;
  }

/**
 * @param {string} type - 'page' or 'module'
 */
  getDraftHistoryService(profileData: IProfileData, tab: DraftHistoryTab, currIndex: number, type: string,seasonId?:string): Observable<DraftHistoryData> {
    // console.log("concrete - getDraftHistoryService");
    let year = tab.tabKey;

    let itemsOnPage = 10;

    var callURL;
    if ( profileData.profileType == "team" ) {
      callURL = this._apiUrl + '/team/draftHistory/'+profileData.profileId+'/'+year;
    }
    else {
      //http://dev-homerunloyal-api.synapsys.us/league/draftHistory/2016
      callURL = this._apiUrl + '/league/draftHistory/'+ year;
    }

    return this.http.get(callURL)
    .map(res => res.json())
    .map(data => {
        if(type == 'module'){
          if(data.data.length > 1) {
            // the module should only have 2 data points displaying
            data.data = data.data.slice(0,2);
          }
        }
        var allCarouselItems = this.carDraftHistory(data.data, tab.errorMessage, type);
        var allDetailItems = this.detailedData(data.data);
        var totalPages = allDetailItems ? Math.ceil(allDetailItems.length / itemsOnPage) : 0;
        var draftData = {
          carouselDataArray: [],
          detailedDataArray: null, //detailedDataArray and paginationDetails should be null in case there are no items to display
          paginationDetails: null  // otherwise, the no-data tab doesn't show up correctly.
        };
        if ( totalPages > 0 ) { //paginate carousel and detail data
          draftData.detailedDataArray = [];
          if ( type == 'page' ) { //only include pagination for pages
            draftData.paginationDetails = {
              index: currIndex + 1, //currIndex is 0-based, but pagination needs 1-based
              max: totalPages,
              paginationType: 'module' //even if it's a page type, we want to use 'module' type pagination
            };
          }
          for ( var page = 0; page < totalPages; page++ ) {
            var start = page * itemsOnPage;
            var end = start + itemsOnPage;
            if ( end >= allDetailItems.length ) {
              end = allDetailItems.length;
            }
            draftData.carouselDataArray.push(allCarouselItems.slice(start, end));
            draftData.detailedDataArray.push(allDetailItems.slice(start, end));
          }
        } else { //otherwise just add default carousel item to array
          if ( totalPages == 0 && allCarouselItems.length == 1 ) {
            draftData.carouselDataArray.push(allCarouselItems);
          }
        }
        return draftData;
      });
  }

  //BELOW ARE TRANSFORMING FUNCTIONS to allow the modules to match their corresponding components
  //FOR THE PAGE
  private carDraftHistory(data: Array<PlayerDraftData>, errorMessage: string, type){
    let self = this;
    var carouselArray = [];
    var dummyImg = "/app/public/no-image.png";
    if(data.length == 0){//if no data is being returned then show proper Error Message in carousel
      carouselArray.push(SliderCarousel.convertToEmptyCarousel(errorMessage));
    }else{
      //if data is coming through then run through the transforming function for the module
      data.forEach(function(val, index){
        var playerFullName = val.playerFirstName + " " + val.playerLastName;

        var playerRoute = null;
        if ( val.active == "active" || (val.active == "injured" && !val.roleStatus) ) {
          playerRoute = MLBGlobalFunctions.formatPlayerRoute(val.teamName, playerFullName, val.playerId);
        }
        var playerLinkText = {
          route: playerRoute,
          text: playerFullName
        };

        var rank = (index+1).toString();
        var location;
        if (val.city == null || val.area == null){
          location = "N/A";
        }
        else {
        location = GlobalFunctions.toTitleCase(val.city) + ', ' + GlobalFunctions.stateToAP(val.area);
        }
        var carouselItem = SliderCarousel.convertToCarouselItemType2(index, {
          isPageCarousel: false,
          backgroundImage: GlobalSettings.getBackgroundImageUrl(val.backgroundImage, GlobalSettings._imgProfileMod),
          copyrightInfo: GlobalSettings.getCopyrightInfo(),
          profileNameLink: playerLinkText,
          description: ['<i class="fa fa-map-marker text-master"></i>', 'Hometown: ', location],
          dataValue: val.selectionOverall + " Overall",
          dataLabel: "Draft Round " + val.selectionLevel,
          circleImageUrl: GlobalSettings.getImageUrl(val.imageUrl, GlobalSettings._imgLgLogo),
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

  private detailedData(data: Array<PlayerDraftData>){
    var listDataArray = data.map(function(val, index){
      var playerFullName = val.playerFirstName + " " + val.playerLastName;
      if (val.city == null || val.area == null){
        location = "N/A";
      }
      else {
      var location = GlobalFunctions.toTitleCase(val.city) + ', ' + GlobalFunctions.stateToAP(val.area);
      }
      var rank = (index+1);

      var playerRoute = null;
      if ( val.active == "active" || (val.active == "injured" && !val.roleStatus) ) {
        playerRoute = MLBGlobalFunctions.formatPlayerRoute(val.teamName, playerFullName, val.playerId);
      }
      var teamRoute = MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId);

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
        imageConfig: ListPageService.imageData("list", GlobalSettings.getImageUrl(val.imageUrl, GlobalSettings._imgMdLogo), playerRoute, Number(val.selectionLevel)),
        hasCTA:true,
        ctaDesc: playerRoute ? 'Want more info about this player?' : 'This player is currently not active.',
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
