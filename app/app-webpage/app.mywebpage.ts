import {Component} from 'angular2/core';
import {RouteConfig, RouterOutlet, ROUTER_DIRECTIVES} from 'angular2/router';

import {AboutUsPage} from "../webpages/about-us-page/about-us.page";
import {ComponentPage} from "../webpages/component-page/component.page";

import {PartnerHeader} from "../global/global-service";

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

export class MyAppComponent {}
