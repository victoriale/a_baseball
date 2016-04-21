/**
 * Created by Victoria on 2/25/2016.
 */
import {Component, Input} from 'angular2/core';
import {ModuleHeader} from "../../components/module-header/module-header.component";
import {TilesComponent} from "../../components/tiles/tiles.component";
import {Router,ROUTER_DIRECTIVES} from 'angular2/router';
import {Injector} from 'angular2/core';
// import {WebApp} from '../../app-layout/app.layout';
@Component({
    selector: 'about-us-module',
    templateUrl: './app/modules/aboutus/aboutus.module.html',
    directives: [ModuleHeader, TilesComponent, ROUTER_DIRECTIVES],
    providers: [],
    inputs:['partnerID']
})
export class AboutUsModule{
    module_title: string;
    aboutUsData: any;
    pageName = "";
    header = '';
    logo = '';
    heading = 'Disclaimer';
    subText = 'Market data delayed 15 minutes.';
    mainText = '';
    providerText = '';
    currentYear: number;
    buttonText = 'See The Full Disclaimer';
    public partnerParam: string;
    public partnerID: string;
    constructor(private injector:Injector, private _router: Router){
      this._router.root
      .subscribe(
          route => {
            var curRoute = route;
            var partnerID = curRoute.split('/');
            if(partnerID[0] != ''){
              this.partnerID = partnerID[0];
              var partnerParam = this.partnerID.replace('-','.');
            }else{
              this.partnerID = null;
            }
      })
      window.scrollTo(0, 0);
    }
    ngOnInit(){
      if(this.partnerID === null || this.partnerID == '' || typeof this.partnerID == 'undefined'){
        this.pageName = "HomeRunLoyal";
        this.logo = '/app/public/joyfulhome_logo_large.png';
      } else {
        this.pageName = "My HouseKit";
        this.logo = '/app/public/myhousekit_logo.png';
      }
      this.header = this.pageName + ' Disclaimer';
      this.mainText = 'This site is powered by '+this.pageName+'. Ideas and opinions presented on this website are for informational and educational purposes only, and do not reflect the opinions of '+this.pageName+', or any of its affiliates, subsidiaries or partners.';
      this.currentYear = new Date().getFullYear();
      this.providerText = this.currentYear+' Data provided by ListHub';
      this.module_title = 'Learn More About ' + this.pageName;
      this.aboutUsData = {
        button_txt: 'Open Page',
        url1: 'Aboutus-page',
        icon1: 'fa-info-circle',
        title1: 'About Us',
        desc1: 'What is '+ this.pageName +'?',
        url2: 'Contactus-page',
        icon2: 'fa-phone',
        title2: 'Contact Us',
        desc2: 'Help us help you faster.',
        url3: 'Disclaimer-page',
        icon3: 'fa-folder-open-o',
        title3: 'Disclaimer',
        desc3: 'Read the full disclaimer.'
      }
    }
}
