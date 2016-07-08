import {Component, Input, Injector, OnChanges} from '@angular/core';
import {ModuleHeader, ModuleHeaderData} from "../../components/module-header/module-header.component";
import {FlipTilesComponent, TileData} from "../../components/flip-tiles/flip-tiles.component";
import {GlobalSettings} from '../../global/global-settings';
import {GlobalFunctions} from '../../global/global-functions';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

@Component({
    selector: 'about-us',
    templateUrl: './app/modules/about-us/about-us.module.html',
    directives: [ModuleHeader, FlipTilesComponent, ROUTER_DIRECTIVES],
    providers: []
})
export class AboutUsModule implements OnChanges {
    @Input() partnerID: string;

    public homePageLinkName: string = "homerunloyal";
    public pageName: string;
    public moduleHeader: ModuleHeaderData;
    public headerText: string = "Disclaimer";
    public logoUrl:string;
    public buttonText = 'See The Full Disclaimer';
    public aboutUsData: Array<TileData>;

    constructor() {}

    ngOnChanges() {
      this.loadData(this.partnerID);
    }

    loadData(partnerID: string) {
      if(partnerID != null) {
        this.homePageLinkName = "www.myhomerunzone.com/" + partnerID;
        this.pageName = "My Home Run Zone";
        this.logoUrl = '/app/public/Logo_My-Home-Run-Zone.svg';
     } else {
       this.homePageLinkName = "www.homerunloyal.com"
       this.pageName = "Home Run Loyal";
       this.logoUrl = '/app/public/Logo_Home-Run-Loyal.png';
      }

      this.headerText = GlobalFunctions.convertToPossessive(this.pageName) + ' Disclaimer';
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
