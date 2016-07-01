import {Component} from '@angular/core';
import {Router,ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {ShareLinksComponent} from "../shareLinks/shareLinks.component";

@Component({
    selector: 'trending-component',
    templateUrl: './app/components/articles/trending/trending.component.html',
    directives: [ShareLinksComponent, ROUTER_DIRECTIVES],
    inputs: ['trendingData', 'trendingImages'],
    providers: [],
})

export class TrendingComponent {
    trending:boolean=true;
}