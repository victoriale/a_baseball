import {Component, Input, OnInit } from "angular2/core";
import {Articles} from "../../../global/global-service";
import {ArticleData} from "../../../global/global-interface";
import {CircleImage} from "../../images/circle-image";
import {CircleImageData} from '../../images/image-data';
import {Gradient} from '../../../global/global-gradient';
import {ROUTER_DIRECTIVES} from "angular2/router";

@Component({
    selector: 'article-schedule-component',
    templateUrl: './app/components/articles/article-schedule/article-schedule.component.html',
    directives: [CircleImage, ROUTER_DIRECTIVES],
    inputs: ['league', 'homeData', 'awayData'],
    providers: [Articles],
})

export class ArticleScheduleComponent implements OnInit {
    @Input() homeData:any;
    @Input() awayData:any;
    homeHex:string;
    awayHex:string;
    gradient:Object;
    defaultGradient:string;
    public league:boolean;

    constructor(private _magazineOverviewService:Articles) {

    }

    ngOnInit() {
      console.log(this.homeData, this.awayData);
    }

    ngOnChanges() {
        if (typeof this.homeData != 'undefined' && typeof this.awayData != 'undefined') {
            this.awayHex = this.awayData[0].awayHex;
            this.homeHex = this.homeData[0].homeHex;
            var fullGradient = Gradient.getGradientStyles([this.homeHex, this.awayHex], .75);
            if (fullGradient) {
                this.gradient = fullGradient;
            }
            else {
                this.defaultGradient = 'default-gradient';
            }
            // this.getGradient(this.homeHex, this.awayHex);
        }
    }
}
