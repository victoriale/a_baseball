import {Component, Input}  from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";

@Component({
    selector: 'article-main-component',
    templateUrl: './app/components/articles/main-article/main-article.component.html',
    directives: [ROUTER_DIRECTIVES],
    inputs: ['mainTitle', 'mainContent', 'titleFontSize', 'mainImage', 'eventType', 'mainEventID']
})

export class ArticleMainComponent {
}