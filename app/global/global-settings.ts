import {Injectable} from 'angular2/core';

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
        if ( relativePath ) {
            return this._proto + "//" + "prod" + this._imageUrl + relativePath;
        }
        else {
            return null;
        }
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

}
