import {Component, Input, OnInit} from 'angular2/core';
import {ArticleData} from "../../global/global-interface";
import {Articles} from "../../global/global-service";

@Component({
    selector: 'article-schedule-component',
    templateUrl: './app/components/article-schedule/article-schedule.component.html',
    styleUrls: ['./app/global/stylesheets/master.css'],
    directives: [],
    inputs: ['articleData', 'league'],
    providers: [Articles],
})

export class ArticleScheduleComponent implements OnInit {
    leftGradient: string;
    rightGradient: string;
    articleData: ArticleData[];
    defaultGradient: string;
    public league: boolean;

    constructor(private _magazineOverviewService:Articles) {

    }

    getArticles() {
        this._magazineOverviewService.getArticles().then(data => {
            this.articleData = data;
            this.getHomeBackgroundColor();
            this.getAwayBackgroundColor();
            console.log(this.articleData);
        });
    }

    getHomeBackgroundColor() {
        if (this.articleData[0].metaData[0].hex.homeColor != null && this.articleData[0].metaData[0].hex.awayColor != null) {
            let homeRedValue = this.hexToR(this.articleData[0].metaData[0].hex.homeColor);
            let homeGreenValue = this.hexToG(this.articleData[0].metaData[0].hex.homeColor);
            let homeBlueValue = this.hexToB(this.articleData[0].metaData[0].hex.homeColor);
            let leftGradientRgb = "rgb(" + homeRedValue + "," + homeGreenValue + "," + homeBlueValue + ")";
            let leftGradientRgba = "rgba(" + homeRedValue + "," + homeGreenValue + "," + homeBlueValue + ", 0)";
            this.leftGradient = this.leftGradient(leftGradientRgb, leftGradientRgba);
        } else {
            this.defaultGradient = 'default-gradient';
        }
    }

    getAwayBackgroundColor() {
        if (this.articleData[0].metaData[0].hex.homeColor != null && this.articleData[0].metaData[0].hex.awayColor != null) {
            let awayRedValue = this.hexToR(this.articleData[0].metaData[0].hex.awayColor);
            let awayGreenValue = this.hexToG(this.articleData[0].metaData[0].hex.awayColor);
            let awayBlueValue = this.hexToB(this.articleData[0].metaData[0].hex.awayColor);
            let rightGradientRgb = "rgb(" + awayRedValue + "," + awayGreenValue + "," + awayBlueValue + ")";
            let rightGradientRgba = "rgba(" + awayRedValue + "," + awayGreenValue + "," + awayBlueValue + ", 0)";
            this.rightGradient = this.rightGradient(rightGradientRgb, rightGradientRgba);
        } else {
            this.defaultGradient = 'default-gradient';
        }
    }

    hexToR(h) {
        return parseInt((this.cutHex(h)).substring(0, 2), 16)
    }

    hexToG(h) {
        return parseInt((this.cutHex(h)).substring(2, 4), 16)
    }

    hexToB(h) {
        return parseInt((this.cutHex(h)).substring(4, 6), 16)
    }

    cutHex(h) {
        return (h.charAt(0) == "#") ? h.substring(1, 7) : h
    }

    leftGradient = function (a, b) //loads the left gradient
    {
        var lgc1 = a; //replace with code to retrieve appropriate colors
        var lgc2 = b; //replace with code to retrieve appropriate colors
        var s = "background:-webkit-linear-gradient(0deg," + lgc1 + "," + lgc2 + ");";
        s += "background:-moz-linear-gradient(0deg," + lgc1 + "," + lgc2 + ");";
        s += "background:-o-linear-gradient(0deg," + lgc1 + "," + lgc2 + ");";
        s += "background:-ms-linear-gradient(0deg," + lgc1 + "," + lgc2 + ");";
        s += "background:linear-gradient(90deg," + lgc1 + "," + lgc2 + ");";
        return s;
    };

    rightGradient = function (a, b) //loads the right gradient
    {
        var rgc1 = a; //replace with code to retrieve appropriate colors
        var rgc2 = b; //replace with code to retrieve appropriate colors
        var s = "background:-webkit-linear-gradient(180deg," + rgc1 + "," + rgc2 + ");";
        s += "background:-moz-linear-gradient(180deg," + rgc1 + "," + rgc2 + ");";
        s += "background:-o-linear-gradient(180deg," + rgc1 + "," + rgc2 + ");";
        s += "background:-ms-linear-gradient(180deg," + rgc1 + "," + rgc2 + ");";
        s += "background:linear-gradient(-90deg," + rgc1 + "," + rgc2 + ");";
        return s;
    };

    ngOnInit() {
        console.log(this.league);
        this.getArticles();
    }
}