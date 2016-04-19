import {Component, OnInit, Injector} from 'angular2/core';
import {RouteParams, Router, RouteData, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, LocationStrategy, RouterLink} from 'angular2/router';
import {AboutUsPage} from "../webpages/aboutus-page/aboutus.page";
import {ComponentPage} from "../webpages/component-page/component.page";
import {WebApp} from "../app-layout/app.layout";
import {GlobalFunctions} from "../global/global-functions";


@Component({
    selector: 'my-app',
    templateUrl: './app/app-webpage/app.webpage.html',

    directives: [AboutUsPage, ComponentPage, RouterOutlet,ROUTER_DIRECTIVES],
    providers: [ ROUTER_DIRECTIVES],
})

@RouteConfig([
    {
      path: '/',
      name: 'Aboutus-page',
      component: AboutUsPage,
      useAsDefault: true
    },
    {
      path: '/component-page',
      name: 'Component-page',
      component: ComponentPage,
    }
])

export class AppComponent implements OnInit {

    constructor(private _injector: Injector, private _params: RouteParams, private route: Router, private routeData: RouteData, private routerLink: RouterLink, private _globalFunctions: GlobalFunctions){
    }

    ngOnInit(){
    }
}
