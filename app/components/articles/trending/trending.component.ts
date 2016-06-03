import {Component, OnInit} from '@angular/core';
import {Articles} from "../../../global/global-service";
import {ArticleData} from "../../../global/global-interface";
import {ShareLinksComponent} from "../shareLinks/shareLinks.component";
import {PaginationFooter} from "../../pagination-footer/pagination-footer.component";

declare var jQuery:any;

@Component({
    selector: 'trending-component',
    templateUrl: './app/components/articles/trending/trending.component.html',
    directives: [ShareLinksComponent, PaginationFooter],
    inputs: ['articleData', 'league'],
    providers: [Articles],
})

export class TrendingComponent implements OnInit {
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
                    val['date'] = val[0].date;
                    val['content'] = val[0].content[0];
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