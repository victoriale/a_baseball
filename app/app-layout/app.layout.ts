import {Component} from '@angular/core';
import {AppComponent} from "../app-webpage/app.webpage";

import {Router, ROUTER_DIRECTIVES} from '@angular/router';
import {RouteParams, RouteData, RouteConfig, RouterOutlet} from '@angular/router-deprecated';

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
    document.title = "Home Run Loyal";
  }
}
