import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';
import {Conference, Division, MLBPageParameters} from '../global/global-interface';
import {GlobalSettings} from '../global/global-settings';
declare var moment: any;
@Injectable()
export class NewsService {
  private _apiUrl: string = GlobalSettings.getNewsUrl();
  constructor(public http: Http, private _globalFunctions: GlobalFunctions){}

  setToken(){
    var headers = new Headers();
    return headers;
  }

  getNewsService(newsSubject){
    var headers = this.setToken();
    var fullUrl = this._apiUrl + "/news/?action=get_sports_news&q=";
    if(typeof newsSubject != "undefined"){
      fullUrl += newsSubject;
    }
    return this.http.get(fullUrl, {
      headers: headers
    })
    .map(
      res => res.json()
    )
    .map(
      data => {
        return {
          news: this.newsData(data)
        };
    })
  }//getNewsService ends

  private formatGroupName(conference: Conference, division: Division, makeDivisionBold?: boolean): string {
    if ( conference !== undefined && conference !== null ) {
      let leagueName = this._globalFunctions.toTitleCase(Conference[conference]) + " League";
      if ( division !== undefined && division !== null ) {
        var divisionName = this._globalFunctions.toTitleCase(Division[division]);
        return leagueName + " " + (makeDivisionBold ? "<span class='text-heavy'>" + divisionName + "</span>" : divisionName);
      }
      else {
        return leagueName;
      }
    }
    else {
      return "MLB";
    }
  }
  newsData(data){
    var self = this;
    var newsArray = [];
    var dummyImg = "/app/public/no-image.png";
    data.forEach(function(val, index){
      var News = {
        title: val.title,
        description: val.description,
        newsUrl: val.link,
        author: "Author", //TODO
        published: moment.unix(val.pubDate_ut).format('dddd MMMM Do, YYYY'),//convert unix time to readable
        footerData: {
          infoDesc: 'Want to check out the full story?',
          text: 'READ THE ARTICLE',
          url: val.link,
          hrefUrl: true
        }
      };
      newsArray.push(News);
    });
    return newsArray;
  }//newsData ends
}
