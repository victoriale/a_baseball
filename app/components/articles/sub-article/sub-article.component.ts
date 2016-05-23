import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from "angular2/router";
declare var jQuery:any;

@Component({
    selector: 'article-sub-component',
    templateUrl: './app/components/articles/sub-article/sub-article.component.html',
    styleUrls: ['./app/global/stylesheets/master.css'],
    directives: [ROUTER_DIRECTIVES],
    inputs: ['randomLeftColumn', 'league', 'teamID'],
})

export class ArticleSubComponent {
}