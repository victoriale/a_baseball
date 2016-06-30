import {Component} from '@angular/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';
import {Observable} from 'rxjs/Rx';
import {AppComponent} from "../app-webpage/app.webpage";
import {MyAppComponent} from "../app-webpage/app.mywebpage";

@Component({
    selector: 'app-domain',
    templateUrl: './app/app-domain/app.domain.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [Title]
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
            url => {
                var routeItems = url.split('/');                
                //Only scroll to top if the page isn't the directory.
                if ( routeItems[1] != "directory" ) {
                    window.scrollTo(0, 0);
                }
            }
        )
    }
}
