import {Component, Input, OnInit } from "angular2/core";
import {Articles} from "../../../global/global-service";
import {ArticleData} from "../../../global/global-interface";
import {CircleImage} from "../../images/circle-image";
import {CircleImageData} from '../../images/image-data';

@Component({
    selector: 'article-schedule-component',
    templateUrl: './app/components/articles/article-schedule/article-schedule.component.html',
    directives: [CircleImage],
    inputs: ['articleData', 'league', 'homeData', 'awayData'],
    providers: [Articles],
})

export class ArticleScheduleComponent implements OnInit {
    @Input() homeData:any;
    @Input() awayData:any;
    homeHex:string;
    awayHex:string;
    leftGrad:Object;
    rightGrad:Object;
    articleData:ArticleData[];
    defaultGradient:string;
    public league:boolean;

    constructor(private _magazineOverviewService:Articles) {

    }

    getArticles() {
        this._magazineOverviewService.getArticles().then(data => {
            this.articleData = data;
        });
    }

    getHomeBackgroundColor(homeHex) {
        if (homeHex != null) {
            let homeRedValue = ArticleScheduleComponent.hexToR(homeHex);
            let homeGreenValue = ArticleScheduleComponent.hexToG(homeHex);
            let homeBlueValue = ArticleScheduleComponent.hexToB(homeHex);
            let leftGradientRgb = "rgb(" + homeRedValue + "," + homeGreenValue + "," + homeBlueValue + ")";
            let leftGradientRgba = "rgba(" + homeRedValue + "," + homeGreenValue + "," + homeBlueValue + ", 0)";
            this.leftGrad = this.leftGradient(leftGradientRgb, leftGradientRgba);
        } else {
            this.defaultGradient = 'default-gradient';
        }
    }

    getAwayBackgroundColor(awayHex) {
        if (awayHex != null) {
            let awayRedValue = ArticleScheduleComponent.hexToR(awayHex);
            let awayGreenValue = ArticleScheduleComponent.hexToG(awayHex);
            let awayBlueValue = ArticleScheduleComponent.hexToB(awayHex);
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
    }

    ngOnChanges() {
        if (typeof this.homeData != 'undefined' && typeof this.awayData != 'undefined') {
            this.awayHex = this.awayData[0].awayHex;
            this.homeHex = this.homeData[0].homeHex;
            this.getHomeBackgroundColor(this.homeHex);
            this.getAwayBackgroundColor(this.awayHex);
        }
    }
}