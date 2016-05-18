import {Injectable} from 'angular2/core';

@Injectable()

export class GlobalSettings {
    private static _env = window.location.hostname.split('.')[0];
    private static _proto = window.location.protocol;

    private static _apiUrl:string = '-homerunloyal-api.synapsys.us';
    private static _imageUrl:string = '-sports-images.synapsys.us';
    private static _articleUrl:string = '-homerunloyal-ai.synapsys.us/';
    private static _recommendUrl:string = '-homerunloyal-ai.synapsys.us/headlines/event/';
    private static _headlineUrl:string = '-homerunloyal-ai.synapsys.us/headlines/team/';
    private static _carouselTeamUrl:string = '-homerunloyal-api.synapsys.us/team/imagesAndMedia/';
    private static _carouselPlayerUrl:string = '-homerunloyal-api.synapsys.us/player/imagesAndMedia/';
    private static _carouselLeagueUrl:string = '-homerunloyal-api.synapsys.us/league/imagesAndMedia';

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

    static getCarouselTeamUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._carouselTeamUrl;
    }

    static getCarouselPlayerUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._carouselPlayerUrl;
    }

    static getCarouselLeagueUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._carouselLeagueUrl;
    }
}
