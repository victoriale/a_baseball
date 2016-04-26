import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';

export interface AboutUsInterface {
    teamProfilesCount: number;
    divisionsCount: number;
    playerProfilesCount: number;
    worldChampionName: string;
    worldChampionYear: string;
    worldChampionImageUrl: string;
}

@Injectable()
export class AboutUsService {
  private _apiUrl: string = 'http://api2.joyfulhome.com';
  private _defaultData: AboutUsInterface = {
    teamProfilesCount: 96,
    divisionsCount: 15,
    playerProfilesCount: 1512,
    worldChampionName: "Jayhawks",
    worldChampionYear: "2016",
    worldChampionImageUrl: "Jayhawks.png",
  }

  constructor(public http: Http){}

  getAboutUsData() {
    let url = this._apiUrl + '/aboutUs';
    return this.http.get(url)
        .map(res => res.json())
        .map(data => data.data);
  }
  
  getAboutUsDefaultData() {
    return Observable.of(this._defaultData);
  }
}