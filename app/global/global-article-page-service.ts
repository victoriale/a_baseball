import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {GlobalSettings} from "../global/global-settings";

@Injectable()

export class ArticleDataService {

    constructor(public http:Http) {}

    getArticleData(eventID, eventType, partnerId) {
        var fullUrl = GlobalSettings.getArticleUrl();
        //having the query string is only temporary until the partner site link issue is figured out.
        console.log(fullUrl + eventType + '/' + eventID + "?partnerId=" + partnerId);
        return this.http.get(fullUrl + eventType + '/' + eventID + "?partnerId=" + partnerId)
            .map(res => res.json())
            .map(data => data);
    }

    getRecommendationsData(eventID) {
        var fullUrl = GlobalSettings.getRecommendUrl();
        return this.http.get(fullUrl + eventID)
            .map(res => res.json())
            .map(data => data);
    }

    getTrendingData() {
        var fullUrl = GlobalSettings.getTrendingUrl();
        return this.http.get(fullUrl)
            .map(res => res.json())
            .map(data => data);
    }
}
