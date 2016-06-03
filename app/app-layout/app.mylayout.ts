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
])

export class MyWebApp {
    constructor(){
        document.title = "Home Run Loyal";
    }
}
