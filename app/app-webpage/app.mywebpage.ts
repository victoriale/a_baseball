import {Component, OnInit, Injector} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, } from "@angular/router-deprecated";
import {RouteParams, RouteData, RouteConfig, RouterOutlet, RouterLink} from '@angular/router-deprecated';
// import {ListPage} from "../webpages/list-page/list.page";
// import {ListOfListsPage} from "../webpages/list-of-lists-page/list-of-lists.page";
import {AboutUsPage} from "../webpages/about-us-page/about-us.page";
import {ComponentPage} from "../webpages/component-page/component.page";

// import {ErrorPage} from "../webpages/error-page/error-page.page";
// import {ContactUsPage} from "../webpages/contactus-page/contactus.page";
// import {DisclaimerPage} from "../webpages/disclaimer-page/disclaimer.page";
// import {SearchPage} from "../webpages/search-page/search.page";
// import {DynamicListPage} from "../webpages/dynamic-list-page/dynamic-list.page";

import {MyWebApp} from "../app-layout/app.mylayout";
import {PartnerHeader} from "../global/global-service";
import {GlobalFunctions} from "../global/global-functions";

@Component({
    selector: 'my-house',
    templateUrl: './app/app-webpage/app.webpage.html',

    directives: [RouterOutlet, ComponentPage, ROUTER_DIRECTIVES],
    providers: [],
})

@RouteConfig([
    {
        path: '/',
        name: 'About-us-page',
        component: AboutUsPage,
        useAsDefault: true
    }
])

export class MyAppComponent implements OnInit {

    // address: string = "503-C-Avenue-Vinton-IA";
    nearByCities: Object;

    constructor(private _injector: Injector, private _params: RouteParams, private route: Router, private routeData: RouteData, private routerLink: RouterLink, private _globalFunctions: GlobalFunctions){
      }

    ngOnInit(){
        // Call to get current State and City
    }
}
