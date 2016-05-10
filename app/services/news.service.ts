import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalFunctions} from '../global/global-functions';

@Injectable()
export class NewsService {
  private _apiUrl: string = 'http://newsapi.synapsys.us/news/?action=get_sports_news&q=';
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

  newsData(data){
    var self = this;
    var newsArray = [];
    var dummyImg = "./app/public/placeholder-location.jpg";
    data.forEach(function(val, index){
      console.log(val.link);
      var News = {
        title: val.title,
        description: val.description,
        lead_image: dummyImg, //TODO
        author: "Author", //TODO
        published: "Published Date",//TODO
        footerInfo: {
          infoDesc: 'Want to check out the full story?',
          text: 'READ THE ARTICLE',
          url: val.link
        }
      };
      newsArray.push(News);
    });
    console.log('TRANSFORMED NEWS ARRAY', newsArray);
    return newsArray;
  }//newsData ends
}
