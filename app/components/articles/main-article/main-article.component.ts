import {Component, Input}  from "angular2/core";
import {ROUTER_DIRECTIVES} from "angular2/router";

@Component({
    selector: 'article-main-component',
    templateUrl: './app/components/articles/main-article/main-article.component.html',
    directives: [ROUTER_DIRECTIVES],
    inputs: ['mainTitle', 'mainContent', 'titleFontSize', 'images', 'eventType', 'mainEventID']
})

export class ArticleMainComponent {
}