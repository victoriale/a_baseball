import {Component} from 'angular2/core';
import {AppComponent} from "../app-webpage/app.webpage";

import {RouteParams, Router, RouteData, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, LocationStrategy} from 'angular2/router';

@Component({
    selector: 'web-app',
    templateUrl: './app/app-layout/app.layout.html',

    directives: [AppComponent,RouterOutlet, ROUTER_DIRECTIVES],
    providers: [],
})

@RouteConfig([
    {
       path: '/...',
       name: 'Webpages',
       component: AppComponent,
       useAsDefault:true
    }
])

export class WebApp {
  constructor(private _params: RouteParams){
    document.title = "HomeRunLoyal";
  }
}
