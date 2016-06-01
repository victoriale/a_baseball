import {Injectable, Injector} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router';
import {RouteParams} from '@angular/router-deprecated';
import {HTTP_PROVIDERS, Http, Response, Headers} from "@angular/http";
import {GlobalSettings} from "../global/global-settings";
import {Observable} from "rxjs/Observable";

@Injectable()

export class HeadlineDataService {
    public partnerID:string;

    constructor(private _router:Router, public http:Http) {
        GlobalSettings.getPartnerId(_router, partnerId => {
            this.partnerID = partnerId;
        });
    };

    getAiHeadlineData(teamID) {
        var fullUrl = GlobalSettings.getHeadlineUrl();
        if (this.partnerID == null) {
            return this.http.get(fullUrl + teamID)
                .map(
                    res => res.json()
                )
                .map(
                    data => {
                        return data;
                    }
                )
        } else {
            return this.http.get(fullUrl + teamID)
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