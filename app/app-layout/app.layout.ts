import {Component} from '@angular/core';
import {AppComponent} from "../app-webpage/app.webpage";

import {RouteConfig, ROUTER_DIRECTIVES} from "@angular/router-deprecated";

@Component({
    selector: 'web-app',
    templateUrl: './app/app-layout/app.layout.html',
    directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
    { path: '/', component: AppComponent },
    { path: '/...', component: AppComponent },
    // {
    //    path: '/...',
    //    name: 'Webpages',
    //    component: MyAppComponent,
    //    useAsDefault: true
    // }
])

export class WebApp {
    constructor() {
        console.log("setting up WebApp");
        document.title = "Home Run Loyal dd";
    }
}
