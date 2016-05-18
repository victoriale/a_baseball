import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from 'angular2/http';
import {GlobalSettings} from '../global/global-settings';

@Injectable()
export class DYKService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  constructor(public http: Http){}
  setToken(){
    var headers = new Headers();
    return headers;
  }
  getDYKService(){
    var headers = this.setToken();
    var fullUrl = this._apiUrl + "/league/didYouKnow";
    return this.http.get(fullUrl, {
      headers: headers
    })
    .map(
      res => res.json()
    )
    .map(
      data => {
        // console.log("service", data);
        return {
            data
        };
      }
    )
  }//getDYKService ends
}//DYKService ENDS
