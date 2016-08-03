import {Injectable} from '@angular/core';
import {Router} from '@angular/router-deprecated';

@Injectable()

export class GlobalSettings {
    private static _env = window.location.hostname.split('.')[0];
    private static _proto = window.location.protocol;

    private static _newsUrl:string = 'newsapi.synapsys.us';

    private static _apiUrl:string = '-homerunloyal-api.synapsys.us';
    private static _partnerApiUrl: string = 'apireal.synapsys.us/listhuv/?action=get_partner_data&domain=';
    private static _widgetUrl: string = 'w1.synapsys.us';

    private static _dynamicApiUrl: string = 'dw.synapsys.us/list_creator_api.php'

    private static _imageUrl:string = '-sports-images.synapsys.us';
    private static _articleUrl:string = '-homerunloyal-ai.synapsys.us/';
    private static _recommendUrl:string = '-homerunloyal-ai.synapsys.us/headlines/event/';
    private static _headlineUrl:string = '-homerunloyal-ai.synapsys.us/headlines/team/';
    private static _trendingUrl:string = '-homerunloyal-ai.synapsys.us/sidekick';
    private static _recUrl:string = '-homerunloyal-ai.synapsys.us/sidekick-regional';
    private static _homepageUrl:string = '.homerunloyal.com';
    private static _partnerHomepageUrl:string = '.myhomerunzone.com';

    private static _baseTitle: string = "Home Run Loyal";

    private static _copyrightInfo: string = "USA Today Sports Images";

    static getEnv(env:string):string {
      if (env == "localhost"){
          env = "dev";
      }
      if (env != "dev" && env !="qa"){
          env = "prod";
      }
      return env;
    }

    static getDynamicWidet():string {
        return this._proto + "//" + this._dynamicApiUrl;
    }

    static getApiUrl():string {
        //[https:]//[prod]-homerunloyal-api.synapsys.us
        return this._proto + "//" + this.getEnv(this._env) + this._apiUrl;
    }

    static getPartnerApiUrl(partnerID):string {
        return this._proto + "//"+ this._partnerApiUrl + partnerID;
    }

    static getGeoLocation():string {
        //[https:]//[prod]-homerunloyal-api.synapsys.us
        return this._proto + "//" + this._widgetUrl;
    }

    static getImageUrl(relativePath):string {
        var relPath = relativePath != null && relativePath != "" ? this._proto + "//" + "prod" + this._imageUrl + relativePath: '/app/public/no-image.png';
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

    static getTrendingUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._trendingUrl;
    }
    static getRecUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._recUrl;
    }

    static getHeadlineUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._headlineUrl;
    }

    static getNewsUrl():string {
        //[https:]//[prod]-homerunloyal-api.synapsys.us
        return this._proto + "//" + this._newsUrl;
    }

    static getHomePage(partnerId: string, includePartnerId?: boolean) {
      var linkEnv = this._env != 'localhost' && this._env != "homerunloyal" && this._env != "myhomerunzone" ? this._env:'www';
        if ( partnerId ) {
            return this._proto + "//" + linkEnv + this._partnerHomepageUrl + (includePartnerId ? "/" + partnerId : "");
        }
        else {
            return this._proto + "//" + linkEnv + this._homepageUrl;
        }
    }

    static getHomeInfo(){
      //grabs the domain name of the site and sees if it is our partner page
      var partner = false;
      var isHome = false;
      var hide = false;
      var hostname = window.location.hostname;
      var partnerPage = /myhomerunzone/.test(hostname);
      //var partnerPage = /localhost/.test(hostname);
      var name = window.location.pathname.split('/')[1];
      //console.log("GlobalSettings:", 'partnerPage =>', partnerPage, 'name =>', name);

      //PLEASE REVISIT and change
      if(partnerPage && (name == '' || name == 'deep-dive')){
        hide = true;
        isHome = true;
      }else if(!partnerPage && (name == '' || name == 'deep-dive')){
        hide = false;
        isHome = true;
      }else{
        hide = false;
        isHome = false;
      }

      if(partnerPage){
        partner = partnerPage;
      }
      // console.log({isPartner: partner, hide:hide, isHome:isHome});
      return {isPartner: partner, hide:hide, isHome:isHome, partnerName: name};
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
                let partnerID = null;
                if ( route && route.instruction && route.instruction.params ) {
                    partnerID = route.instruction.params["partner_id"];
                }
                subscribeListener(partnerID == '' ? null : partnerID);
            }
        )
    }

    static getPageTitle(subtitle?: string, profileName?: string) {
      if(this.getHomeInfo().isPartner){
        this._baseTitle = "My HomeRun Zone";
      }
        return this._baseTitle +
            (profileName && profileName.length > 0 ? " - " + profileName : "") +
            (subtitle && subtitle.length > 0 ? " - " + subtitle : "");
    }

    static getCopyrightInfo() {
        return this._copyrightInfo;
    }

}
