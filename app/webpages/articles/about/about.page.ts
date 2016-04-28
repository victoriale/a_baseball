//import {Component, OnInit} from 'angular2/core';
//import {WidgetModule} from "../../../modules/widget/widget.module";
//import {Router,ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
//import {WebApp} from '../../../app-layout/app.layout';
//import {Articles} from "../../../global/global-service";
//import {ArticleData} from "../../../global/global-interface";
//import {Injector} from "angular2/core";
//import {ArticleDataService} from "../../../global/global-service";
//import {AboutDataAI} from "../../../global/global-interface";
//import {ShareLinksComponent} from "../../../components/articles/shareLinks/shareLinks.component";
//import {ArticleContentComponent} from "../../../components/articles/article-content/article-content.component";
//import {RecommendationsComponent} from "../../../components/articles/recommendations/recommendations.component";
//import {TrendingComponent} from "../../../components/articles/trending/trending.component";
//import {ArticleImages} from "../../../components/articles/carousel/carousel.component";
//
//@Component({
//    selector: 'Articles-history-page',
//    templateUrl: './app/webpages/articles/about/about.page.html',
//    directives: [WidgetModule, ROUTER_DIRECTIVES, ArticleImages, ShareLinksComponent, ArticleContentComponent, RecommendationsComponent, TrendingComponent],
//    providers: [],
//})
//
//export class ArticlePageAbout implements OnInit{
//    aboutDataAI:AboutDataAI[];
//    title: string;
//    date: string;
//    public partnerParam: string;
//    public partnerID: string;
//
//    constructor(private _injector:Injector, private _router: Router,  private _articleDataService:ArticleDataService) {
//        window.scrollTo(0, 0);
//    }
//
//    getArticles(){
//        this._articleDataService.getHistoryData()
//            .subscribe(
//                ArticleData => {
//                    this.aboutDataAI = ArticleData.about;
//                    console.log(ArticleData);
//                    //this.title = ArticleData['historical-team-statistics'].displayHeadline;
//                }
//            )
//    }
//
//    ngOnInit(){
//        this.getArticles();
//    }
//}
