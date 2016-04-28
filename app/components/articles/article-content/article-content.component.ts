import {Component, Input, OnInit} from 'angular2/core';
import {Articles} from "../../../global/global-service";
import {ArticleData} from "../../../global/global-interface";
import {ProfileDataComponent} from "../profileData/profileData.component";
import {BillboardComponent} from "../billboard/billboard.component";

@Component({
    selector: 'article-content-component',
    templateUrl: './app/components/articles/article-content/article-content.component.html',
    directives: [ProfileDataComponent, BillboardComponent],
    inputs: [],
    providers: [Articles],
})

export class ArticleContentComponent implements OnInit {
    articleData:any;

    constructor(private _magazineOverviewService:Articles) {
    }

    getArticles() {
        this._magazineOverviewService.getArticles().then(data => {
            this.articleData = data[0].preGameReport[0].content;
        });
    }

    ngOnInit() {
        this.getArticles();
    }
}