import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {Conference, Division, MLBPageParameters} from '../global/global-interface';
import {GlobalSettings} from '../global/global-settings';
@Injectable()
export class NewsService {
  private _apiUrl: string = GlobalSettings.getNewsUrl();
  constructor(public http: Http){}

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

  newsData(data){
    var self = this;
    var newsArray = [];
    var dummyImg = "/app/public/no-image.png";
    var _getHostName = GlobalFunctions.getHostName;
    data.forEach(function(val, index){
      var News = {
        title: val.title,
        description: val.description,
        newsUrl: val.link,
        author: _getHostName(val.link) != null ? _getHostName(val.link) : 'Anonymous',
        published: GlobalFunctions.formatGlobalDate(val.pubDate_ut*1000,'dayOfWeek'),//convert unix time to readable
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
