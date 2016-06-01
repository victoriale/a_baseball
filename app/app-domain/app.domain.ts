import {Component} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';
import {RouteData, RouteConfig} from '@angular/router-deprecated';

import {WebApp} from "../app-layout/app.layout";
import {MyWebApp} from "../app-layout/app.mylayout";

@Component({
    selector: 'app-domain',
    templateUrl: './app/app-domain/app.domain.html',
    directives: [MyWebApp, WebApp, ROUTER_DIRECTIVES],
    providers: []
})

@RouteConfig([
    {
        path: '/...',
        name: 'Default-home',
        component: WebApp,
        useAsDefault: true
    },
    // {
    //     path: '/:partner_id/...',
    //     name: 'Partner-home',
    //     component: MyWebApp,
    // },
])

export class AppDomain {
    // cityStateLocation: string = "WICHITA_KS";
    constructor(){
        //console.log(window.location);
    }
}
