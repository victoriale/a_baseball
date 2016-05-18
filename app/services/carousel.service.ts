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

    getImages(profileType, profileId?) {
        var baseUrl = GlobalSettings.getApiUrl() + "/" + profileType.toLowerCase() + "/imagesAndMedia/";
        var fullUrl;
        if (profileId != 'undefined') {
            fullUrl = baseUrl + profileId;
        } else {
            fullUrl = baseUrl;
        }
        if (this.partnerID == null) {
            return this.http.get(fullUrl)
                .map(
                    res => res.json()
                )
                .map(
                    data => {
                        return this.getImageArray(data.data);
                    }
                )
        } else {
            return this.http.get(fullUrl)
                .map(
                    res => res.json()
                )
                .map(
                    data => {
                        return this.getImageArray(data.data);
                    }
                )
        }
    }

    getImageArray(imageData) {
        var imageArray = [];
        var copyArray = [];
        imageData.images.forEach(function (val, index) {
            val['images'] = val.image_url;
            val['copyright'] = val.image_copyright;
            imageArray.push(val['images']);
            copyArray.push(val['copyright'])
        });
        return {
            imageArray: imageArray,
            copyArray: copyArray
        }
    }
}