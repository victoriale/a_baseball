import {Component} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Observable} from 'rxjs/Rx';
import {AppComponent} from "../app-webpage/app.webpage";
import {MyAppComponent} from "../app-webpage/app.mywebpage";

@Component({
    selector: 'app-domain',
    templateUrl: './app/app-domain/app.domain.html',
    directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
    {
        path: '/...',
        name: 'Default-home',
        component: AppComponent,
        useAsDefault: true
    },
    {
        path: '/:partner_id/...',
        name: 'Partner-home',
        component: MyAppComponent,
    },
])

export class AppDomain {
    constructor(private _router: Router) {
        this._router.root.subscribe (
            route => {
                console.log("app domain root subscribe");
                var routeItems = route.split('/');                
                //Only scroll to top if the page isn't the directory.
                if ( routeItems[1] != "directory" ) {
                    window.scrollTo(0, 0);
                }
            }
        )
    }
}
