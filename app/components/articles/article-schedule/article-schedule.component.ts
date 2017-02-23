import {Component, Input} from "@angular/core";
import {ArticleData} from "../../../global/global-interface";
import {CircleImage} from "../../images/circle-image";
import {CircleImageData} from '../../images/image-data';
import {Gradient} from '../../../global/global-gradient';
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";

@Component({
    selector: 'article-schedule-component',
    templateUrl: './app/components/articles/article-schedule/article-schedule.component.html',
    directives: [CircleImage, ROUTER_DIRECTIVES],
    providers: [],
})

export class ArticleScheduleComponent {
    @Input() homeData:any;
    @Input() awayData:any;
    @Input() defaultGradient:any;
    @Input() fullGradient:any;
    
}
