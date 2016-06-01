import {Component} from '@angular/core';
import {MyAppComponent} from "../app-webpage/app.mywebpage";

import {Router, ROUTER_DIRECTIVES} from '@angular/router';
import {RouteParams, RouteData, RouteConfig, RouterOutlet} from '@angular/router-deprecated';

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
