import {Component, OnInit} from 'angular2/core';
import {WidgetModule} from "../../../modules/widget/widget.module";
import {Router,ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {WebApp} from '../../../app-layout/app.layout';
import {ArticleData} from "../../../global/global-interface";
import {ArticleDataService} from "../../../global/global-service";
import {ShareLinksComponent} from "../../../components/articles/shareLinks/shareLinks.component";
import {RecommendationsComponent} from "../../../components/articles/recommendations/recommendations.component";
import {TrendingComponent} from "../../../components/articles/trending/trending.component";
import {ArticleImages} from "../../../components/articles/carousel/carousel.component";
import {ArticleContentComponent} from "../../../components/articles/article-content/article-content.component";
import {DisqusComponent} from "../../../components/articles/disqus/disqus.component";

@Component({
    selector: 'Articles-postgame-page',
    templateUrl: './app/webpages/articles/postgame/postgame.page.html',
    directives: [WidgetModule, ROUTER_DIRECTIVES, ArticleImages, ShareLinksComponent, ArticleContentComponent, RecommendationsComponent, TrendingComponent, DisqusComponent],
    providers: [],
})

export class ArticlePagePostGame implements OnInit {
    articleData:ArticleData;
    eventID:string;
    title:string;
    date:string;
    content:string;
    url:string;
    comment:string;
    public partnerParam:string;
    public partnerID:string;

    constructor(private _params:RouteParams, private _articleDataService:ArticleDataService) {
        window.scrollTo(0, 0);
        this.eventID = _params.get('eventID');
        this.getArticles();
    }

    getArticles() {
        this._articleDataService.getPostGameData(this.eventID)
            .subscribe(
                ArticleData => {
                    this.articleData = ArticleData['postgame-report'];
                    this.title = ArticleData['postgame-report'].displayHeadline;
                    this.date = ArticleData['postgame-report'].dateline;
                    this.comment = ArticleData['postgame-report'].commentHeader;
                    this.url = window.location.href;
                }
            )
    }

    ngOnInit() {
    }
}
