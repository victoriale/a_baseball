import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';

import {TitleInputData} from "../components/title/title.component";
import {GlobalFunctions} from "../global/global-functions";

export interface AuBlockData {
  iconUrl:string;
  titleText:string;
  dataText:string;
}

export interface AboutUsInterface {
    teamProfilesCount: number;
    divisionsCount: number;
    playerProfilesCount: number;
    worldChampName: string;
    worldChampYear: string;
    worldChampImageUrl: string;
    lastUpdatedDate: Date; //TODO-CJP: Needed in API
}

export interface AboutUsModel {
    blocks: Array<AuBlockData>;
    headerTitle: string;
    titleData: TitleInputData;
}

@Injectable()
export class AboutUsService {
  private _apiUrl: string = 'http://dev-homerunloyal-api.synapsys.us/landingPage';
  
  constructor(public http: Http, private _globalFunctions: GlobalFunctions){}

  getData(partnerID: string): Observable<AboutUsModel> {
    let url = this._apiUrl + '/aboutUs';
    return this.http.get(url)
        .map(res => res.json())
        .map(data => this.formatData(data.data, partnerID));
  }
  
  private formatData(data: AboutUsInterface, partnerID: string): AboutUsModel {
    let pageName = (partnerID === null)
            ? "Home Run Loyal" 
            : "My Home Run Loyal";
    let lastUpdatedDate = data.lastUpdatedDate !== undefined ? data.lastUpdatedDate : new Date(); //TODO-CJP: update when included in API
    let model: AboutUsModel = {
      headerTitle: "What is " + pageName + "?",
      titleData: {
          imageURL : '/app/public/mainLogo.png',
          text1: 'Last Updated: ' + this._globalFunctions.formatUpdatedDate(lastUpdatedDate),
          text2: 'United States',
          text3: "Want to learn more about " + pageName + "?",
          text4: '',
          icon: 'fa fa-map-marker'
      },
      blocks: [
        {
          iconUrl: '/app/public/aboutUs_logo1.png',
          titleText: 'MLB Team Profiles',
          dataText: this._globalFunctions.commaSeparateNumber(data.teamProfilesCount)
        },
        {
          iconUrl: '/app/public/aboutUs_logo2.png',
          titleText: 'MLB Divisions',
          dataText: this._globalFunctions.commaSeparateNumber(data.divisionsCount)
        },
        {
          iconUrl: '/app/public/aboutUs_logo3.png',
          titleText: 'MLB Player Profiles',
          dataText: this._globalFunctions.commaSeparateNumber(data.playerProfilesCount)
        },
        {
          iconUrl: data.worldChampImageUrl,
          titleText: data.worldChampYear + ' World Series Champions',
          dataText: data.worldChampName
        }
      ]
    };
    
    return model;
  }
}