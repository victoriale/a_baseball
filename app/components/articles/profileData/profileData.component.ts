import {Component, OnInit} from 'angular2/core';
import {Articles} from "../../../global/global-service";
import {ArticleData} from "../../../global/global-interface";

@Component({
    selector: 'profileData-component',
    templateUrl: './app/components/articles/profileData/profileData.component.html',
    directives: [],
    inputs: ['articleData'],
    providers: [Articles],
})

export class ProfileDataComponent implements OnInit {
    articleData:ArticleData[];

    constructor(private _magazineOverviewService:Articles) {
    }

    getArticles() {
        this._magazineOverviewService.getArticles().then(data => {
            this.articleData = data;
        });
    }

    ngOnInit() {
        this.getArticles();
    }
}