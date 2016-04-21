import {Component, Input, OnInit} from 'angular2/core';
import {Articles} from "../../global/global-service";
import {ArticleData} from "../../global/global-interface";

@Component({
    selector: 'article-main-component',
    templateUrl: './app/components/main-article/main-article.component.html',
    directives: [],
    inputs: ['articleData'],
    providers: [Articles],
})

export class ArticleMainComponent implements OnInit {
    articleData:ArticleData[];
    headline:string;
    image:string;
    content:string;

    constructor(private _magazineOverviewService:Articles) {

    }

    getArticles() {
        this._magazineOverviewService.getArticles().then(data => {
            this.articleData = data;
            this.getData();
        });
    }

    getData() {
        if (this.articleData[0].postGameReport[0].status == true) {
            this.headline = this.articleData[0].postGameReport[0].headline;
            this.content = this.articleData[0].postGameReport[0].content;
            this.image = this.articleData[0].postGameReport[0].photos.url;
        } else if (this.articleData[0].inningReport7[0].status == true) {
            this.headline = this.articleData[0].inningReport7[0].headline;
            this.content = this.articleData[0].inningReport7[0].content;
            this.image = this.articleData[0].inningReport7[0].photos.url;
        } else if (this.articleData[0].inningReport5[0].status == true) {
            this.headline = this.articleData[0].inningReport5[0].headline;
            this.content = this.articleData[0].inningReport5[0].content;
            this.image = this.articleData[0].inningReport5[0].photos.url;
        } else if (this.articleData[0].inningReport3[0].status == true) {
            this.headline = this.articleData[0].inningReport3[0].headline;
            this.content = this.articleData[0].inningReport3[0].content;
            this.image = this.articleData[0].inningReport3[0].photos.url;
        } else if (this.articleData[0].preGameReport[0].status == true) {
            this.headline = this.articleData[0].preGameReport[0].headline;
            this.content = this.articleData[0].preGameReport[0].content;
            this.image = this.articleData[0].preGameReport[0].photos.url;
        }
        var articleContent = this.content[0];
        var maxLength = 240;
        var trimmedArticle = articleContent.substring(0, maxLength);
        this.content = trimmedArticle.substr(0, Math.min(trimmedArticle.length, trimmedArticle.lastIndexOf(" ")));
    }

    ngOnInit() {
        this.getArticles();
    }
}