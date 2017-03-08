import {Component, Input} from '@angular/core';
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";
declare var jQuery:any;

@Component({
    selector: 'article-sub-component',
    templateUrl: './app/components/articles/sub-article/sub-article.component.html',
    styleUrls: ['./app/global/stylesheets/master.css'],
    directives: [ROUTER_DIRECTIVES]
})

export class ArticleSubComponent {
    @Input() league:any;
    @Input() leagueData:any;
    @Input() leftColumnData:any;
    @Input() teamID:any;
    @Input() imgResize: number;
}
