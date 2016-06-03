import {Component, Input, OnInit} from 'angular2/core';
import {Articles} from "../../../global/global-service";
import {ArticleData} from "../../../global/global-interface";

@Component({
    selector: 'billboard-component',
    templateUrl: './app/components/articles/billboard/billboard.component.html',
    directives: [],
    inputs: [],
    providers: [Articles],
})

export class BillboardComponent implements OnInit {
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