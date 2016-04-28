import {Component, Input, OnInit}  from "angular2/core";
import {Articles} from "../../../global/global-service";
import {ArticleData} from "../../../global/global-interface";

declare var jQuery:any;

@Component({
    selector: 'article-head-to-head-component',
    templateUrl: './app/components/articles/head-to-head-articles/head-to-head-articles.component.html',
    directives: [],
    inputs: ['articleData', 'league'],
    providers: [Articles],
})

export class HeadToHeadComponent implements OnInit {
    articleData:any;
    randomArticles:any;
    arrLength:number;
    public league:boolean;

    constructor(private _magazineOverviewService:Articles) {
    }

    getRandomArticles() {
        var articleArr = [];
        jQuery.map(this.articleData[0], function (val, index) {
            switch (index) {
                case'startingLineUp':
                case'outfieldLF':
                case'outfieldCF':
                case'outfieldRF':
                case'infield3B':
                case'infieldSS':
                case'infield2B':
                case'infield1B':
                case'pitcher':
                case'catcher':
                    val['title'] = val[0].headline;
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
        this.randomArticles = articleArr;
    }

    getArticles() {
        this._magazineOverviewService.getArticles().then(data => {
            this.articleData = data;
            this.getRandomArticles();
        });
    }

    ngOnInit() {
        this.getArticles();
    }
}