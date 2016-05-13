import {Component, Input, OnInit } from "angular2/core";
import {Articles} from "../../../global/global-service";
import {ArticleData} from "../../../global/global-interface";
import {CircleImage} from "../../images/circle-image";
import {CircleImageData} from '../../images/image-data';
import {ROUTER_DIRECTIVES} from "angular2/router";

@Component({
    selector: 'article-schedule-component',
    templateUrl: './app/components/articles/article-schedule/article-schedule.component.html',
    directives: [CircleImage, ROUTER_DIRECTIVES],
    inputs: ['articleData', 'league', 'homeData', 'awayData'],
    providers: [Articles],
})

export class ArticleScheduleComponent implements OnInit {
    @Input() homeData:any;
    @Input() awayData:any;
    homeHex:string;
    awayHex:string;
    gradient:Object;
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

    getGradient(homeHex, awayHex) {
        if (homeHex != null && awayHex != null) {
            let homeRedValue = ArticleScheduleComponent.hexToR(homeHex);
            let homeGreenValue = ArticleScheduleComponent.hexToG(homeHex);
            let homeBlueValue = ArticleScheduleComponent.hexToB(homeHex);
            let leftGradientRgba = "rgba(" + homeRedValue + "," + homeGreenValue + "," + homeBlueValue + ", 0.75) 0%";
            let awayRedValue = ArticleScheduleComponent.hexToR(awayHex);
            let awayGreenValue = ArticleScheduleComponent.hexToG(awayHex);
            let awayBlueValue = ArticleScheduleComponent.hexToB(awayHex);
            let rightGradientRgba = "rgba(" + awayRedValue + "," + awayGreenValue + "," + awayBlueValue + ", 0.75) 100%";
            this.gradient = this.fullGradient(leftGradientRgba, rightGradientRgba);
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
    fullGradient = function (a, b) //loads the left gradient
    {
        var lgc = a;
        var mgc = ', rgba(45, 45, 45, 0.75) 50%, ';
        var rgc = b;
        return {
            '-ms-filter': "progid:DXImageTransform.Microsoft.gradient (0deg," + lgc + mgc + rgc + ")",
            'background': "linear-gradient(90deg," + lgc + mgc + rgc + ")"
        };
    };

    ngOnInit() {
    }

    ngOnChanges() {
        if (typeof this.homeData != 'undefined' && typeof this.awayData != 'undefined') {
            this.awayHex = this.awayData[0].awayHex;
            this.homeHex = this.homeData[0].homeHex;
            this.getGradient(this.homeHex, this.awayHex);
        }
    }
}