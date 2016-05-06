import {Injectable, Injector} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, RouteParams } from 'angular2/router';
import {HTTP_PROVIDERS, Http, Response, Headers} from "angular2/http";
import {GlobalFunctions} from './global-functions';
import {Observable} from "rxjs/Observable";

@Injectable()

export class ArticleDataService {
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

    getAboutTheTeamsData(eventID) {
        if (this.partnerID == null) {
            return this.http.get('http://dev-homerunloyal-ai.synapsys.us/about-the-teams/' + eventID)
                .map(
                    res => res.json()
                )
                .map(
                    data => {
                        return data;
                    }
                )
        } else {
            return this.http.get('http://dev-homerunloyal-ai.synapsys.us/about-the-teams/' + eventID)
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

    getPostGameData(eventID) {
        if (this.partnerID == null) {
            return this.http.get('http://dev-homerunloyal-ai.synapsys.us/postgame-report/' + eventID)
                .map(
                    res => res.json()
                )
                .map(
                    data => {
                        return data;
                    }
                )
        } else {
            return this.http.get('http://dev-homerunloyal-ai.synapsys.us/postgame-report/' + eventID)
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

    getPreGameData(eventID) {
        if (this.partnerID == null) {
            return this.http.get('http://dev-homerunloyal-ai.synapsys.us/pregame-report/' + eventID)
                .map(
                    res => res.json()
                )
                .map(
                    data => {
                        return data;
                    }
                )
        } else {
            return this.http.get('http://dev-homerunloyal-ai.synapsys.us/pregame-report/' + eventID)
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
        if (this.partnerID == null) {
            return this.http.get('http://dev-homerunloyal-ai.synapsys.us/headlines/event/' + eventID)
                .map(
                    res => res.json()
                )
                .map(
                    data => {
                        return data;
                    }
                )
        } else {
            return this.http.get('http://dev-homerunloyal-ai.synapsys.us/headlines/event/' + eventID)
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