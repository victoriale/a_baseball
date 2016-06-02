import {bootstrap} from '@angular/platform-browser-dynamic';
import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES} from "@angular/router-deprecated";
import {AppDomain} from './app-domain/app.domain';
import {GlobalFunctions} from './global/global-functions';
import {MLBGlobalFunctions} from './global/mlb-global-functions';
import {WebApp} from "./app-layout/app.layout";
import {MyWebApp} from "./app-layout/app.mylayout";
import {SearchService} from './services/search.service';
import {provide} from "@angular/core";
// Needed for http map on observables
import 'rxjs/add/operator/map';
import {HTTP_PROVIDERS} from "@angular/http";

bootstrap(AppDomain,[ROUTER_PROVIDERS, HTTP_PROVIDERS, ROUTER_DIRECTIVES, GlobalFunctions, MLBGlobalFunctions, MyWebApp,WebApp, SearchService])
  .catch(err => console.error(err));
