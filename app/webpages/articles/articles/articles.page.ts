import {Component, OnInit} from 'angular2/core';
import {Router,ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {WidgetModule} from "../../../modules/widget/widget.module";
import {ArticleImages} from "../../../components/articles/carousel/carousel.component";
import {ShareLinksComponent} from "../../../components/articles/shareLinks/shareLinks.component";
import {ArticleContentComponent} from "../../../components/articles/article-content/article-content.component";
import {DisqusComponent} from "../../../components/articles/disqus/disqus.component";
import {RecommendationsComponent} from "../../../components/articles/recommendations/recommendations.component";
import {TrendingComponent} from "../../../components/articles/trending/trending.component";
import {Articles} from "../../../global/global-service";
import {ArticleData} from "../../../global/global-interface";

@Component({
    selector: 'Articles-page',
    templateUrl: './app/webpages/articles/articles/articles.page.html',
    directives: [WidgetModule, ROUTER_DIRECTIVES, ArticleImages, ShareLinksComponent, ArticleContentComponent, DisqusComponent, RecommendationsComponent, TrendingComponent],
    providers: [Articles],
})

export class ArticlePage implements OnInit{
    articleData: ArticleData[];
    title: string;
    date: string;
    public partnerParam: string;
    public partnerID: string;

    constructor(private _router: Router,  private _magazineOverviewService:Articles) {
        // Scroll page to top to fix routerLink bug
        this._router.root
            .subscribe(
                route => {
                    var curRoute = route;
                    var partnerID = curRoute.split('/');
                    if(partnerID[0] == ''){
                        this.partnerID = null;
                    }else{
                        this.partnerID = partnerID[0];
                    }
                }
            )//end of route subscribe
        window.scrollTo(0, 0);
    }

    getArticles(){
        this._magazineOverviewService.getArticles().then(data => {
            this.articleData = data;
            this.title = this.articleData[0].preGameReport[0].headline;
            this.date = this.articleData[0].preGameReport[0].date;
        });
    }

    ngOnInit(){
        this.getArticles();
    }
}
