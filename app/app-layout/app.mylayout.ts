import {Component} from 'angular2/core';
import {MyAppComponent} from "../app-webpage/app.mywebpage";

import {RouteParams, Router, RouteData, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, LocationStrategy} from 'angular2/router';

@Component({
    selector: 'web-app',
    templateUrl: './app/app-layout/app.layout.html',

    directives: [MyAppComponent,RouterOutlet, ROUTER_DIRECTIVES],
    providers: [],
})

@RouteConfig([
    {
       path: '/...',
       name: 'Webpages',
       component: MyAppComponent,
       useAsDefault: true
    }
])

export class MyWebApp {

}
