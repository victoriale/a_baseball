/**
 * Created by Victoria on 3/1/2016.
 */
import {Component, OnInit} from 'angular2/core';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent} from '../../components/title/title.component';
import {WidgetModule} from "../../modules/widget/widget.module";
import {Router,ROUTER_DIRECTIVES} from 'angular2/router';
import {Injector} from 'angular2/core';
import {WebApp} from '../../app-layout/app.layout';
//import {AuHeaderComponent} from '../../components/au-header/au-header.component';

@Component({
    selector: 'Disclaimer-page',
    templateUrl: './app/webpages/disclaimer-page/disclaimer.page.html',

    directives: [AuHeaderComponent, BackTabComponent, TitleComponent, WidgetModule, ROUTER_DIRECTIVES],
    providers: [],
})

export class DisclaimerPage implements OnInit {
    pageName = "";
    pageLink = "";
    pageLinkName = "";
    disclaimer = "";
    public partnerParam: string;
    public partnerID: string;
    title_data: {};
    auHeaderTitle = "<b>Disclaimer</b>";

    constructor(private injector:Injector, private _router: Router) {
        // Scroll page to top to fix routerLink bug
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
    }

    getData(){
      var contactRouteName = "";
      if(this.partnerID === null ){
        this.pageName = "HomeRunLoyal";
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
      this.title_data = {
          imageURL : '/app/public/homerunloyal_house.png',
          smallText1 : 'Last Updated: Saturday, December 19, 2015.',
          smallText2 : ' United States of America',
          heading1 : 'Disclaimer',
          heading2 : '',
          heading3 : 'For ' + this.pageName,
          heading4 : '',
          icon: 'fa fa-map-marker',
          hasHover: false
      };

      let contactUsLink = this.pageLink + "/" + contactRouteName;
      let contactUsLinkName = this.pageLinkName + "/" + contactRouteName;

      this.disclaimer = "<p></p><p>All of the information on this website is published in good faith and is for general information purposes only. HomeRunLoyal does not make any warranties about the completeness, reliability and accuracy of this information. Any action you take upon the information you find on this website (<a style='color: #44b224; font-weight: 700; text-decoration: inherit;' href='"+this.pageLink+"'>"+this.pageLinkName+"</a>) is strictly at your own risk. HomeRunLoyal will not be liable for any losses and/or damages in connection with the use of our website.</p><p>From our website, you can visit other websites by following hyperlinks to external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. Any links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a bad link.</p><p>Be aware that when you leave HomeRunLoyal, other sites may have different privacy policies and terms, which are beyond our control. Please be sure to check the Privacy Policies of these sites as well as their <span style='font-style: italic;'>Terms of Service</span> before engaging in any business or uploading any information.</p><br/><div class='au-desc-headline'><b>Consent</b></div><p>By using <a style='color: #44b224; font-weight: 700; text-decoration: inherit;' href='"+this.pageLink+"'>"+this.pageLinkName+"</a>, you hereby consent to our disclaimer and agree to its terms.</p><br/><div class='au-desc-headline'><b>Update</b></div><p>This site disclaimer was last updated on Saturday, December 19, 2015. </p><p>Should we update, amend or make any changes to this document, those changes will be prominently posted here.</p><br/><div class='au-desc-headline'><b>Contact Us</b></div><p>If you need more information, or if you have any questions about HomeRunLoyal's disclaimer, feel free to contact us at <a style='color: #44b224; font-weight: 700; text-decoration: inherit;' href='"+contactUsLink+"'>"+contactUsLinkName+"</a>.</p><br/>";
    }

    ngOnInit(){

    }
}
