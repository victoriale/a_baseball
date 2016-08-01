import {Component, Input, OnInit} from '@angular/core';
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

export class ArticlesModule implements OnInit {
    headlineData:HeadlineData;
    imageData:any;
    scheduleHomeData:any;
    scheduleAwayData:any;
    leftColumnData:any;
    headToHeadData:any;
    randomLeftColumn:any;
    randomHeadToHead:any;
    mainImage:string;
    subImages:Array<any>;
    mainTitle:string;
    titleFontSize:string;
    mainContent:string;
    images:any;
    homeData:any;
    awayData:any;
    teamID:string;
    eventID:number;
    eventType:string;
    mainEventID:number;
    arrLength:number;
    league:boolean = false;
    error:boolean=false;
    public headerInfo:ModuleHeaderData = {
        moduleTitle: "",
        hasIcon: false,
        iconClass: ""
    };

    constructor(private _params:RouteParams, private _headlineDataService:HeadlineDataService) {
        window.scrollTo(0, 0);
        this.teamID = _params.get('teamId');
        this.getArticles();
    }

    getArticles() {
        this._headlineDataService.getAiHeadlineData(this.teamID)
            .subscribe(
                HeadlineData => {
                    this.headlineData = HeadlineData['featuredReport'];
                    this.leftColumnData = HeadlineData['leftColumn'];
                    this.headToHeadData = HeadlineData['rightColumn'];
                    this.imageData = HeadlineData['home'].images.concat(HeadlineData['away'].images);
                    this.eventID = HeadlineData.event;
                    this.scheduleHomeData = HeadlineData['home'];
                    this.scheduleAwayData = HeadlineData['away'];
                    this.getHeaderData(HeadlineData);
                    this.getSchedule(this.scheduleHomeData, this.scheduleAwayData);
                    this.getMainArticle(this.headlineData, this.imageData, this.eventID);
                    this.getLeftColumnArticles(this.leftColumnData, this.imageData, this.eventID);
                    this.getHeadToHeadArticles(this.headToHeadData, this.eventID);
                },
                err => {
                    this.error = true;
                    console.log("Error loading AI headline data for " + this.teamID, err);
                }
            )
    }

    getHeaderData(data) {
        moment.tz.add('America/New_York|EST EDT|50 40|0101|1Lz50 1zb0 Op0');
        var dateString = moment.tz(moment.unix(data.timestamp), 'America/New_York').format("MM/DD/YYYY");
        var isToday = moment(dateString).isSame(moment().tz('America/New_York'), 'day');
        var isPost = moment(dateString).isBefore(moment().tz('America/New_York'), 'day');
        if (isPost) {
            this.headerInfo.moduleTitle = "Post Gameday Matchup Against the " + (this.teamID == data.home.id ? data.away.location + ' ' + data.away.name : data.home.location + ' ' + data.home.name);
        } else {
            this.headerInfo.moduleTitle = (isToday ? "Today's" : moment.unix(data.timestamp).format("dddd") + "'s") + " Gameday Matchup Against the " + (this.teamID == data.home.id ? data.away.location + ' ' + data.away.name : data.home.location + ' ' + data.home.name);
        }
    }

    static convertToETMoment(easternDateString) {
        return moment(moment(easternDateString).format("MM/DD/YYYY"), "America/New_York");
    };

    getSchedule(homeData, awayData) {
        var homeArr = [];
        var awayArr = [];
        var val = [];
        var homeName = homeData.location + ' ' + homeData.name;
        var awayName = awayData.location + ' ' + awayData.name;
        val['homeID'] = homeData.id;
        val['homeLocation'] = homeData.location;
        val['homeName'] = homeData.name.toLowerCase() != "diamondbacks" ? homeData.name : "D'backs";
        val['homeHex'] = homeData.hex;
        if (this.teamID == homeData.id) {
            val['homeLogo'] = {
                imageClass: "image-68",
                mainImage: {
                    imageUrl: homeData.logo,
                    imageClass: "border-logo"
                },
                subImages: []
            };
        } else {
            let homeLink = MLBGlobalFunctions.formatTeamRoute(homeName, homeData.id);
            val['url'] = homeLink;
            val['homeLogo'] = {
                imageClass: "image-68",
                mainImage: {
                    imageUrl: homeData.logo,
                    urlRouteArray: homeLink,
                    hoverText: "<i class='fa fa-mail-forward'></i>",
                    imageClass: "border-logo"
                },
                subImages: []
            };
        }
        val['homeWins'] = homeData.wins;
        val['homeLosses'] = homeData.losses;
        homeArr.push(val);
        val = [];
        val['awayID'] = awayData.id;
        val['awayLocation'] = awayData.location;
        val['awayName'] = awayData.name.toLowerCase() != "diamondbacks" ? awayData.name : "D'backs";
        val['awayHex'] = awayData.hex;
        if (this.teamID == awayData.id) {
            val['awayLogo'] = {
                imageClass: "image-68",
                mainImage: {
                    imageUrl: awayData.logo,
                    imageClass: "border-logo"
                },
                subImages: []
            };
        } else {
            let awayLink = MLBGlobalFunctions.formatTeamRoute(awayName, awayData.id);
            val['url'] = awayLink;
            val['awayLogo'] = {
                imageClass: "image-68",
                mainImage: {
                    imageUrl: awayData.logo,
                    urlRouteArray: awayLink,
                    hoverText: "<i class='fa fa-mail-forward'></i>",
                    imageClass: "border-logo"
                },
                subImages: []
            };
        }
        val['awayWins'] = awayData.wins;
        val['awayLosses'] = awayData.losses;
        awayArr.push(val);
        this.homeData = homeArr;
        this.awayData = awayArr;
    }

    getImages(imageList, articleType) {
        imageList.sort(function () {
            return 0.5 - Math.random()
        });
        if (articleType == 'main') {
            this.mainImage = imageList[0];
        }
        if (articleType == 'sub') {
            return this.subImages = imageList;
        }
    }

    getMainArticle(headlineData, imageData, eventID) {
        var pageIndex = Object.keys(headlineData)[0];
        headlineData = headlineData[Object.keys(headlineData)[0]];
        this.mainTitle = headlineData.displayHeadline;
        if (this.mainTitle.length >= 85) {
            this.titleFontSize = "font-size: 16px;";
        }
        this.eventType = pageIndex;
        this.mainEventID = eventID;
        var articleContent = headlineData.article[0];
        var maxLength = 235;
        var trimmedArticle = articleContent.substring(0, maxLength);
        this.mainContent = trimmedArticle.substr(0, Math.min(trimmedArticle.length, trimmedArticle.lastIndexOf(" ")));
        var articleType = 'main';
        this.getImages(imageData, articleType);
    }

    getLeftColumnArticles(leftColumnData, imageData, eventID) {
        var articleType = 'sub';
        var articles;
        this.getImages(imageData, articleType);
        var articleArr = [];
        var imageCount = 0;
        var self = this;
        Object.keys(leftColumnData).forEach(function (val) {
            switch (val) {
                case'about-the-teams':
                case'historical-team-statistics':
                case'last-matchup':
                case'starting-lineup-home':
                case'starting-lineup-away':
                case'injuries-home':
                case'injuries-away':
                case'upcoming':
                    imageCount++;
                    articles = {
                        title: leftColumnData[val].displayHeadline,
                        eventType: val,
                        eventID: eventID,
                        images: self.subImages[imageCount]
                    };
                    articleArr.push(articles);
                    break;
            }
        });
        articleArr.sort(function () {
            return 0.5 - Math.random()
        });
        this.randomLeftColumn = articleArr;
    }

    getHeadToHeadArticles(headToHeadData, eventID) {
        var articleArr = [];
        var articles;
        Object.keys(headToHeadData).forEach(function (val) {
            switch (val) {
                case'pitcher-player-comparison':
                case'catcher-player-comparison':
                case'first-base-player-comparison':
                case'second-base-player-comparison':
                case'third-base-player-comparison':
                case'shortstop-player-comparison':
                case'left-field-player-comparison':
                case'center-field-player-comparison':
                case'right-field-player-comparison':
                case'outfield-most-putouts':
                case'outfielder-most-hits':
                case'outfield-most-home-runs':
                case'infield-most-hits':
                case'infield-most-home-runs':
                case'infield-best-batting-average':
                case'infield-most-putouts':
                    articles = {
                        title: headToHeadData[val].displayHeadline,
                        eventType: val,
                        eventID: eventID
                    };
                    articleArr.push(articles);
                    break;
            }
        });
        articleArr.sort(function () {
            return 0.5 - Math.random()
        });
        if (articleArr.length == 10) {
            articleArr.shift();
            articleArr.pop();
        } else if (articleArr.length == 9) {
            articleArr.pop();
        }
        this.arrLength = articleArr.length - 1;
        this.randomHeadToHead = articleArr;
    }

    ngOnInit() {
    }
}
