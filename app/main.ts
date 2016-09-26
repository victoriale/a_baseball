///<reference path="../typings/index.d.ts"/>

//For Seo Services and angular 2 services
import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {Title} from '@angular/platform-browser';
import {SeoService} from "./seo.service";

//import global local files
import {AppDomain} from './app-domain/app.domain';
import {GlobalFunctions} from './global/global-functions';
import {GlobalSettings} from './global/global-settings';
import {MLBGlobalFunctions} from './global/mlb-global-functions';
import {SearchService} from './services/search.service';
import {DraftHistoryService, MLBDraftHistoryService} from './services/draft-history.service'; //testing a proof of concept


// Needed for http map on observables
import 'rxjs/add/operator/map';
import {HTTP_PROVIDERS} from "@angular/http";
import {enableProdMode, provide} from '@angular/core';

// enable production mode and thus disable debugging information
if(GlobalSettings.isProd()) {
  enableProdMode();
}

bootstrap(AppDomain, [
    Title,
    SeoService,
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    ROUTER_DIRECTIVES,
    GlobalFunctions,
    MLBGlobalFunctions,
    SearchService,
    provide(DraftHistoryService, {useClass: MLBDraftHistoryService}),
    provide(Window, {useValue: window})
]).catch(err => console.error(err));
