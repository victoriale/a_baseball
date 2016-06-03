import {Component} from '@angular/core';
import {AppComponent} from "../app-webpage/app.webpage";

import {RouteConfig, ROUTER_DIRECTIVES} from "@angular/router-deprecated";

@Component({
    selector: 'web-app',
    templateUrl: './app/app-layout/app.layout.html',
    directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
    { path: '/...', name: "Layout", component: AppComponent }
])

export class WebApp {
    constructor() {
        document.title = "Home Run Loyal";
    }
}
