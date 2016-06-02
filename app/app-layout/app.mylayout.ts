import {Component} from '@angular/core';
import {MyAppComponent} from "../app-webpage/app.mywebpage";
import {AppComponent} from "../app-webpage/app.webpage";
import {RouteConfig} from "@angular/router-deprecated";

@Component({
    selector: 'web-app',
    templateUrl: './app/app-layout/app.layout.html'
})

@RouteConfig([
    { path: '/...', name: "Layout", component: MyAppComponent }
    // {
    //    path: '/...',
    //    name: 'Webpages',
    //    component: MyAppComponent,
    //    useAsDefault: true
    // }
])

export class MyWebApp {
    constructor(){
        console.log("setting up MyWebApp");
        document.title = "Sample title";
    }
}
