import {Component, Input, OnInit} from 'angular2/core';
import {Articles} from "../../global/global-service";
import {ArticleData} from "../../global/global-interface";

declare var jQuery:any;

@Component({
    selector: 'article-sub-component',
    templateUrl: './app/components/sub-article/sub-article.component.html',
    styleUrls: ['./app/global/stylesheets/master.css'],
    directives: [],
    inputs: ['articleData', 'league'],
    providers: [Articles],
})

export class ArticleSubComponent {
    articleData:ArticleData[];
    randomArticles:any;
    public league: boolean;

    constructor(private _magazineOverviewService:Articles) {
    }

    getRandomArticles() {
        var articleArr = [];
        if (this.league) {
            jQuery.map(this.articleData[0], function (val, index) {
                switch (index) {
                    case'aboutTheTeams':
                    case'historicalTeamStats':
                    case'lastMatchUp':
                    case'outfieldLF':
                    case'outfieldCF':
                    case'outfieldRF':
                    case'infield3B':
                    case'infieldSS':
                    case'infield2B':
                    case'infield1B':
                    case'pitcher':
                    case'catcher':
                    case'homeTeamInjuryReport':
                    case'awayTeamInjuryReport':
                    case'homeTeamStartingLineUp':
                    case'awayTeamStartingLineUp':
                        val['title'] = val[0].headline;
                        val['photos'] = val[0].photos.url;
                        articleArr.push(val);
                        break;
                }
            });
        }
        if (!this.league) {
            jQuery.map(this.articleData[0], function (val, index) {
                switch (index) {
                    case'aboutTheTeams':
                    case'historicalTeamStats':
                    case'lastMatchUp':
                    case'homeTeamInjuryReport':
                    case'awayTeamInjuryReport':
                    case'homeTeamStartingLineUp':
                    case'awayTeamStartingLineUp':
                        val['title'] = val[0].headline;
                        val['photos'] = val[0].photos.url;
                        articleArr.push(val);
                        break;
                }
            });
        }
        articleArr.sort(function () {
            return 0.5 - Math.random()
        });
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