import {Component} from '@angular/core';
import {Router, ROUTER_DIRECTIVES, RouteConfig, ROUTER_PROVIDERS} from "@angular/router-deprecated";

// import {WebApp} from "../app-layout/app.layout";
// import {MyWebApp} from "../app-layout/app.mylayout";
import {MyAppComponent} from "../app-webpage/app.mywebpage";
import {AppComponent} from "../app-webpage/app.webpage";

@Component({
    selector: 'app-domain',
    templateUrl: './app/app-domain/app.domain.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [ROUTER_PROVIDERS]
})

@RouteConfig([
    { path: '/...', name: "Webpage", component: AppComponent },
    // { path: '/:partner_id/', component: MyAppComponent },
])

export class AppDomain {
    constructor(private router: Router){
    }
}
