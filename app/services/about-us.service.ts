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
    content: Array<string>;
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
    let teamProfiles = this._globalFunctions.commaSeparateNumber(data.teamProfilesCount);
    let playerProfiles = this._globalFunctions.commaSeparateNumber(data.playerProfilesCount);
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
          dataText: teamProfiles
        },
        {
          iconUrl: '/app/public/aboutUs_logo2.png',
          titleText: 'MLB Divisions',
          dataText: this._globalFunctions.commaSeparateNumber(data.divisionsCount)
        },
        {
          iconUrl: '/app/public/aboutUs_logo3.png',
          titleText: 'MLB Player Profiles',
          dataText: playerProfiles
        },
        {
          iconUrl: data.worldChampImageUrl,
          titleText: data.worldChampYear + ' World Series Champions',
          dataText: data.worldChampName
        }
      ],
      content: [
        
        "We created Wichita, Kan. -based Home Run Loyal in [June, 2016] to connect baseball fans with insightful, well-informed and up-to-date content.",
         
        "Here at Home Run Loyal, we have an appetite for digesting down big data in the world of baseball. " + 
        "We create unique content so you can learn everything about your favorite team or player." +
        "From rookie players and underachieving teams to veteran stars and perennial favorites, " + 
        "Home Run Loyal produces content and statistical information for " + teamProfiles + " MLB teams and over " + playerProfiles + " player profiles."
      ]
    };
    
    return model;
  }
}