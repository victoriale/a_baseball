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
import {GlobalFunctions} from '../../../global/global-functions';

declare var jQuery:any;

@Component({
    selector: 'Articles-history-page',
    templateUrl: './app/webpages/articles/about/about.page.html',
    directives: [WidgetModule, ROUTER_DIRECTIVES, ArticleImages, ShareLinksComponent, ArticleContentComponent, RecommendationsComponent, TrendingComponent, DisqusComponent],
    providers: [],
})

export class ArticlePageAbout implements OnInit {
    articleData:ArticleData;
    randomHeadlines:any;
    images:any;
    title:string;
    date:string;
    content:string;
    url:string;
    eventID:string;
    comment:string;
    singleLogo:boolean = false;
    pageIndex:string;
    public partnerParam:string;
    public partnerID:string;

    constructor(private _params:RouteParams, private _articleDataService:ArticleDataService, private _globalFunctions:GlobalFunctions) {
        window.scrollTo(0, 0);
        this.eventID = _params.get('eventID');
        this.getArticles();
    }

    getArticles() {
        this._articleDataService.getAboutTheTeamsData(this.eventID)
            .subscribe(
                ArticleData => {
                    this.articleData = ArticleData['about-the-teams'];
                    this.title = ArticleData['about-the-teams'].displayHeadline;
                    this.date = ArticleData['about-the-teams'].dateline;
                    this.comment = ArticleData['about-the-teams'].commentHeader;
                    this.url = window.location.href;
                    this.singleLogo = true;
                    ArticlePageAbout.setMetaTag(this.articleData.metaHeadline);
                }
            );
        this._articleDataService.getRecommendationsData(this.eventID)
            .subscribe(
                HeadlineData => {
                    this.pageIndex = "about-the-teams";
                    this.eventID = HeadlineData.event;
                    this.getRandomArticles(HeadlineData, this.pageIndex, this.eventID);
                }
            );
    }

    getRandomArticles(recommendations, pageIndex, eventID) {
        var recommendArr = [];
        var self = this;
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
                        val['pageIndex'] = self._globalFunctions.toTitleCase(index.toString());
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
                        val['title'] = val.displayHeadline;
                        val['pageIndex'] = self._globalFunctions.toTitleCase(index.toString());
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
        this.images = recommendations['images'].home;
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
