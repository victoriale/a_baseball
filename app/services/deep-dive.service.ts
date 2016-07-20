import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalFunctions} from '../global/global-functions';
import {MLBGlobalFunctions} from '../global/mlb-global-functions';
import {GlobalSettings} from '../global/global-settings';

declare var moment;
@Injectable()
export class DeepDiveService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  private _trendingUrl: string = GlobalSettings.getTrendingUrl();
  // private _apiToken: string = 'BApA7KEfj';
  // private _headerName: string = 'X-SNT-TOKEN';

  constructor(public http: Http){
  }

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

  // console.log(callURL);
  return this.http.get(callURL, {headers: headers})
    .map(res => res.json())
    .map(data => {
      // transform the data to YYYY-MM-DD objects from unix
    //  console.log(data);
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
    console.log(callURL);
    return this.http.get(callURL, {headers: headers})
      .map(res => res.json())
      .map(data => {
        return data;
      });
  }
  transformToRecArticles(data){
    console.log(data);
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
    }


    //build to format expected by html
    var _return = new Array(2);
    for(var i = 0; i < _return.length;i++){_return[i] = [];}
    for(var i = 0; i < ret.length; i++){
      if(i < 3){_return[0].push(ret[i]);}
      if(i >= 3 && i < 6){_return[1].push(ret[i]);}
    }
    console.log(_return);
    return _return;
  }

}
