import {Component} from '@angular/core';
import {Router,ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {ShareLinksComponent} from "../shareLinks/shareLinks.component";
import {SanitizeHtml} from "../../../pipes/safe.pipe";
import {ResponsiveWidget} from '../../../components/responsive-widget/responsive-widget.component';

@Component({
    selector: 'syndicated-trending-component',
    templateUrl: './app/components/articles/syndicated-trending/syndicated-trending.component.html',
    directives: [ShareLinksComponent, ROUTER_DIRECTIVES, ResponsiveWidget],
    inputs: ['trendingData', 'trendingImages'],
    pipes: [SanitizeHtml],
})

export class SyndicatedTrendingComponent {
    trending:boolean = true;
    public widgetPlace: string = "widgetForPage";
}
