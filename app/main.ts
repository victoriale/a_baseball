///<reference path="../node_modules/angular2/typings/browser.d.ts"/>
///<reference path="../node_modules/angular2/typings/es6-promise/es6-promise.d.ts"/>

import {bootstrap}    from 'angular2/platform/browser'
import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES} from 'angular2/router'
import {AppDomain} from './app-domain/app.domain'
import {GlobalFunctions} from './global/global-functions'
import {WebApp} from "./app-layout/app.layout";
import {MyWebApp} from "./app-layout/app.mylayout";
import {provide} from "angular2/core"
// Needed for http map on observables
import 'rxjs/add/operator/map';
import {HTTP_PROVIDERS} from "angular2/http";
bootstrap(AppDomain,[ROUTER_PROVIDERS, HTTP_PROVIDERS, ROUTER_DIRECTIVES, GlobalFunctions,MyWebApp,WebApp]);
