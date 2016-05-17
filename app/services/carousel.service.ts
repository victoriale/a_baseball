import {Injectable, Injector} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, RouteParams } from 'angular2/router';
import {HTTP_PROVIDERS, Http, Response, Headers} from "angular2/http";
import {GlobalSettings} from "../global/global-settings";
import {Observable} from "rxjs/Observable";

@Injectable()

export class ImagesService {
    public partnerID:string;

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

    getImages(profileId, profileType) {
        if (profileType == 'team') {
            var baseUrl = GlobalSettings.getCarouselTeamUrl();
        } else if (profileType == 'player') {
            var baseUrl = GlobalSettings.getCarouselPlayerUrl();
        } else {
            var baseUrl = GlobalSettings.getCarouselLeagueUrl();
        }
        var fullUrl;
        if (profileId != 'undefined') {
            fullUrl = baseUrl + profileId;
        }
        if (profileType == 'league') {
            fullUrl = baseUrl;
        }
        if (this.partnerID == null) {
            return this.http.get(fullUrl)
                .map(
                    res => res.json()
                )
                .map(
                    data => {
                        return data
                    }
                )
        } else {
            return this.http.get(fullUrl)
                .map(
                    res => res.json()
                )
                .map(
                    data => {
                        return data
                    }
                )
        }
    }
}