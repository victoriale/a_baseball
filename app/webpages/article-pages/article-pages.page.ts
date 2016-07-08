import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router,ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {ImagesMedia} from "../../components/carousels/images-media-carousel/images-media-carousel.component";
import {ShareLinksComponent} from "../../components/articles/shareLinks/shareLinks.component";
import {ArticleContentComponent} from "../../components/articles/article-content/article-content.component";
import {RecommendationsComponent} from "../../components/articles/recommendations/recommendations.component";
import {TrendingComponent} from "../../components/articles/trending/trending.component";
import {DisqusComponent} from "../../components/articles/disqus/disqus.component";
import {LoadingComponent} from "../../components/loading/loading.component";
import {ArticleData} from "../../global/global-interface";
import {ArticleDataService} from "../../global/global-article-page-service";
import {GlobalFunctions} from "../../global/global-functions";
import {MLBGlobalFunctions} from "../../global/mlb-global-functions";
import {SidekickWrapperAI} from "../../components/sidekick-wrapper-ai/sidekick-wrapper-ai.component";
import {GlobalSettings} from "../../global/global-settings";

declare var jQuery:any;

@Component({
    selector: 'article-pages',
    templateUrl: './app/webpages/article-pages/article-pages.page.html',
    directives: [
        SidekickWrapperAI,
        ROUTER_DIRECTIVES,
        ImagesMedia,
        ShareLinksComponent,
        ArticleContentComponent,
        RecommendationsComponent,
        DisqusComponent,
        LoadingComponent,
        TrendingComponent,
    ],
    providers: [],
})

export class ArticlePages implements OnInit {
    articleData:ArticleData;
    randomHeadlines:any;
    imageData:any;
    images:Array<any>;
    eventID:string;
    eventType:string;
    title:string;
    date:string;
    content:string;
    comment:string;
    pageIndex:string;
    articleType:string;
    articleSubType:string;
    imageLinks:Array<any>;
    recommendedImageData:any;
    copyright:any;
    imageTitle:any;
    teamId:number;
    trendingData:Array<any>;
    trendingImages:Array<any>;
    error:boolean = false;
    hasImages:boolean = false;
    aiSidekick:boolean = true;
    isHome:boolean = true;

    constructor(private _params:RouteParams,
                private _articleDataService:ArticleDataService,
                private _location:Location) {
        window.scrollTo(0, 0);
        this.eventID = _params.get('eventID');
        this.eventType = _params.get('eventType');
        if (this.eventType == "upcoming-game") {
            this.eventType = "upcoming";
        }
        this.getArticles();
    }

    getArticles() {
        this.getArticleType();
        this._articleDataService.getArticleData(this.eventID, this.eventType)
            .subscribe(
                ArticleData => {
                    var pageIndex = Object.keys(ArticleData)[0];
                    this.getCarouselImages(ArticleData[pageIndex]['images']);
                    this.articleData = ArticleData[pageIndex];
                    this.title = ArticleData[pageIndex].displayHeadline;
                    this.date = ArticleData[pageIndex].dateline;
                    this.comment = ArticleData[pageIndex].commentHeader;
                    this.imageLinks = this.getImageLinks(ArticleData[pageIndex]);
                    this.teamId = ArticleData[pageIndex].teamId;
                    ArticlePages.setMetaTag(this.articleData.metaHeadline);
                },
                err => {
                    this.error = true;
                    var self = this;
                    setTimeout(function () {
                        //removes errored page from browser history
                        self._location.replaceState('/');
                        //returns user to previous page
                        self._location.back();
                    }, 5000);
                }
            );
        this._articleDataService.getRecommendationsData(this.eventID)
            .subscribe(
                HeadlineData => {
                    this.pageIndex = this.eventType;
                    this.eventID = HeadlineData.event;
                    this.recommendedImageData = HeadlineData['home'].images.concat(HeadlineData['away'].images);
                    this.getRandomArticles(HeadlineData, this.pageIndex, this.eventID, this.recommendedImageData);
                }
            );
        this._articleDataService.getTrendingData()
            .subscribe(
                TrendingData => {
                    this.getTrendingArticles(TrendingData);
                }
            );
    }

    getTrendingArticles(data) {
        var articles = [];
        var images = [];
        Object.keys(data).map(function (val, index) {
            if (val != "meta-data") {
                articles[index - 1] = {
                    title: data[val].displayHeadline,
                    date: data[val].dateline + " EST",
                    content: data[val].article[0],
                    eventId: data['meta-data']['current'].eventId,
                    eventType: val,
                    url: MLBGlobalFunctions.formatArticleRoute(val, data['meta-data']['current'].eventId)
                };
            }
        });
        Object.keys(data['meta-data']['images']).map(function (val, index) {
            images[index] = data['meta-data']['images'][val];
        });
        this.trendingImages = images[0].concat(images[1]);
        articles.sort(function () {
            return 0.5 - Math.random()
        });
        this.trendingData = articles;
    }

    getCarouselImages(data) {
        var images = [];
        var copyData = [];
        var description = [];
        var imageCount = 10;
        var image;
        var copyright;
        var title;
        if (this.articleType == "gameModule") {
            if (Object.keys(data).length == 4) {
                imageCount = 5;
            }
        } else if (this.articleType == "playerRoster") {
            imageCount = 2;
        }
        try {
            if (Object.keys(data).length > 0) {
                for (var id in data) {
                    data[id].map(function (val, index) {
                        if (index < imageCount) {
                            image = val['image'];
                            copyright = val['copyright'];
                            title = val['title'];
                            images.push(image);
                            copyData.push(copyright);
                            description.push(title);
                        }
                    });
                }
                this.imageData = images;
                this.copyright = copyData;
                this.imageTitle = description;
            } else {
                this.imageData = null;
                this.copyright = null;
                this.imageTitle = null;
            }
            this.hasImages = true;
        } catch (err) {
            this.hasImages = false;
        }
    }

    getImageLinks(data) {
        var hoverText = "<p>View</p><p>Profile</p>";
        var links = [];
        if (this.articleType == "playerRoster") {
            data['article'].map(function (val, index) {
                if (val['playerRosterModule']) {
                    let playerUrl = MLBGlobalFunctions.formatPlayerRoute(val['playerRosterModule'].teamName, val['playerRosterModule'].name, val['playerRosterModule'].id);
                    let teamUrl = MLBGlobalFunctions.formatTeamRoute(val['playerRosterModule'].teamName, val['playerRosterModule'].teamId);
                    val['player'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: val['playerRosterModule']['headshot'],
                            urlRouteArray: playerUrl,
                            hoverText: hoverText,
                            imageClass: "border-logo"
                        }
                    };
                    val['logo'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: val['playerRosterModule'].teamLogo,
                            urlRouteArray: teamUrl,
                            hoverText: hoverText,
                            imageClass: "border-logo"
                        }
                    };
                    links.push(val['player'], val['logo']);
                }
            });
            return links;
        }
        if (this.articleType == 'playerComparison') {
            data['article'][2]['playerComparisonModule'].map(function (val, index) {
                if (index == 0) {
                    let urlPlayerLeft = MLBGlobalFunctions.formatPlayerRoute(val.teamName, val.name, val.id);
                    let urlTeamLeft = MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId);
                    val['imageLeft'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: val['headshot'],
                            urlRouteArray: urlPlayerLeft,
                            hoverText: hoverText,
                            imageClass: "border-logo"
                        }
                    };
                    val['imageLeftSub'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: val.teamLogo,
                            urlRouteArray: urlTeamLeft,
                            hoverText: hoverText,
                            imageClass: "border-logo"
                        }
                    };
                    links.push(val['imageLeft'], val['imageLeftSub']);
                }
                if (index == 1) {
                    let urlPlayerRight = MLBGlobalFunctions.formatPlayerRoute(val.teamName, val.name, val.id);
                    let urlTeamRight = MLBGlobalFunctions.formatTeamRoute(val.teamName, val.teamId);
                    val['imageRight'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: val['headshot'],
                            urlRouteArray: urlPlayerRight,
                            hoverText: hoverText,
                            imageClass: "border-logo"
                        }
                    };
                    val['imageRightSub'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: val.teamLogo,
                            urlRouteArray: urlTeamRight,
                            hoverText: hoverText,
                            imageClass: "border-logo"
                        }
                    };
                    links.push(val['imageRight'], val['imageRightSub']);
                }
            });
            return links;
        }
        if (this.articleType == 'gameModule') {
            data['article'].map(function (val, index) {
                if (index == 1 && val['gameModule']) {
                    let urlTeamLeftTop = MLBGlobalFunctions.formatTeamRoute(val['gameModule'].homeTeamName, val['gameModule'].homeTeamId);
                    let urlTeamRightTop = MLBGlobalFunctions.formatTeamRoute(val['gameModule'].awayTeamName, val['gameModule'].awayTeamId);
                    val['teamLeft'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: val['gameModule'].homeTeamLogo,
                            urlRouteArray: urlTeamLeftTop,
                            hoverText: hoverText,
                            imageClass: "border-logo"
                        }
                    };
                    val['teamRight'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: val['gameModule'].awayTeamLogo,
                            urlRouteArray: urlTeamRightTop,
                            hoverText: hoverText,
                            imageClass: "border-logo"
                        }
                    };
                    links.push(val['teamLeft'], val['teamRight']);
                }
                if (index == 5 && val['gameModule']) {
                    let urlTeamLeftBottom = MLBGlobalFunctions.formatTeamRoute(val['gameModule'].homeTeamName, val['gameModule'].homeTeamId);
                    let urlTeamRightBottom = MLBGlobalFunctions.formatTeamRoute(val['gameModule'].awayTeamName, val['gameModule'].awayTeamId);
                    val['teamLeft'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: val['gameModule'].homeTeamLogo,
                            urlRouteArray: urlTeamLeftBottom,
                            hoverText: hoverText,
                            imageClass: "border-logo"
                        }
                    };
                    val['teamRight'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: val['gameModule'].awayTeamLogo,
                            urlRouteArray: urlTeamRightBottom,
                            hoverText: hoverText,
                            imageClass: "border-logo"
                        }
                    };
                    links.push(val['teamLeft'], val['teamRight']);
                }
            });
            return links;
        }
        if (this.articleType == 'teamRecord') {
            var isFirstTeam = true;
            data['article'].map(function (val, index) {
                if (val['teamRecordModule'] && isFirstTeam) {
                    let urlFirstTeam = MLBGlobalFunctions.formatTeamRoute(val['teamRecordModule'].name, val['teamRecordModule'].id);
                    val['imageTop'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: val['teamRecordModule'].logo,
                            urlRouteArray: urlFirstTeam,
                            hoverText: hoverText,
                            imageClass: "border-logo"
                        }
                    };
                    links.push(val['imageTop']);
                    return isFirstTeam = false;
                }
                if (val['teamRecordModule'] && !isFirstTeam) {
                    let urlSecondTeam = MLBGlobalFunctions.formatTeamRoute(val['teamRecordModule'].name, val['teamRecordModule'].id);
                    val['imageBottom'] = {
                        imageClass: "image-121",
                        mainImage: {
                            imageUrl: val['teamRecordModule'].logo,
                            urlRouteArray: urlSecondTeam,
                            hoverText: hoverText,
                            imageClass: "border-logo"
                        }
                    };
                    links.push(val['imageBottom']);
                }
            });
            return links;
        }
    }

    getImages(imageList) {
        imageList.sort(function () {
            return 0.5 - Math.random()
        });
        return this.images = imageList;
    }

    getRandomArticles(recommendations, pageIndex, eventID, recommendedImageData) {
        this.getImages(recommendedImageData);
        var recommendArr = [];
        var imageCount = 0;
        var self = this;
        jQuery.map(recommendations.leftColumn, function (val, index) {
            if (pageIndex != index) {
                switch (index) {
                    case'about-the-teams':
                    case'historical-team-statistics':
                    case'last-matchUp':
                    case'starting-lineup-home':
                    case'starting-lineup-away':
                    case'injuries-home':
                    case'injuries-away':
                    case'upcoming-game':
                        val['title'] = val.displayHeadline;
                        val['eventType'] = index;
                        val['eventID'] = eventID;
                        val['images'] = self.images[imageCount];
                        recommendArr.push(val);
                        imageCount++;
                        break;
                }
            }
        });
        jQuery.map(recommendations.rightColumn, function (val, index) {
            if (pageIndex != index) {
                switch (index) {
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
                        val['title'] = val.displayHeadline;
                        val['eventType'] = index;
                        val['eventID'] = eventID;
                        val['images'] = self.images[imageCount];
                        recommendArr.push(val);
                        imageCount++;
                        break;
                }
            }
        });
        recommendArr.sort(function () {
            return 0.5 - Math.random()
        });
        this.randomHeadlines = recommendArr;
        this.images = recommendations['home'].images;
    }

    getArticleType() {
        switch (this.eventType) {
            case'about-the-teams':
                this.articleType = 'teamRecord';
                this.articleSubType = 'about';
                break;
            case'historical-team-statistics':
                this.articleType = 'teamRecord';
                this.articleSubType = 'history';
                break;
            case'last-matchup':
                this.articleType = 'teamRecord';
                this.articleSubType = 'last';
                break;
            case'starting-lineup-home':
            case'starting-lineup-away':
            case'injuries-home':
            case'injuries-away':
                this.articleType = 'playerRoster';
                break;
            case'pitcher-player-comparison':
                this.articleType = 'playerComparison';
                this.articleSubType = 'pitcher';
                break;
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
                this.articleType = 'playerComparison';
                break;
            case'pregame-report':
            case'third-inning-report':
            case'fifth-inning-report':
            case'Seventh-inning-stretch-report':
            case'postgame-report':
                this.articleType = 'gameReport';
                break;
            case'upcoming':
                this.articleType = 'gameModule';
                break;
        }
        return this.articleType;
    }

    static setMetaTag(metaData) {
        if (metaData !== null) {
            var metaTag = document.createElement('meta');
            metaTag.name = 'description';
            metaTag.content = metaData;
            document.head.appendChild(metaTag);
        }
    }

    ngOnInit() {
        this.isHome = GlobalSettings.getHomeInfo().isHome;
    }
}