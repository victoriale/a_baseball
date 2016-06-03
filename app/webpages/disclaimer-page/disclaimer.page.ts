/**
 * Created by Victoria on 4/19/2016.
 */
import {Component, OnInit} from 'angular2/core';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent} from '../../components/title/title.component';
import {WidgetModule} from "../../modules/widget/widget.module";
import {Router,ROUTER_DIRECTIVES} from 'angular2/router';
import {Injector} from 'angular2/core';
import {WebApp} from '../../app-layout/app.layout';
import {TitleInputData} from "../../components/title/title.component";

@Component({
    selector: 'Disclaimer-page',
    templateUrl: './app/webpages/disclaimer-page/disclaimer.page.html',

    directives: [BackTabComponent, TitleComponent, WidgetModule, ROUTER_DIRECTIVES],
    providers: [],
})

export class DisclaimerPage implements OnInit {
    pageName = "";
    pageLink = "";
    pageLinkName = "";
    disclaimer = "";
    public partnerParam: string;
    public partnerID: string;
    public disHeaderTitle = "<span style='font-weight: 700;'>Disclaimer</span>";
    titleData: TitleInputData;

    constructor(private injector:Injector, private _router: Router) {
        this._router.root
            .subscribe(
                route => {
                  var curRoute = route;
                  var partnerID = curRoute.split('/');
                  if(partnerID[0] == ''){
                    this.partnerID = null;
                  }else{
                    this.partnerID = partnerID[0];
                  }
                  this.getData();
                }
            )//end of route subscribe

        // Scroll page to top to fix routerLink bug
        window.scrollTo(0, 0);
    }

    getData(){
      var contactRouteName = "";
      if(this.partnerID === null ){
        this.pageName = "Home Run Loyal";
        this.pageLink = "http://www.homerunloyal.com";
        this.pageLinkName = "www.homerunloyal.com";
        contactRouteName = "contactus";
      } else {
        this.pageName = "My HomeRun";
        this.pageLink = "http://www.myhomerun.com/" + this.partnerID;
        this.pageLinkName = "www.myhomerun.com/" + this.partnerID;
        contactRouteName = "Contact";
      }
      //disclaimer data
      this.titleData = {
          imageURL : '/app/public/mainLogo.png',
          text1: 'Last Updated: Monday, March 21, 2016.',
          text2 : ' United States',
          text3 : this.pageName + "'s Disclaimer",
          text4 : '',
          icon: 'fa fa-map-marker',
          hasHover: false
      };

      let contactUsLink = this.pageLink + "/" + contactRouteName;
      let contactUsLinkName = this.pageLinkName + "/" + contactRouteName;

      this.disclaimer = "<p></p><p>All of the information on this website is published in good faith and is for general information purposes only. " + this.pageName + " does not make any warranties about the completeness, reliability and accuracy of this information. Any action you take upon the information you find on this website (<a style='color: #3098ff; font-weight: 700; text-decoration: inherit;' href='"+this.pageLink+"'>"+this.pageLinkName+"</a>) is strictly at your own risk. " + this.pageName + " will not be liable for any losses and/or damages in connection with the use of our website.</p><p>From our website, you can visit other websites by following hyperlinks to external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. Any links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a bad link.</p><p>Be aware that when you leave " + this.pageName + ", other sites may have different privacy policies and terms, which are beyond our control. Please be sure to check the Privacy Policies of these sites as well as their Terms of Service before engaging in any business or uploading any information.</p><br/><div class='disc-page-desc-headline'><b>Consent</b></div><p>By using <a style='color: #3098ff; font-weight: 700; text-decoration: inherit;' href='"+this.pageLink+"'>"+this.pageLinkName+"</a>, you hereby consent to our disclaimer and agree to its terms.</p><br/><div class='disc-page-desc-headline'><b>Update</b></div><p>This site disclaimer was last updated on Monday, March 21, 2016. </p><p><span style='font-style: italic; font-size: 12px;'>Should we update, amend or make any changes to this document, those changes will be prominently posted here.</span></p><br/><div class='disc-page-desc-headline'><b>Contact Us</b></div><p>If you need more information, or if you have any questions about our site's disclaimer, please feel free to contact us at <a style='color: #3098ff; font-weight: 700; text-decoration: inherit;' href='"+contactUsLink+"'>"+contactUsLinkName+"</a>.</p><br/>";
    }

    ngOnInit(){

    }
}
