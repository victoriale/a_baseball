import {Component, OnInit} from 'angular2/core';
import {Articles} from "../../../global/global-service";
import {ArticleData} from "../../../global/global-interface";

declare var jQuery:any;

@Component({
    selector: 'recommendations-component',
    templateUrl: './app/components/articles/recommendations/recommendations.component.html',
    directives: [],
    inputs: ['articleData', 'league'],
    providers: [Articles],
})

export class RecommendationsComponent implements OnInit {
    articleData:ArticleData[];
    randomArticles:any;

    constructor(private _magazineOverviewService:Articles) {
    }

    getRandomArticles() {
        var articleArr = [];
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