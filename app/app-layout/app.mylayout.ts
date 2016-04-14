import {Component} from 'angular2/core';
import {MyAppComponent} from "../app-webpage/app.mywebpage";
import {MagazinePage} from "../app-webpage/magazine.webpage";

import {RouteParams, Router, RouteData, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, LocationStrategy} from 'angular2/router';

@Component({
    selector: 'web-app',
    templateUrl: './app/app-layout/app.layout.html',
    
    directives: [MagazinePage, MyAppComponent,RouterOutlet, ROUTER_DIRECTIVES],
    providers: [],
})

@RouteConfig([
    {
       path: '/...',
       name: 'Webpages',
       component: MyAppComponent,
       useAsDefault: true
    },
    {
      path: '/magazine/:addr/...',
      name: 'Magazine',
      component: MagazinePage
    },
])

export class MyWebApp {

  public partnerID: string;

  address:string = '1324-N-Manchester-CT-Wichita-KS';
  camelCaseToRegularCase(str){// GRABBED FROM GLOBAL FUNCTION app/global/global-functions.ts
      str = str
          .replace(/([A-Z][a-z]+)/g, " $1")
          .replace(/([A-Z][A-Z]+)/g, " $1")
          .replace(/([^A-Za-z ]+)/g, " $1")
          // uppercase the first character
          .replace(/^./, function(str){ return str.toUpperCase(); })
      return str;
  }
  constructor(private _params: RouteParams){
    this.partnerID = this._params.get('partner_id');
    var partnerID = this.camelCaseToRegularCase(this.partnerID.replace('-',' '));
    document.title = "MyHousekit "+ partnerID;

  }
}
