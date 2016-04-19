/**
 * Created by Victoria on 4/19/2016.
 */
import {Component, OnInit} from 'angular2/core';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent} from '../../components/title/title.component';
import {WidgetModule} from "../../modules/widget/widget.module";
import {Router,ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {GlobalPage} from '../../global/global-service';
import {AboutUsPageInterface} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';
import {Injector} from 'angular2/core';
import {WebApp} from '../../app-layout/app.layout';
import {AuHeaderComponent} from '../../components/about-us-header/au-header.component';

@Component({
    selector: 'Aboutus-page',
    templateUrl: './app/webpages/aboutus-page/aboutus.page.html',

    directives: [AuHeaderComponent, BackTabComponent, TitleComponent, WidgetModule, ROUTER_DIRECTIVES],
    providers: [GlobalPage],
})

export class AboutUsPage implements OnInit{
    whatIs = "";
    pageName = "";

    au_icon1 = '/app/public/aboutUs_logo1.png';
    au_icon2 = '/app/public/aboutUs_logo2.png';
    au_icon3 = '/app/public/aboutUs_logo3.png';
    au_icon4 = '/app/public/currentWorldSeriesChamp.png';//will need to get the current world series champ from the api
    nat_map = '/app/public/AboutUs_Map.png';

    subText1 = "Listings For Sale";
    subText2 = "Cities in United States";
    subText3 = "Real Estate Agents";
    subText4 = "Counties in United States";
    subText_nat = "Where We Are Located";

    mainText1 = ""; // this is for listing for sale
    mainText2 = "31,102"; // number of cities in the U.S.
    mainText3 = ""; // Real Easte Angents
    mainText4 = "3,143"; // United States' counties
    mainText_nat = ""; // listings nationwide
    public partnerParam: string;
    public partnerID: string;
    titleData: {};
    auHeaderTitle: string;

    constructor(private injector:Injector, private _router: Router, private _aboutUs: GlobalPage, private globalFunctions: GlobalFunctions) {
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
                  if(this.partnerID === null ){
                    this.pageName = "HomeRunLoyal";
                  } else {
                    this.pageName = "My HouseKit";
                  }
                  this.auHeaderTitle = "<b>What is </b>" + this.pageName;
                }
            )//end of route subscribe
    }

    getData(){
      this._aboutUs.getAboutUsData().subscribe(data => {

           this.mainText1 = this.globalFunctions.commaSeparateNumber(data.listings);
           this.mainText2 = this.globalFunctions.commaSeparateNumber(data.cities);
           this.mainText3 = this.globalFunctions.commaSeparateNumber(data.brokers);
           this.mainText4 = this.globalFunctions.commaSeparateNumber(data.counties);
           this.mainText_nat = this.globalFunctions.commaSeparateNumber(data.listings) + " +";
      })
      //About us title
      this.titleData = {
          imageURL : '/app/public/joyfulhome_house.png',
          smallText1 : 'Last Updated: Monday, February 26, 2016',
          smallText2 : ' United States of America',
          heading1 : 'About Us',
          heading2 : '',
          heading3 : 'Take a seat and get to know us better.',
          heading4 : '',
          icon: 'fa fa-map-marker',
          hasHover: false
      };
    }

    ngOnInit(){

    }
}
