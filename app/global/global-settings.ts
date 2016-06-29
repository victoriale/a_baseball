import {Injectable} from 'angular2/core';
import {Router} from 'angular2/router';

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

    private static _homepageUrl:string = '.homerunloyal.com';
    private static _partnerHomepageUrl:string = '.homerunloyal.com/';

    private static _baseTitle: string = "Home Run Loyal";

    private static _copyrightInfo: string = "USA Today Sports Images";

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
        var relPath = relativePath != null ? this._proto + "//" + "prod" + this._imageUrl + relativePath: '/app/public/no-image.png';
        return relPath;
    }

    static getBackgroundImageUrl(relativePath):string {
        var relPath = relativePath != null ? this._proto + "//" + "prod" + this._imageUrl + relativePath: '/app/public/drk-linen.png';
        return relPath;
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

    static getHomePage(partnerId: string) {
        if ( partnerId ) {
            return this._proto + "//" + this.getEnv(this._env) + this._partnerHomepageUrl + partnerId;
        }
        else {
            return this._proto + "//" + this.getEnv(this._env) + this._homepageUrl;
        }
    }

    static getSiteLogoUrl():string {
        return "/app/public/mainLogo.png";
    }

    /**
     * This should be called by classes in their constructor function, so that the
     * 'subscribe' function actually gets called and the partnerID can be located from the route
     *
     * @param{Router} router
     * @param {Function} subscribeListener - takes a single parameter that represents the partnerID: (partnerID) => {}
     */
    static getPartnerID(router: Router, subscribeListener: Function) {
        if ( !subscribeListener ) return;

        router.root.subscribe (
            route => {
                var routeItems = route.split('/');
                var partnerID = routeItems[0] == '' ? null : routeItems[0];
                subscribeListener(partnerID);
            }
        )
    }

    static getPageTitle(subtitle?: string, profileName?: string) {
        return this._baseTitle +
            (profileName && profileName.length > 0 ? " - " + profileName : "") +
            (subtitle && subtitle.length > 0 ? " - " + subtitle : "");
    }

    static getCopyrightInfo() {
        return this._copyrightInfo;
    }

}
