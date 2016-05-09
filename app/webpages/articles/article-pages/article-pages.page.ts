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
import {GlobalFunctions} from "../../../global/global-functions";

declare var jQuery:any;

@Component({
    selector: 'article-pages',
    templateUrl: './app/webpages/articles/article-pages/article-pages.page.html',
    directives: [WidgetModule, ROUTER_DIRECTIVES, ArticleImages, ShareLinksComponent, ArticleContentComponent, RecommendationsComponent, TrendingComponent, DisqusComponent],
    providers: [],
})

export class ArticlePages implements OnInit {
    articleData:ArticleData;
    randomHeadlines:any;
    images:any;
    eventID:string;
    eventType:string;
    title:string;
    date:string;
    content:string;
    url:string;
    comment:string;
    pageIndex:string;
    doubleLogo:boolean = false;
    articleType:string;
    articleSubType:string;
    public partnerParam:string;
    public partnerID:string;

    constructor(private _params:RouteParams, private _articleDataService:ArticleDataService, private _globalFunctions:GlobalFunctions) {
        window.scrollTo(0, 0);
        this.eventID = _params.get('eventID');
        this.eventType = _params.get('eventType');
        this.getArticles();
    }

    getArticles() {
        this.getArticleType();
        this._articleDataService.getArticleData(this.eventID, this.eventType)
            .subscribe(
                ArticleData => {
                    var pageIndex = Object.keys(ArticleData)[0];
                    this.articleData = ArticleData[pageIndex];
                    this.title = ArticleData[pageIndex].displayHeadline;
                    this.date = ArticleData[pageIndex].dateline;
                    this.comment = ArticleData[pageIndex].commentHeader;
                    this.url = window.location.href;
                    this.doubleLogo = true;
                    ArticlePages.setMetaTag(this.articleData.metaHeadline);
                }
            );
        this._articleDataService.getRecommendationsData(this.eventID)
            .subscribe(
                HeadlineData => {
                    this.pageIndex = this.eventType;
                    this.eventID = HeadlineData.event;
                    this.getRandomArticles(HeadlineData, this.pageIndex, this.eventID);
                }
            );
    }

    getRandomArticles(recommendations, pageIndex, eventID) {
        var recommendArr = [];
        jQuery.map(recommendations.leftColumn, function (val, index) {
            if (pageIndex != index) {
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
                        val['eventType'] = index;
                        val['eventID'] = eventID;
                        //val['photos'] = val[0].photos.url;
                        recommendArr.push(val);
                        break;
                }
            }
        });
        jQuery.map(recommendations.rightColumn, function (val, index) {
            if (pageIndex != index) {
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
                    case'outfield-most-putouts':
                    case'outfielder-most-hits':
                    case'outfield-most-home-runs':
                    case'infield-most-hits':
                    case'infield-most-home-runs':
                    case'infield-best-batting-average':
                    case'infield-most-putouts':
                        val['title'] = val.displayHeadline;
                        val['eventType'] = index;
                        val['eventID'] = eventID;
                        recommendArr.push(val);
                        break;
                }
            }
        });
        recommendArr.sort(function () {
            return 0.5 - Math.random()
        });
        this.randomHeadlines = recommendArr;
        this.images = recommendations['home'].images;
    }

    getArticleType() {
        switch (this.eventType) {
            case'about-the-teams':
                this.articleType = 'teamRecord';
                this.articleSubType = 'about';
                break;
            case'historical-team-statistics':
                this.articleType = 'teamRecord';
                this.articleSubType = 'history';
                break;
            case'last-matchup':
                this.articleType = 'teamRecord';
                this.articleSubType = 'last';
                break;
            case'starting-lineup-home':
            case'starting-lineup-away':
            case'injuries-home':
            case'injuries-away':
                this.articleType = 'playerRoster';
                break;
            case'pitcher-player-comparison':
            case'catcher-player-comparison':
            case'first-base-player-comparison':
            case'second-base-player-comparison':
            case'third-base-player-comparison':
            case'shortstop-player-comparison':
            case'left-field-player-comparison':
            case'center-field-player-comparison':
            case'right-field-player-comparison':
            case'outfield-most-putouts':
            case'outfielder-most-hits':
            case'outfield-most-home-runs':
            case'infield-most-hits':
            case'infield-most-home-runs':
            case'infield-best-batting-average':
            case'infield-most-putouts':
                this.articleType = 'playerComparison';
                break;
            case'pregame-report':
            case'third-inning-report':
            case'fifth-inning-report':
            case'Seventh-inning-stretch-report':
            case'postgame-report':
                this.articleType = 'gameReport';
                break;
        }
        return this.articleType;
    }

    static setMetaTag(metaData) {
        if (metaData !== null) {
            var metaTag = document.createElement('meta');
            metaTag.name = 'description';
            metaTag.content = metaData;
            document.head.appendChild(metaTag);
        }
    }

    ngOnInit() {
    }
}
