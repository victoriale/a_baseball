import {Injectable} from '@angular/core';
import {Router} from "@angular/router-deprecated";

@Injectable()

export class GlobalSettings {
    private static _env = window.location.hostname.split('.')[0];
    private static _proto = window.location.protocol;

    private static _newsUrl:string = 'newsapi.synapsys.us';

    private static _apiUrl:string = '-homerunloyal-api.synapsys.us';
    private static _imageUrl:string = '-sports-images.synapsys.us';
    private static _articleUrl:string = '-homerunloyal-ai.synapsys.us/';
    private static _recommendUrl:string = '-homerunloyal-ai.synapsys.us/headlines/event/';
    private static _headlineUrl:string = '-homerunloyal-ai.synapsys.us/headlines/team/';

    static getEnv(env:string):string {
        if (env == "localhost") {
            env = "dev";
        }
        if (env != "dev" && env != "qa") {
            env = "prod";
        }
        return env;
    }

    static getApiUrl():string {
        //[https:]//[prod]-homerunloyal-api.synapsys.us
        return this._proto + "//" + this.getEnv(this._env) + this._apiUrl;
    }

    static getImageUrl(relativePath):string {
        return this._proto + "//" + "prod" + this._imageUrl + relativePath;
    }

    static getArticleUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._articleUrl;
    }

    static getRecommendUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._recommendUrl;
    }

    static getHeadlineUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._headlineUrl;
    }

    static getNewsUrl():string {
        //[https:]//[prod]-homerunloyal-api.synapsys.us
        return this._proto + "//" + this._newsUrl;
    }
    
    static getPartnerId(router: Router, setPartnerId: Function) {        
        // router.root
        //     .subscribe(
        //         route => {
        //             var routeValues = route.split('/');
        //             if (routeValues[0] == '') {
        //                 setPartnerId(null);
        //             } else {
        //                 setPartnerId(routeValues[0]);
        //             }
        //         }
        //     )//end of route subscribe
    }

}
