import {Component, OnInit} from 'angular2/core';
import {WidgetModule} from "../../../modules/widget/widget.module";
import {Router,ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {WebApp} from '../../../app-layout/app.layout';
import {ArticleData} from "../../../global/global-interface";
import {ShareLinksComponent} from "../../../components/articles/shareLinks/shareLinks.component";
import {RecommendationsComponent} from "../../../components/articles/recommendations/recommendations.component";
import {TrendingComponent} from "../../../components/articles/trending/trending.component";
import {ArticleImages} from "../../../components/articles/carousel/carousel.component";
import {ArticleContentComponent} from "../../../components/articles/article-content/article-content.component";
import {DisqusComponent} from "../../../components/articles/disqus/disqus.component";
import {ArticleDataService} from "../../../global/global-article-page-service";

declare var jQuery:any;

@Component({
    selector: 'Articles-pregame-page',
    templateUrl: './app/webpages/articles/pregame/pregame.page.html',
    directives: [WidgetModule, ROUTER_DIRECTIVES, ArticleImages, ShareLinksComponent, ArticleContentComponent, RecommendationsComponent, TrendingComponent, DisqusComponent],
    providers: [],
})

export class ArticlePagePreGame implements OnInit {
    articleData:ArticleData;
    randomHeadlines:any;
    images:any;
    eventID:string;
    title:string;
    date:string;
    content:string;
    url:string;
    comment:string;
    pageIndex:string;
    public partnerParam:string;
    public partnerID:string;

    constructor(private _params:RouteParams, private _articleDataService:ArticleDataService) {
        window.scrollTo(0, 0);
        this.eventID = _params.get('eventID');
        this.getArticles();
    }

    getArticles() {
        this._articleDataService.getPreGameData(this.eventID)
            .subscribe(
                ArticleData => {
                    this.articleData = ArticleData['pregame-report'];
                    this.title = ArticleData['pregame-report'].displayHeadline;
                    this.date = ArticleData['pregame-report'].dateline;
                    this.comment = ArticleData['pregame-report'].commentHeader;
                    this.url = window.location.href;
                    ArticlePagePreGame.setMetaTag(this.articleData.metaHeadline);
                }
            );
        this._articleDataService.getRecommendationsData(this.eventID)
            .subscribe(
                HeadlineData => {
                    this.getRandomArticles(HeadlineData);
                }
            );
    }

    getRandomArticles(recommendations){
        var recommendArr = [];
        jQuery.map(recommendations.leftColumn, function (val, index) {
            switch (index) {
                case'about-the-teams':
                case'historical-team-statistics':
                case'last-matchUp':
                case'starting-lineup-home':
                case'starting-lineup-away':
                case'injuries-home':
                case'injuries-away':
                case'upcoming-game':
                    val['title'] = val.displayHeadline;
                    //val['photos'] = val[0].photos.url;
                    recommendArr.push(val);
                    break;
            }
        });
        jQuery.map(recommendations.rightColumn, function (val, index) {
            switch (index) {
                case'pitcher-player-comparison':
                case'catcher-player-comparison':
                case'first-base-player-comparison':
                case'second-base-player-comparison':
                case'third-base-player-comparison':
                case'shortstop-player-comparison':
                case'left-field-player-comparison':
                case'center-field-player-comparison':
                case'right-field-player-comparison':
                    val['title'] = val.displayHeadline;
                    recommendArr.push(val);
                    break;
            }
        });
        recommendArr.sort(function () {
            return 0.5 - Math.random()
        });
        this.randomHeadlines = recommendArr;
        this.images = recommendations['images'].home;
    }

    static setMetaTag(metaData){
        if (metaData !== null){
            var metaTag = document.createElement('meta');
            metaTag.name = 'description';
            metaTag.content = metaData;
            document.head.appendChild(metaTag);
        }
    }

    ngOnInit() {
    }
}
