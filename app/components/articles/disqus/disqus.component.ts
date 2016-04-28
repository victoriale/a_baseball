import {Component, OnInit} from 'angular2/core';
import {Articles} from "../../../global/global-service";
import {ArticleData} from "../../../global/global-interface";

@Component({
    selector: 'disqus-component',
    templateUrl: './app/components/articles/disqus/disqus.component.html',
    directives: [],
})

export class DisqusComponent implements OnInit {
    title:any;

    constructor(private _magazineOverviewService:Articles) {
    }

    getArticles() {
        this._magazineOverviewService.getArticles().then(data => {
            this.title = data[0].preGameReport[0].headline;
        });
    }

    ngOnInit() {
        this.getArticles();
    }
}