import {Component, Input, OnInit} from 'angular2/core';
import {ArticleScheduleComponent} from "../../components/articles/article-schedule/article-schedule.component";
import {Articles} from "../../global/global-service";
import {ArticleData} from "../../global/global-interface";
import {ArticleMainComponent} from "../../components/articles/main-article/main-article.component";
import {ArticleSubComponent} from "../../components/sub-article/sub-article.component";
import {HeadToHeadComponent} from "../../components/articles/head-to-head-articles/head-to-head-articles.component";
import {ModuleHeader} from "../../components/module-header/module-header.component";

@Component({
    selector: 'articles-module',
    templateUrl: './app/modules/articles/articles.module.html',
    directives: [ModuleHeader, ArticleScheduleComponent, ArticleMainComponent, ArticleSubComponent, HeadToHeadComponent],
    inputs: [],
    providers: [Articles],
})

export class ArticlesModule implements OnInit {
    articleData:ArticleData[];
    league:boolean = false;

    constructor(private _magazineOverviewService:Articles) {
    }

    getArticles() {
        this._magazineOverviewService.getArticles().then(data => {
            this.articleData = data;
        });
        this.league = false;
    }

    ngOnInit() {
        this.getArticles();
    }
}