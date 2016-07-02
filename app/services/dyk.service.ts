import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Http, Headers} from '@angular/http';
import {GlobalSettings} from '../global/global-settings';

@Injectable()
export class DykService {
  private _apiUrl: string = GlobalSettings.getApiUrl();
  constructor(public http: Http){}
  setToken(){
    var headers = new Headers();
    return headers;
  }
  // getDykService(profile, id){
  getDykService(profile, id?){
    var headers = this.setToken();
    var fullUrl = this._apiUrl;
    //example URL: http://dev-homerunloyal-api.synapsys.us/player/didYouKnow/96703 
    fullUrl += "/"+profile+"/didYouKnow";
    if(id !== undefined){
      fullUrl += "/" + id;
    }
    return this.http.get( fullUrl, {
        headers: headers
      })
      .map(
        res => res.json()
      )
      .map(
        data => {
          return data.data;
        },
        err => {
          console.log('INVALID DATA');
        }
      )
  }//getDykService ends

}//DykService ENDS
