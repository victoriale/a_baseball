import {Component, OnInit, Injector} from 'angular2/core';
import {RouteParams, Router, RouteData, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, LocationStrategy, RouterLink} from 'angular2/router';
import {AboutUsPage} from "../webpages/aboutus-page/aboutus.page";
import {ContactUsPage} from "../webpages/contactus-page/contactus.page";
import {DisclaimerPage} from "../webpages/disclaimer-page/disclaimer.page";
import {TeamPage} from "../webpages/team-page/team.page";
import {ComponentPage} from "../webpages/component-page/component.page";
import {ImagesTestPage} from "../webpages/images-test-page/images-test.page";
import {TablesTestPage} from "../webpages/tables-test-page/tables-test.page";
import {WebApp} from "../app-layout/app.layout";
import {GlobalFunctions} from "../global/global-functions";
import {ModulePage} from "../webpages/module-page/module.page";


@Component({
    selector: 'my-app',
    templateUrl: './app/app-webpage/app.webpage.html',

    directives: [TeamPage, AboutUsPage, ContactUsPage, DisclaimerPage, ComponentPage, ModulePage, RouterOutlet, ROUTER_DIRECTIVES],
    providers: [ ROUTER_DIRECTIVES],
})

@RouteConfig([
    {
      path: '/',
      name: 'Component-page',
      component: ComponentPage,
      useAsDefault: true
    },
    {
      path: '/team',
      name: 'Team-page',
      component: TeamPage,
    },
    {
      path: '/aboutus',
      name: 'Aboutus-page',
      component: AboutUsPage,
    },
    {
      path: '/contactus',
      name: 'Contactus-page',
      component: ContactUsPage,
    },
    {
      path: '/disclaimer',
      name: 'Disclaimer-page',
      component: DisclaimerPage,
    },
    {
      path: '/images-test',
      name: 'Images-test-page',
      component: ImagesTestPage,
    },
    {
      path: '/tables-test',
      name: 'Tables-test-page',
      component: TablesTestPage,
    },
    {
        path: '/modules',
        name: 'Module-page',
        component: ModulePage
    }
])

export class AppComponent implements OnInit {

    constructor(private _injector: Injector, private _params: RouteParams, private route: Router, private routeData: RouteData, private routerLink: RouterLink, private _globalFunctions: GlobalFunctions){
    }

    ngOnInit(){
    }
}
