import {Component, Input, OnInit} from 'angular2/core';
import {ArticleScheduleComponent} from "../../components/articles/article-schedule/article-schedule.component";
import {Articles} from "../../global/global-service";
import {ArticleMainComponent} from "../../components/articles/main-article/main-article.component";
import {ArticleSubComponent} from "../../components/articles/sub-article/sub-article.component";
import {HeadToHeadComponent} from "../../components/articles/head-to-head-articles/head-to-head-articles.component";
import {ModuleHeader} from "../../components/module-header/module-header.component";
import {HeadlineData} from "../../global/global-interface";
import {GlobalFunctions} from '../../global/global-functions';
import {HeadlineDataService} from "../../global/global-ai-headline-module-service";
import {RouteParams} from "angular2/router";
import {ROUTER_DIRECTIVES} from "angular2/router";

declare var jQuery:any;

@Component({
    selector: 'articles-module',
    templateUrl: './app/modules/articles/articles.module.html',
    directives: [ModuleHeader, ROUTER_DIRECTIVES, ArticleScheduleComponent, ArticleMainComponent, ArticleSubComponent, HeadToHeadComponent],
    inputs: [],
    providers: [Articles],
})

export class ArticlesModule implements OnInit {
    headlineData:HeadlineData;
    imageData:any;
    leftColumnData:any;
    headToHeadData:any;
    randomLeftColumn:any;
    randomHeadToHead:any;
    mainTitle:string;
    titleFontSize:string;
    mainContent:string;
    images:any;
    teamID:string;
    eventID:number;
    eventType:string;
    mainEventID:number;
    arrLength:number;
    league:boolean = false;

    constructor(private _params:RouteParams, private _headlineDataService:HeadlineDataService, private _globalFunctions:GlobalFunctions) {
        window.scrollTo(0, 0);
        this.teamID = _params.get('teamID');
        this.getArticles();
    }

    getArticles() {
        this._headlineDataService.getAiHeadlineData(this.teamID)
            .subscribe(
                HeadlineData => {
                    this.headlineData = HeadlineData['featuredReport'];
                    this.leftColumnData = HeadlineData['leftColumn'];
                    this.headToHeadData = HeadlineData['rightColumn'];
                    this.imageData = HeadlineData['home'].images[0];
                    this.eventID = HeadlineData.event;
                    this.getMainArticle(this.headlineData, this.imageData, this.eventID);
                    this.getLeftColumnArticles(this.leftColumnData, this.imageData, this.eventID);
                    this.getHeadToHeadArticles(this.headToHeadData, this.eventID);
                }
            )
    }

    getMainArticle(headlineData, imageData, eventID) {
        var pageIndex = Object.keys(headlineData)[0];
        headlineData = headlineData[Object.keys(headlineData)[0]];
        this.mainTitle = headlineData.displayHeadline;
        if (this.mainTitle.length >= 85) {
            this.titleFontSize = "font-size: 16px;";
        }
        this.eventType = pageIndex;
        this.mainEventID = eventID;
        var articleContent = headlineData.article[0];
        var maxLength = 240;
        var trimmedArticle = articleContent.substring(0, maxLength);
        this.mainContent = trimmedArticle.substr(0, Math.min(trimmedArticle.length, trimmedArticle.lastIndexOf(" ")));
        this.images = imageData;
    }

    getLeftColumnArticles(leftColumnData, imageData, eventID) {
        var articleArr = [];
        var self = this;
        jQuery.map(leftColumnData, function (val, index) {
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
                    articleArr.push(val);
                    break;
            }
        });
        articleArr.sort(function () {
            return 0.5 - Math.random()
        });
        this.randomLeftColumn = articleArr;
        this.images = imageData;
    }

    getHeadToHeadArticles(headToHeadData, eventID) {
        var articleArr = [];
        var self = this;
        jQuery.map(headToHeadData, function (val, index) {
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
                    articleArr.push(val);
                    break;
            }
        });
        articleArr.sort(function () {
            return 0.5 - Math.random()
        });
        if (articleArr.length == 10) {
            articleArr.shift();
            articleArr.pop();
        } else if (articleArr.length == 9) {
            articleArr.pop();
        }
        this.arrLength = articleArr.length - 1;
        this.randomHeadToHead = articleArr;
    }

    ngOnInit() {
    }
}