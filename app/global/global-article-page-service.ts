import {Injectable} from 'angular2/core';
import {Http} from "angular2/http";
import {GlobalSettings} from "../global/global-settings";

@Injectable()

export class ArticleDataService {

    constructor(public http:Http) {}

    getArticleData(eventID, eventType) {
        var fullUrl = GlobalSettings.getArticleUrl();
        return this.http.get(fullUrl + eventType + '/' + eventID)
            .map(res => res.json())
            .map(data => data);
    }

    getRecommendationsData(eventID) {
        var fullUrl = GlobalSettings.getRecommendUrl();
        return this.http.get(fullUrl + eventID)
            .map(res => res.json())
            .map(data => data);
    }
}