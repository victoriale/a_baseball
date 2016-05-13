import {Component, Input} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from "../../components/module-header/module-header.component";
import {FlipTilesComponent, TileData} from "../../components/flip-tiles/flip-tiles.component";
import {Router,ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'about-us',
    templateUrl: './app/modules/about-us/about-us.module.html',
    directives: [ModuleHeader, FlipTilesComponent, ROUTER_DIRECTIVES],
    providers: []
})
export class AboutUsModule {

    @Input() partnerID: string = null;

    public homePageLinkName: string = "homerunloyal";
    public pageName: string;
    public moduleHeader: ModuleHeaderData;
    public headerText: string = "Disclaimer";
    public logoUrl = '/app/public/Logo_Home-Run-Loyal-B.png';
    public buttonText = 'See The Full Disclaimer';
    public aboutUsData: Array<TileData>;

    constructor(private _router: Router) {
      this._router.root
      .subscribe(
          route => {
            var routeValues = route.split('/');
            if(routeValues[0] !== '' && routeValues[0] !== undefined && routeValues[0] !== null){
              //Has Partner
              this.partnerID = routeValues[0];
            } else {
              this.partnerID = null;
            }
      })
    }

    ngOnInit() {
      if(this.partnerID === null) {
          this.homePageLinkName = "www.homerunloyal.com"
          this.pageName = "Home Run Loyal";
     } else {
          this.homePageLinkName = "www.myhomerun.com/" + this.partnerID;
          this.pageName = "My HomeRun";
      }

      this.headerText = this.pageName + ' Disclaimer';
      this.moduleHeader = {
        moduleTitle: 'Learn More About ' + this.pageName,
        hasIcon: false,
        iconClass: ''
      };

      this.aboutUsData = [{
        buttonText: 'Open Page',
        routerInfo: ['About-us-page'],
        faIcon: 'fa-info-circle',
        title: 'About',
        description: 'What is '+ this.pageName +'?',
      },
      {
        buttonText: 'Open Page',
        routerInfo: ['Contact-us-page'],
        faIcon: 'fa-phone',
        title: 'Contact Us',
        description: 'Help us help you faster.',
      },
      {
        buttonText: 'Open Page',
        routerInfo: ['Disclaimer-page'],
        faIcon: 'fa-folder-open-o',
        title: 'Disclaimer',
        description: 'Read the full disclaimer.'
      }];
    }
}
