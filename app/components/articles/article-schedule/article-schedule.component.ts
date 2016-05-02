import {Component, Input, OnInit } from "angular2/core";
import {Articles} from "../../../global/global-service";
import {ArticleData} from "../../../global/global-interface";

@Component({
    selector: 'article-schedule-component',
    templateUrl: './app/components/articles/article-schedule/article-schedule.component.html',
    directives: [],
    inputs: ['articleData', 'league'],
    providers: [Articles],
})

export class ArticleScheduleComponent implements OnInit {
    leftGrad:string;
    rightGrad:string;
    articleData:ArticleData[];
    defaultGradient:string;
    public league:boolean;

    constructor(private _magazineOverviewService:Articles) {

    }

    getArticles() {
        this._magazineOverviewService.getArticles().then(data => {
            this.articleData = data;
            this.getHomeBackgroundColor();
            this.getAwayBackgroundColor();
        });
    }

    getHomeBackgroundColor() {
        if (this.articleData[0].metaData[0].hex.homeColor != null && this.articleData[0].metaData[0].hex.awayColor != null) {
            let homeRedValue = ArticleScheduleComponent.hexToR(this.articleData[0].metaData[0].hex.homeColor);
            let homeGreenValue = ArticleScheduleComponent.hexToG(this.articleData[0].metaData[0].hex.homeColor);
            let homeBlueValue = ArticleScheduleComponent.hexToB(this.articleData[0].metaData[0].hex.homeColor);
            let leftGradientRgb = "rgb(" + homeRedValue + "," + homeGreenValue + "," + homeBlueValue + ")";
            let leftGradientRgba = "rgba(" + homeRedValue + "," + homeGreenValue + "," + homeBlueValue + ", 0)";
            this.leftGrad = this.leftGradient(leftGradientRgb, leftGradientRgba);
        } else {
            this.defaultGradient = 'default-gradient';
        }
    }

    getAwayBackgroundColor() {
        if (this.articleData[0].metaData[0].hex.homeColor != null && this.articleData[0].metaData[0].hex.awayColor != null) {
            let awayRedValue = ArticleScheduleComponent.hexToR(this.articleData[0].metaData[0].hex.awayColor);
            let awayGreenValue = ArticleScheduleComponent.hexToG(this.articleData[0].metaData[0].hex.awayColor);
            let awayBlueValue = ArticleScheduleComponent.hexToB(this.articleData[0].metaData[0].hex.awayColor);
            let rightGradientRgb = "rgb(" + awayRedValue + "," + awayGreenValue + "," + awayBlueValue + ")";
            let rightGradientRgba = "rgba(" + awayRedValue + "," + awayGreenValue + "," + awayBlueValue + ", 0)";
            this.rightGrad = this.rightGradient(rightGradientRgb, rightGradientRgba);
        } else {
            this.defaultGradient = 'default-gradient';
        }
    }

    //converts hex to RGB
    static hexToR(h) {
        return parseInt((ArticleScheduleComponent.cutHex(h)).substring(0, 2), 16)
    }

    static hexToG(h) {
        return parseInt((ArticleScheduleComponent.cutHex(h)).substring(2, 4), 16)
    }

    static hexToB(h) {
        return parseInt((ArticleScheduleComponent.cutHex(h)).substring(4, 6), 16)
    }

    static cutHex(h) {
        return (h.charAt(0) == "#") ? h.substring(1, 7) : h
    }

    //End conversion
    leftGradient = function (a, b) //loads the left gradient
    {
        var lgc1 = a; //replace with code to retrieve appropriate colors
        var lgc2 = b; //replace with code to retrieve appropriate colors
        return {
            '-ms-filter': "progid:DXImageTransform.Microsoft.gradient (0deg," + lgc1 + "," + lgc2 + ")",
            'background': "linear-gradient(90deg," + lgc1 + "," + lgc2 + ")"
        };
    };

    rightGradient = function (a, b) //loads the right gradient
    {
        var rgc1 = a; //replace with code to retrieve appropriate colors
        var rgc2 = b; //replace with code to retrieve appropriate colors
        return {
            '-ms-filter': "progid:DXImageTransform.Microsoft.gradient (180deg," + rgc1 + "," + rgc2 + ")",
            'background': "linear-gradient(-90deg," + rgc1 + "," + rgc2 + ")"
        };
    };

    ngOnInit() {
        this.getArticles();
    }
}