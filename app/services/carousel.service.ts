import {Injectable, Injector} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router';
import {RouteParams} from '@angular/router-deprecated';
import {HTTP_PROVIDERS, Http, Response, Headers} from "@angular/http";
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
        var fullUrl = GlobalSettings.getApiUrl() + "/" + profileType.toLowerCase() + "/imagesAndMedia";
        if (profileId !== undefined) {
            fullUrl += "/" + profileId;
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
            val['images'] = GlobalSettings.getImageUrl(val.image_url);
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
