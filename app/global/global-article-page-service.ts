import {Injectable, Injector} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router';
import {RouteParams, RouteConfig} from '@angular/router-deprecated';
import {HTTP_PROVIDERS, Http, Response, Headers} from "@angular/http";
import {GlobalFunctions} from './global-functions';
import {GlobalSettings} from "../global/global-settings";
import {Observable} from "rxjs/Observable";

@Injectable()

export class ArticleDataService {
    public partnerID:string;

    constructor(private _router:Router, public http:Http) {
        GlobalSettings.getPartnerId(_router, partnerId => {
            this.partnerID = partnerId;
        });
    };

    getArticleData(eventID, eventType) {
        var fullUrl = GlobalSettings.getArticleUrl();
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
        var fullUrl = GlobalSettings.getRecommendUrl();
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