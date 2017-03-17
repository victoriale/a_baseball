import {Injectable} from '@angular/core';
import {Router} from '@angular/router-deprecated';

@Injectable()

export class GlobalSettings {
    private static _env = window.location.hostname.split('.')[0];
    private static _proto = window.location.protocol;

    private static _newsUrl:string = 'newsapi.synapsys.us';

    private static _apiUrl:string = '-homerunloyal-api.synapsys.us';
    private static _partnerApiUrl: string = 'apireal.synapsys.us/listhuv/?action=get_partner_data&domain=';
    // private static _partnerDomainApiUrl: string = 'w1.synapsys.us/widgets/deepdive/bar/domain_api.php?dom=chicagotribune.com';
    private static _partnerDomainApiUrl: string = 'devapi.synapsys.us/widgets/deepdive/bar/domain_api.php?dom=';
    private static _widgetUrl: string = 'w1.synapsys.us';

    private static _dynamicApiUrl: string = 'dw.synapsys.us/list_creator_api.php';
    private static _dynamicScraperApiUrl: string = 'dw.synapsys.us/api_json/list_creator_api.php';

    private static _imageUrl:string = 'sports-images.synapsys.us';
    private static _articleUrl:string = '-article-library.synapsys.us/';
    private static _articleDataUrl:string = '-homerunloyal-ai.synapsys.us/';
    private static _headlineUrl:string = '-homerunloyal-ai.synapsys.us/';
    private static _recUrl:string = '-homerunloyal-ai.synapsys.us/sidekick-regional';
    private static _articleLibrayUrl:string = '-article-library.synapsys.us';
    private static _homepageUrl:string = '.homerunloyal.com';
    private static _partnerHomepageUrl:string = '.myhomerunzone.com';

    private static _dataProvidedBy: string = 'XML Team';

    private static _baseTitle: string = "Home Run Loyal";
    private static _sportName: string ="baseball";
    private static _sportLeagueAbbrv: string ="MLB";

    private static _copyrightInfo: string = "USA Today Sports Images";

    static _imgBoxScoreLogo: number = 45;
    static _imgSmLogo: number = 48;
    static _imgScheduleLogo: number = 68;
    static _imgPageLogo: number = 96;
    static _deepDiveSm: number = 100;
    static _imgMdLogo: number = 121;
    static _imgLogoLarge: number = 125;
    static _deepDiveTrending: number = 140;
    static _imgLgLogo: number = 150;
    static _imgProfileLogo: number = 180;
    static _imgHeadlineMain: number = 300;
    static _deepDiveRec: number = 350;
    static _imgAiRec: number = 600;
    static _imgProfileMod: number = 640;
    static _deepDiveMd: number = 750;

    static getEnv(env:string):string {
      if (env == "localhost"){
          env = "dev";
      }
      if (env != "dev" && env !="qa"){
          env = "prod";
      }
      return env;
    }

    static isProd():boolean {
      if( this.getEnv(this._env) == "prod" ){
        return true;
      }else{
        return false;
      }
    }

    static getDynamicWidget():string {
        return this._proto + "//" + this._dynamicApiUrl;
    }

    static getDynamicScraperWidget():string {
      return this._proto + "//" + this._dynamicScraperApiUrl;
    }

    static getApiUrl():string {
        //[https:]//[prod]-homerunloyal-api.synapsys.us
        return this._proto + "//" + this.getEnv(this._env) + this._apiUrl;
    }

    static getPartnerApiUrl(partnerID):string {
        return this._proto + "//"+ this._partnerApiUrl + partnerID;
    }

    static getArticleLibraryUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._articleLibrayUrl;
    }

    static getPartnerDomainApiUrl(partnerID):string {
        return this._proto + "//"+ this._partnerDomainApiUrl + partnerID;
    }

    static getGeoLocation():string {
        //[https:]//[prod]-homerunloyal-api.synapsys.us
        return this._proto + "//" + this._widgetUrl;
    }

    static resizeImage(width:number){
      var resizePath;
      let r = window.devicePixelRatio;
      width = width > 1920 ? 1920 : width;//width limit to 1920 if larger
      width = width * r;
      resizePath = "?width=" + width;
      if(width < 150){//increase quality if smaller than 150, default is set to 70
        resizePath += "&quality=90";
      }
      return resizePath;
    }

    static getImageUrl(relativePath, width:number=1920):string {
        var relPath = relativePath != null && relativePath != "" ? this._proto + "//" + this._imageUrl + relativePath: '/app/public/no-image.png';
        if (relativePath != null && relativePath != "") {
            relPath += this.resizeImage(width);
        }
        return relPath;
    }

    static getCarouselImageUrl(relativePath):string {
        var relPath = relativePath != null ? this._proto + "//" + "prod-" + this._imageUrl + relativePath: '/app/public/drk-linen.png';
        return relPath;
    }

    static getBackgroundImageUrl(relativePath, width:number=1920):string {
        var relPath = relativePath != null ? this._proto + "//" + this._imageUrl + relativePath: '/app/public/drk-linen.png';
        if (relativePath != null && relativePath != "") {
            relPath += this.resizeImage(width);
        }
        return relPath;
    }

    static getArticleUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._articleUrl;
    }

    static getArticleDataUrl():string {
        return this._proto + "//" + this.getEnv(this._env) + this._articleDataUrl;
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

    static getDataProvidedBy():string {
        return this._dataProvidedBy;
    }

    static getHomePage(partnerId: string, includePartnerId?: boolean) {
      var linkEnv = this._env != 'localhost' && this._env != "homerunloyal" && this._env != "myhomerunzone" && this._env != "baseball" ? this._env:'www';
        if ( partnerId ) {
            return this._proto + "//" + linkEnv + this._partnerHomepageUrl + (includePartnerId ? "/" + partnerId : "");
        }
        else {
            return this._proto + "//" + linkEnv + this._homepageUrl;
        }
    }

    //grabs the domain name of the site and sees if it is our partner page
    static getHomeInfo(){
      var partner = false;
      var isHome = false;
      var hide = false;
      var hostname = window.location.hostname;
      var partnerPage = /myhomerunzone/.test(hostname) || /^baseball\./.test(hostname);
      var name = window.location.pathname.split('/')[1];
      var isSubdomainPartner = /^baseball\./.test(hostname);
      //PLEASE REVISIT and change
      if(partnerPage && name == ''){
        hide = true;
        isHome = true;
      }else if(!partnerPage && name == ''){
        hide = false;
        isHome = true;
      }else{
        hide = false;
        isHome = false;
      }

      if(partnerPage){
        partner = partnerPage;
      }
      return {
        isPartner: partner,
        hide:hide,
        isHome:isHome,
        partnerName: name,
        isSubdomainPartner: isSubdomainPartner
      };
    }

    static getSiteLogoUrl():string {
        return "/app/public/mainLogo.png";
    }

    static getMLBLogoUrl():string {
      // Prod is hardcoded because dev and qa server does not exist
      return this._proto + "//" + "prod-" + this._imageUrl + "/mlb/logos/team/MLB_Logo.jpg";
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
                if ( route && route.instruction && route.instruction.params["partner_id"] != null ) {
                  partnerID = route.instruction.params["partner_id"];
                }else if(window.location.hostname.split(".")[0].toLowerCase() == "baseball"){
                  partnerID = window.location.hostname.split(".")[1] + "." + window.location.hostname.split(".")[2];
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
    static getSportName() {
        return this._sportName;
    }
    static getSportLeagueAbbrv() {
        return this._sportLeagueAbbrv;
    }
    static getScopeNow() {
        var url = window.top.location.pathname;
        var scope = this._sportLeagueAbbrv;
        var majorLeague = this._sportLeagueAbbrv.toLowerCase();
        if (url.includes(majorLeague)) {
            scope = majorLeague;
        }
        /*else if (url.includes(minorLeagueFull) || url.includes(minorLeague)) {
            scope = minorLeagueFull;
        }*/
        return scope;
    }
}
