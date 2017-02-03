import {Component, Input}  from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";

@Component({
    selector: 'article-main-component',
    templateUrl: './app/components/articles/main-article/main-article.component.html',
    directives: [ROUTER_DIRECTIVES]
})

export class ArticleMainComponent {
    @Input() mainArticleData:any;
    @Input() timeStamp:any;
}
