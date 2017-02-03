import {Component, Input}  from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";

@Component({
    selector: 'article-head-to-head-component',
    templateUrl: './app/components/articles/head-to-head-articles/head-to-head-articles.component.html',
    directives: [ROUTER_DIRECTIVES]
})

export class HeadToHeadComponent {
    @Input() league:any;
    @Input() rightColumnData:any;
    @Input() teamID:any;
}