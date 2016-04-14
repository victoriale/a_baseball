import {Component, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteConfig, Location, AsyncRoute} from 'angular2/router';
import {Contact} from "../modules/magazine/contact/contact.module";
import {Neighborhood} from "../modules/magazine/neighborhood/neighborhood.module";
import {Recommendations} from "../modules/magazine/recommendations/recommendations.module";
import {RouteParams} from "angular2/router";
import {MagHeaderModule} from "../modules/magazine/mag-header/mag-header.module";
import {FooterComponent} from "../components/magazine/mag-footer/mag-footer.component";
import {MagazineDataService} from "../global/global-mag-service";
import {Router} from "angular2/router";
import {MagOverviewModule} from "../modules/magazine/mag-overview/mag-overview.module";
import {MagOverview, MagData} from "../global/global-interface";
import {Amenities} from "../modules/magazine/mag-amenities/mag-amenities.module";
import {KeyInformation} from "../modules/magazine/key-information/key-information.module";
import {NavLeftComponent} from "../components/magazine/mag-nav-left/mag-nav-left.component";
import {NavRightComponent} from "../components/magazine/mag-nav-right/mag-nav-right.component";
import {MagErrorModule} from "../modules/magazine/mag-error/mag-error.module";

declare var jQuery:any;

@Component({
    selector: 'magazine-page',
    templateUrl: './app/app-webpage/magazine.webpage.html',
    
    directives: [Contact, Neighborhood, Recommendations, Amenities, MagHeaderModule, FooterComponent, ROUTER_DIRECTIVES, MagOverviewModule, NavLeftComponent, NavRightComponent, MagErrorModule],
    providers: [MagazineDataService],
})

@RouteConfig([
    new AsyncRoute({
        path: '/overview',
        loader: () => Promise.resolve(MagOverviewModule),
        name: 'PropertyOverview',
        useAsDefault: true,
    }),
    new AsyncRoute({
        path: '/neighborhood',
        loader: () => Promise.resolve(Neighborhood),
        name: 'Neighborhood'
    }),
    new AsyncRoute({
        path: '/recommendations',
        loader: () => Promise.resolve(Recommendations),
        name: 'Recommendations'
    }),
    new AsyncRoute({
        path: '/information',
        loader: () => Promise.resolve(KeyInformation),
        name: 'KeyInformation'
    }),
    new AsyncRoute({
        path: '/amenities',
        loader: () => Promise.resolve(Amenities),
        name: 'Amenities'
    }),
    new AsyncRoute({
        path: '/contact',
        loader: () => Promise.resolve(Contact),
        name: 'Contact',
    }),
    {
        path: '/**',
        redirectTo: ['PropertyOverview']
    }
])

export class MagazinePage {
    address:string;
    toc:any;
    magazineData:MagData;
    currentIndex:any;
    showErrorPage:boolean = false;

    getMagServiceData() {
        this._magazineDataService.getMagazineData(this.address)
            .subscribe(
                rawData => {
                    this.magazineData = rawData;
                    this.toc = this.buildToc(rawData);
                },
                err => {
                    this.showErrorPage = true;
                },
                () => this.showErrorPage = false
            );
    }

    buildToc(magazineData) {
        var toc:any = [];
        if (magazineData.overview != null) {
            toc.push({label: "Property Overview", routeName: "PropertyOverview"});
        }
        if (magazineData.neighborhood != null) {
            toc.push({label: "The Neighborhood", routeName: "Neighborhood"});
        }
        if (magazineData.recommendations != null && magazineData.recommendations.similar.length > 1) {
            toc.push({label: "Recommendations", routeName: "Recommendations"});
        }
        if (magazineData.info != null && magazineData.info.demographics != null && magazineData.info.schools != null) {
            toc.push({label: "Key Information", routeName: "KeyInformation"});
        }
        if (magazineData.amenities != null) {
            toc.push({label: "Amenities", routeName: "Amenities"});
        }
        if (magazineData.contact != null) {
            toc.push({label: "Contact Agent", routeName: "Contact"});
        }
        return toc;
    }

    buildNavigationElements() {
        this.currentIndex = jQuery("magtab-component>span>a.router-link-active").index();
        if (this.currentIndex < 1) {
            this.currentIndex = 0;
        }
        jQuery(".magheader_pagenum").html(this.currentIndex + 1);
        jQuery(".currentIndexFooter").html(this.currentIndex + 1);
    }

    constructor(private _params:RouteParams, private _magazineDataService:MagazineDataService, private _router:Router, private _location:Location) {
        this.address = _params.get('addr');
        this.getMagServiceData();
    }

    ngAfterViewChecked() {
        this.buildNavigationElements();
        //removes min-height that is used on joyfulHome page.
        jQuery('.page-wrapper').css('min-height', 0);
    }

}
