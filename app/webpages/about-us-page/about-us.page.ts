import {Component, Injector} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent} from '../../components/title/title.component';
import {WidgetModule} from "../../modules/widget/widget.module";

import {AboutUsService} from '../../services/about-us.service';
import {GlobalSettings} from '../../global/global-settings';
import {GlobalFunctions} from '../../global/global-functions';
import {TitleInputData} from "../../components/title/title.component";
import {CircleImage} from "../../components/images/circle-image";
import {CircleImageData} from "../../components/images/image-data";
import {SidekickWrapper} from "../../components/sidekick-wrapper/sidekick-wrapper.component";
import {ResponsiveWidget} from '../../components/responsive-widget/responsive-widget.component';
import {SeoService} from "../../seo.service";

export interface AuBlockData {
  iconUrl?:string;
  link?: {
    imageConfig: CircleImageData;
    route: Array<any>;
  }
  titleText:string;
  dataText:string;
}

export interface AboutUsModel {
    blocks: Array<AuBlockData>;
    headerTitle: string;
    titleData: TitleInputData;
    content: Array<string>;
}

@Component({
    selector: 'About-us-page',
    templateUrl: './app/webpages/about-us-page/about-us.page.html',
    directives: [SidekickWrapper, CircleImage, BackTabComponent, TitleComponent, WidgetModule, ROUTER_DIRECTIVES, ResponsiveWidget],
    providers: [AboutUsService, Title],
})

export class AboutUsPage {
    public widgetPlace: string = "widgetForPage";
    public auHeaderTitle: string = "What is the site about?";

    public auBlocks: Array<AuBlockData> = [];

    public auContent: Array<string> = [];

    public content: string;

    public titleData: TitleInputData = {
        imageURL : GlobalSettings.getSiteLogoUrl(),
        text1: 'Last Updated: [date]',
        text2: 'United States',
        text3: 'Want to learn more?',
        text4: '',
        icon: 'fa fa-map-marker'
    }

    constructor(private _router:Router, private _service: AboutUsService, private _title: Title, private _seoService:SeoService, private _params:RouteParams) {
        GlobalSettings.getPartnerID(_router, partnerID => this.loadData(partnerID));
    }

    ngAfterViewInit(){

    }
    loadData(partnerID:string) {
        this._service.getData(partnerID).subscribe(
          data => this.setupAboutUsData(data),
          err => {
            console.log("Error getting About Us data: " + err);
          }
        );

    }

    createMetaTags(data){
        //This call will remove all meta tags from the head.
        this._seoService.removeMetaTags();
        //create meta description that is below 160 characters otherwise will be truncated
        let metaDesc = GlobalSettings.getPageTitle(data.content[0],"About us");
        let link = window.location.href;
        this._seoService.setCanonicalLink(this._params.params, this._router);
        this._seoService.setOgTitle('About Us - '+ GlobalSettings.getPageTitle());
        this._seoService.setOgDesc(metaDesc);
        this._seoService.setOgType('image');
        this._seoService.setOgUrl(link);
        this._seoService.setOgImage('./app/public/mainLogo.png');
        this._seoService.setTitle('About Us - '+ GlobalSettings.getPageTitle());
        this._seoService.setMetaDescription(metaDesc);
        this._seoService.setMetaRobots('INDEX, FOLLOW');
        this._seoService.setPageDescription(metaDesc);
        this._seoService.setPageTitle('About Us - '+ GlobalSettings.getPageTitle());
        this._seoService.setPageUrl(link);
    }

    setupAboutUsData(data:AboutUsModel) {
      if ( data !== undefined && data !== null ) {
        this.auBlocks = data.blocks;
        this.auHeaderTitle = data.headerTitle;
        this.titleData = data.titleData;
        this.auContent = data.content;
      }
        this.createMetaTags(data);
    }

}
