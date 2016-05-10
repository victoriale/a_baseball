import {Injectable, Injector} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, RouteParams } from 'angular2/router';
import {HTTP_PROVIDERS, Http, Response, Headers} from "angular2/http";
import {GlobalFunctions} from './global-functions';
import {Observable} from "rxjs/Observable";

@Injectable()

export class ArticleDataService {
    public partnerID:string;
    public protocolToUse:string = (location.protocol == "https:") ? "https" : "http";
    public articleUrl:string = '://dev-homerunloyal-ai.synapsys.us/';
    public recommendUrl:string = '://dev-homerunloyal-ai.synapsys.us/headlines/event/';

    constructor(private _router:Router, public http:Http) {
        this._router.root
            .subscribe(
                route => {
                    var curRoute = route;
                    var partnerID = curRoute.split('/');
                    if (partnerID[0] == '') {
                        this.partnerID = null;
                    } else {
                        this.partnerID = partnerID[0];
                    }
                }
            )//end of route subscribe
    };

    getArticleData(eventID, eventType) {
        var fullUrl = this.protocolToUse + this.articleUrl;
        if (this.partnerID == null) {
            return this.http.get(fullUrl + eventType + '/' + eventID)
                .map(
                    res => res.json()
                )
                .map(
                    data => {
                        return data;
                    }
                )
        } else {
            return this.http.get(fullUrl + eventType + '/' + eventID)
                .map(
                    res => res.json()
                )
                .map(
                    data => {
                        return data;
                    }
                )
        }
    }

    getRecommendationsData(eventID) {
        var fullUrl = this.protocolToUse + this.recommendUrl;
        if (this.partnerID == null) {
            return this.http.get(fullUrl + eventID)
                .map(
                    res => res.json()
                )
                .map(
                    data => {
                        return data;
                    }
                )
        } else {
            return this.http.get(fullUrl + eventID)
                .map(
                    res => res.json()
                )
                .map(
                    data => {
                        return data;
                    }
                )
        }
    }
}