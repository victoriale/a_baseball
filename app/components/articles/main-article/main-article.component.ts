import {Component, Input, OnInit}  from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";

@Component({
    selector: 'article-main-component',
    templateUrl: './app/components/articles/main-article/main-article.component.html',
    directives: [ROUTER_DIRECTIVES]
})

export class ArticleMainComponent implements OnInit {
    @Input() mainArticleData:any;
    @Input() timeStamp:any;
    @Input() imgResize: number;
    ngOnInit() {
      if(this.mainArticleData){
        this.mainArticleData.mainImage += "&width=" + (this.imgResize ? this.imgResize : "300");
        this.mainArticleData.mainImage += this.imgResize && Number(this.imgResize) < 100 ? "&quality=90" : '';
      }
    }
}
