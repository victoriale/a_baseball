import {Component, Input, OnChanges, ElementRef} from '@angular/core';
import {ArticleScheduleComponent} from "../../components/articles/article-schedule/article-schedule.component";
import {ArticleMainComponent} from "../../components/articles/main-article/main-article.component";
import {ArticleSubComponent} from "../../components/articles/sub-article/sub-article.component";
import {HeadToHeadComponent} from "../../components/articles/head-to-head-articles/head-to-head-articles.component";
import {ModuleHeader} from "../../components/module-header/module-header.component";
import {HeadlineData} from "../../global/global-interface";
import {GlobalFunctions} from '../../global/global-functions';
import {HeadlineDataService} from "../../global/global-ai-headline-module-service";
import {RouteParams} from "@angular/router-deprecated";
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";
import {ModuleHeaderData} from "../../components/module-header/module-header.component";
import {LoadingComponent} from "../../components/loading/loading.component";
import {MLBGlobalFunctions} from "../../global/mlb-global-functions";

declare var moment:any;

@Component({
    selector: 'articles-module',
    templateUrl: './app/modules/articles/articles.module.html',
    directives: [
        ModuleHeader,
        ROUTER_DIRECTIVES,
        ArticleScheduleComponent,
        ArticleMainComponent,
        ArticleSubComponent,
        HeadToHeadComponent,
        LoadingComponent
    ],
    inputs: [],
    providers: [],
})

export class ArticlesModule implements OnChanges {
    @Input() headlineData:Array<any>;
    @Input() headlineError:boolean;
    @Input() isLeague:boolean;
    moduleData:Array<any>;
    defaultGradient:string;
    fullGradient:string;
    scope:string;
    teamID:string;
    timeStamp:string;
    public headerInfo = {
        moduleTitle: "",
        hasIcon: false,
        iconClass: ""
    };

    constructor(private _params:RouteParams, private _elementRef:ElementRef) {
        window.scrollTo(0, 0);
        this.teamID = _params.get('teamId');
    }

    getArticles(data) {
        this.headlineError = false;
        try {
            if (data != null) {
                this.moduleData = data;
                if (!this.isLeague) {
                    this.defaultGradient = data['scheduleData']['gradient'].defaultGradient;
                    this.fullGradient = data['scheduleData']['gradient'].fullGradient;
                }
                this.getHeaderData(data);
            } else {
                this.headlineError = true;
                console.log('headline error');
            }
        } catch (e) {
            this.headlineError = true;
            console.log('headline error ', e);
        }
    }

    getHeaderData(header) {
        if (!this.isLeague) {
            moment.tz.add('America/New_York|EST EDT|50 40|0101|1Lz50 1zb0 Op0');
            this.timeStamp = GlobalFunctions.formatGlobalDate(header.timestamp, "defaultDate");
            var dateString = GlobalFunctions.formatGlobalDate(header.timestamp, "shortDate");
            var isToday = moment(dateString).isSame(moment().tz('America/New_York'), 'day');
            var isPost = moment(dateString).isBefore(moment().tz('America/New_York'), 'day');
            if (isPost) {
                this.headerInfo.moduleTitle = "Post Gameday Matchup Against the " + this.teamID == header.home.id ? ' ' + header.away.name : ' ' + header.home.name;
            } else {
                this.headerInfo.moduleTitle = (isToday ? "Today's" : moment(header.timestamp).format("dddd") + "'s") + " Gameday Matchup Against the " + (this.teamID == header.home.id ? ' ' + header.away.name : ' ' + header.home.name);
            }
        } else {
            this.headerInfo.moduleTitle = "Headlines<span class='mod-info'> - " + "MLB" + "</span>";
        }
    } //getHeaderData(header)

    fitText() {
        try {
            var text = this._elementRef.nativeElement.getElementsByClassName('main-article-container-content-text')[0];
            if (text[0].scrollHeight > text[0].clientHeight) {
                var original = text[0].innerHTML.substring(0, 400),
                    index = 0;
                while (index < 500 && text[0].scrollHeight > text[0].clientHeight) {
                    index++;
                    original = original.substring(0, original.lastIndexOf(" "));
                    text[0].innerHTML = original + '...<span class="main-article-container-content-read-more">Read More</span>';
                }
            }
        } catch (e) {
        }
    }

    static checkData(data) {
        return data
    }

    onResize(event) {
        this.fitText();
        if (this.moduleData != null) {
            this.getHeaderData(this.moduleData);
        }
    }

    ngOnChanges() {
        if (ArticlesModule.checkData(this.headlineData)) {
            this.getArticles(this.headlineData);
            this.fitText();
        }
    }
}
