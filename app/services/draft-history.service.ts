import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalFunctions} from '../global/global-functions';
import {GlobalSettings} from '../global/global-settings';
import {SliderCarousel, SliderCarouselInput} from '../components/carousels/slider-carousel/slider-carousel.component';
import {CircleImageData} from '../components/images/image-data';
import {ListPageService} from './list-page.service';

@Injectable()
export class DraftHistoryService {
  private _apiUrl: string = GlobalSettings.getApiUrl();

  constructor(public http: Http){}

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      //headers.append(this.headerName, this.apiToken);
      return headers;
  }

  getDraftHistoryService(year, teamId, type?){
  //Configure HTTP Headers
  var headers = this.setToken();
  //for MLB season starts and ends in the same year so return current season
  //get past 5 years for tabs
  var tabDates = Number(year);
  var tabArray = [];
  var currentYear = '';
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
          if(data.data.length >1) data.data = data.data.slice(0,2);// the module should only have 2 data points displaying
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
        imageConfig: ListPageService.imageData("carousel", dummyImg, null, 1),
        description:[
          "<p style='font-size:20px'><b>Sorry, we currently do not have any data for this year's draft history</b><p>",
        ],
      };
      carouselArray.push(Carousel);
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
        var carouselItem = SliderCarousel.convertListItemToSliderCarouselItem(index, {
          isPageCarousel: false, 
          backgroundImage: GlobalSettings.getImageUrl(val.backgroundImage),
          profileNameLink: playerLinkText,
          description: ['Hometown: ', location],
          dataValue: val.selectionOverall + " Overall",
          dataLabel: "Draft Round " + val.selectionLevel,
          circleImageUrl: GlobalSettings.getImageUrl(val.imageUrl),
          circleImageRoute: playerRoute,
          rank: rank
        });
        if(type == 'page'){
          carouselItem.footerInfo = {
            infoDesc:'Interested in discovering more about this player?',
            text:'View Profile',
            url:playerRoute,
          }
        }
        carouselArray.push(carouselItem);
      });
    }
    // console.log('TRANSFORMED CAROUSEL', carouselArray);
    return carouselArray;
  }

  detailedData(data){
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
    return listDataArray;
  }//end of function
}
