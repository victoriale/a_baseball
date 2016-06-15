import {Component} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {Injector} from 'angular2/core';
import {Title} from 'angular2/platform/browser';

import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent} from '../../components/title/title.component';
import {WidgetModule} from "../../modules/widget/widget.module";
import {TitleInputData} from "../../components/title/title.component";
import {GlobalSettings} from '../../global/global-settings';
import {GlobalFunctions} from '../../global/global-functions';
import {SidekickWrapper} from "../../components/sidekick-wrapper/sidekick-wrapper.component";

@Component({
    selector: 'Disclaimer-page',
    templateUrl: './app/webpages/disclaimer-page/disclaimer.page.html',

    directives: [SidekickWrapper, BackTabComponent, TitleComponent, WidgetModule, ROUTER_DIRECTIVES],
    providers: [Title],
})

export class DisclaimerPage {
    public pageName: string;
    public pageLinkName: string;
    public contactUsLinkName: string;
    public titleData: TitleInputData;

    constructor(private _router:Router, private _title: Title) {
      _title.setTitle(GlobalSettings.getPageTitle("Disclaimer"));
      GlobalSettings.getPartnerID(_router, partnerID => this.loadData(partnerID));
    }

    loadData(partnerID:string) {
      this.pageLinkName = GlobalSettings.getHomePage(partnerID).replace(/https?:\/\//, "");

      this.pageName = partnerID ? "My HomeRun" : "Home Run Loyal";
      this.titleData = {
          imageURL : GlobalSettings.getSiteLogoUrl(),
          text1: 'Last Updated: Monday, March 21, 2016.',
          text2 : ' United States',
          text3 : this.pageName + "'s Disclaimer",
          text4 : '',
          icon: 'fa fa-map-marker',
          hasHover: false
      };

      var subpath = this._router.generate(["Contact-us-page"]).toRootUrl();
      this.contactUsLinkName = this.pageLinkName + (subpath.charAt(0) == "/" ? "" : "/") + subpath;
    }
}
