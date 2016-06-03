import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {Gradient} from '../global/global-gradient';
import {CircleImageData} from '../components/images/image-data';

declare var moment;
@Injectable()
export class BoxScoresService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  // private _apiToken: string = 'BApA7KEfj';
  // private _headerName: string = 'X-SNT-TOKEN';

  constructor(public http: Http, private _globalFunc: GlobalFunctions){

  }

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      //headers.append(this.headerName, this.apiToken);
      return headers;
  }

  getBoxScoresService(profile, date, teamId?){
  //Configure HTTP Headers
  var headers = this.setToken();

  var callURL = this._apiUrl+'/'+profile+'/boxScores/2814/2016-05-23';

  console.log(callURL);
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      console.log(data.data);

      return {
        schedule: this.formatSchedule(data.data),
        fullData: data.data
      };
    })
  }

  transformBoxScores(boxScores){
    var newBoxScores = {};
    for(var dates in boxScores){
        var dayDate = dates.split(' ')[0];
        if(typeof newBoxScores[dayDate] == 'undefined'){
           newBoxScores[dayDate] = [];
           newBoxScores[dayDate].push(boxScores[dates]);
        }
    }
    console.log(newBoxScores);
    
  }

  formatSchedule(data){
    console.log(data);
    var home = {
      homeHex:"#FD5A1E",
      homeID:2819,
      homeLocation:"San Francisco",
      homeLogo:"https://prod-sports-images.synapsys.us/mlb/logos/team/MLB_San_Francisco_Giants_Logo.jpg",
      homeLosses:19,
      homeName:"Giants",
      homeWins:30
    };
    var away = {
      awayHex:"#C41E3A",
      awayID:2805,
      awayLocation:"St. Louis",
      awayLogo:"https://prod-sports-images.synapsys.us/mlb/logos/team/MLB_San_Francisco_Giants_Logo.jpg",
      awayLosses:19,
      awayName:"Giants",
      awayWins:30
    };

    return {
      home:home,
      away:away
    };
  }

  formatGameInfo(data){
    console.log(data);
    return data;
  }

  formatArticle(data){
    console.log(data);
    return data;
  }

  formatScoreBoard(data){
    console.log(data);
    return data;
  }

  /**
   *this function will have inputs of all required fields that are dynamic and output the full
  **/
  imageData(imageClass, imageBorder, mainImg, mainImgRoute, rank, rankClass, subImgClass, subImg?, subRoute?){
    if(typeof mainImg =='undefined' || mainImg == ''){
      mainImg = "/app/public/no-image.png";
    }
    if(typeof subImg =='undefined' || subImg == ''){
      subImg = "/app/public/no-image.png";
    }
    var image: CircleImageData = {//interface is found in image-data.ts
        imageClass: imageClass,
        mainImage: {
            imageUrl: mainImg,
            urlRouteArray: mainImgRoute,
            hoverText: "<p>View</p><p>Profile</p>",
            imageClass: imageBorder,
        },
        subImages: rank != null ? [
          {
            text: "#"+rank,
            imageClass: rankClass+ " image-round-upper-left image-round-sub-text"
          }
        ] : null,
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
              imageClass: rankClass+ " image-round-upper-left image-round-sub-text"
          }
      ];
    }
    return image;
  }
}
