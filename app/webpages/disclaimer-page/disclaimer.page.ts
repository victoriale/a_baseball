import {Component} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {Injector} from '@angular/core';
import {Title} from '@angular/platform-browser';

import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent} from '../../components/title/title.component';
import {WidgetModule} from "../../modules/widget/widget.module";
import {TitleInputData} from "../../components/title/title.component";
import {GlobalSettings} from '../../global/global-settings';
import {GlobalFunctions} from '../../global/global-functions';
import {SidekickWrapper} from "../../components/sidekick-wrapper/sidekick-wrapper.component";
import {ResponsiveWidget} from '../../components/responsive-widget/responsive-widget.component';

import {SeoService} from "../../seo.service";

@Component({
    selector: 'Disclaimer-page',
    templateUrl: './app/webpages/disclaimer-page/disclaimer.page.html',

    directives: [SidekickWrapper, BackTabComponent, TitleComponent, WidgetModule, ROUTER_DIRECTIVES, ResponsiveWidget],
    providers: [Title],
})

export class DisclaimerPage {
    public widgetPlace: string = "widgetForPage";
    public pageName: string;
    public pageLinkName: string;
    public contactUsLinkName: string;
    public titleData: TitleInputData;

    constructor(private _router:Router, private _title: Title, private _seoService: SeoService, private _params:RouteParams) {
      GlobalSettings.getPartnerID(_router, partnerID => this.loadData(partnerID));
    }

    ngAfterViewInit(){
      //This call will remove all meta tags from the head.
      this._seoService.removeMetaTags();
      //create meta description that is below 160 characters otherwise will be truncated
      let metaDesc = 'Disclaimer page to disclose any information';
      let link = window.location.href;
      this._seoService.setCanonicalLink(this._params.params, this._router);
      this._seoService.setOgTitle('Disclaimer');
      this._seoService.setOgDesc(metaDesc);
      this._seoService.setOgType('image');
      this._seoService.setOgUrl(link);
      this._seoService.setOgImage('./app/public/mainLogo.png');
      this._seoService.setTitle('Disclaimer');
      this._seoService.setMetaDescription(metaDesc);
      this._seoService.setMetaRobots('NOINDEX, FOLLOW');
      this._seoService.setPageDescription(metaDesc);
    }

    loadData(partnerID:string) {
      this.pageLinkName = GlobalSettings.getHomePage(partnerID).replace(/https?:\/\//, "");

      this.pageName = partnerID ? "My Home Run Zone" : "Home Run Loyal";
      this.titleData = {
          imageURL : GlobalSettings.getSiteLogoUrl(),
          text1: 'Last Updated: Friday July 1, 2016.',
          text2 : ' United States',
          text3 : GlobalFunctions.convertToPossessive(this.pageName) + " Disclaimer",
          text4 : '',
          icon: 'fa fa-map-marker'
      };

      var subpath = this._router.generate(["Contact-us-page"]).toRootUrl();
      this.contactUsLinkName = this.pageLinkName + (subpath.charAt(0) == "/" ? "" : "/") + subpath;
    }
}
