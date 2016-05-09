import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Http} from 'angular2/http';

export interface DataItem {
  label: string;
  labelCont?: string;
  value: string;
}

export interface NewsData {
    title: string;
    pubDate_ut: number;
    link: string;
    description: string;
    tags: string;
}

@Injectable()
export class NewsService {
  private _apiUrl: string = 'http://newsapi.synapsys.us/news/?action=get_sports_news&q=';

  private _defaultData: NewsData = {
    title: "David Ortiz says his latest milestones are a sign he's 'getting old' - Boston.com",
    pubDate_ut: 1462541310,
    link: "https://bosoxinjection.com/2016/05/05/a-boston-red-sox-cinco-de-mayo/",
    description: "BoSox InjectionA Boston Red Sox Cinco de MayoBoSox InjectionThe Boston Red Sox will celebrate in one way or another the Mexican holiday called Cinco de Mayo that is now an adopted drinking and partying excuse in the United States. The Mexican holiday is in honor of a battle won against French forces in Mexico ...und weitere »",
    tags: "author"
  }

  constructor(public http: Http){}

  getNewsData(): Observable<NewsData> {
    let url = this._apiUrl + "Boston Red Sox";
    return this.http.get(url)
        .map(res => res.json())
        .map(data => data.data);
  }

  getDefaultData(): Observable<NewsData> {
    return Observable.of(this._defaultData);
  }
}
