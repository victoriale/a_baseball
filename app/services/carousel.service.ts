import {Injectable, Injector} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, RouteConfig, RouteParams } from 'angular2/router';
import {HTTP_PROVIDERS, Http, Response, Headers} from "angular2/http";
import {GlobalSettings} from "../global/global-settings";
import {Observable} from "rxjs/Observable";

@Injectable()

export class ImagesService {
    constructor(public http:Http) {};

    getImages(profileType, profileId?) {
        var fullUrl = GlobalSettings.getApiUrl() + "/" + profileType.toLowerCase() + "/imagesAndMedia";
        if (profileId !== undefined) {
            fullUrl += "/" + profileId;
        }
        
        return this.http.get(fullUrl)
            .map(res => res.json())
            .map(data => this.getImageArray(data.data));
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
