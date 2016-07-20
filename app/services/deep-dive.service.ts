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
      return data;

    })
  }
  getdeepDiveData() {
    return this.getDeepDiveService();
  }

  transformToRecArticles(data){
    data = data.data;
    for(var i = 0; i < data.length; i++){
      data[i]['image_url'] = GlobalSettings.getImageUrl(data[i]['imagePath']);
    }
    //build to format expected by html
    var ret = new Array(2);
    for(var i = 0; i < ret.length;i++){ret[i] = [];}
    for(var i = 0; i < data.length; i++){
      if(i < 3){ret[0].push(data[i]);}
      if(i >= 3 && i < 6){ret[1].push(data[i]);}
    }
    return ret;
  }

}
