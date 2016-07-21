import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';
import {DomSanitizationService} from '@angular/platform-browser';

declare var moment;
@Injectable()
export class DeepDiveService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  private _trendingUrl: string = GlobalSettings.getTrendingUrl();
  // private _apiToken: string = 'BApA7KEfj';
  // private _headerName: string = 'X-SNT-TOKEN';

  constructor(
    public http: Http,
    private _sanitizer: DomSanitizationService){}

  //Function to set custom headers
  setToken(){
      var headers = new Headers();
      //headers.append(this.headerName, this.apiToken);
      return headers;
  }

  getDeepDiveService(){//DATE
  //Configure HTTP Headers
  var headers = this.setToken();

  //date needs to be the date coming in AS EST and come back as UTC
  var callURL = this._apiUrl+'/'+ 'article/batch/2/25';
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      // transform the data to YYYY-MM-DD objects from unix
      return data;

    })
  }
  getDeepDiveArticleService(articleID){//DATE
  //Configure HTTP Headers
  var headers = this.setToken();
  //date needs to be the date coming in AS EST and come back as UTC
  var callURL = this._apiUrl+'/'+ 'article/' + articleID;
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      // transform the data to YYYY-MM-DD objects from unix
      return data;
    })
  }
  getDeepDiveVideoService(articleID){//DATE
  //Configure HTTP Headers
  var headers = this.setToken();
  //date needs to be the date coming in AS EST and come back as UTC
  var callURL = this._apiUrl+'/'+ 'article/video/batch/'+ articleID +'/1' ;
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      // transform the data to YYYY-MM-DD objects from unix
      return data;
    })
  }
  getDeepDiveBatchService(numItems){//DATE
  //Configure HTTP Headers
  var headers = this.setToken();
  //date needs to be the date coming in AS EST and come back as UTC
  var callURL = this._apiUrl+'/article'+ '/batch/2/'+numItems;
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      // transform the data to YYYY-MM-DD objects from unix
      return data;
    })
  }
  getdeepDiveData(deepDiveData, callback:Function, dataParam) {
  if(deepDiveData == null){
    deepDiveData = {};

  }else {
    }
  }

  getAiArticleData(){
    var headers = this.setToken();
    //this is the sidkeick url
    var callURL = this._trendingUrl;
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        return data;
      });
  }

  transformToBoxArticle(data){
    var boxArray = [];
    var sampleImage = "/app/public/placeholder_XL.png";
    data = data.data.slice(0,2);//TODO
    data.forEach(function(val, index){
      var Box = {
        keyword: val.keyword,
        date: GlobalFunctions.formatUpdatedDate(val.publishedDate),
        teaser: val.teaser,
        url: val.articleUrl != null ? val.articleUrl : '/',
        imageConfig:{
          imageClass: "image-288x180",
          mainImage:{
            imageUrl: val.imagePath != null ? GlobalSettings.getImageUrl(val.imagePath) : sampleImage
          }
        }
      }
      boxArray.push(Box);
    });
    return boxArray;
  }

  transformToRecArticles(data){
    var articleTypes = [];
    var articles = [];
    var images = [];

    for(var obj in data){
      if(obj == "meta-data")continue;
      articleTypes.push(obj);
      articles.push(data[obj]);
    }

    //set up the images array
    for(var obj in data['meta-data']['images']){
      for(var i = 0; i < data['meta-data']['images'][obj].length; i++){
        images.push(data['meta-data']['images'][obj][i]);
      }
    }

    // to mix up the images
    function shuffle(a) {
      var j, x, i;
      for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
      }
    }
    shuffle(images);

    var ret = [];
    for(var i = 0; i < articles.length; i++){
      ret[i] = articles[i];
      ret[i]['type'] = articleTypes[i];
      ret[i]['image'] = images[i];
      ret[i]['bg_image_var'] = this._sanitizer.bypassSecurityTrustStyle("url(" + ret[i]['image'] + ")");
    }


    //build to format expected by html
    var _return = new Array(2);
    for(var i = 0; i < _return.length;i++){_return[i] = [];}
    for(var i = 0; i < ret.length; i++){
      if(i < 3){_return[0].push(ret[i]);}
      if(i >= 3 && i < 6){_return[1].push(ret[i]);}
    }
    return _return;
  }

}
