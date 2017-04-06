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
import {GlobalFunctions} from "../../global/global-functions";
import {MLBGlobalFunctions} from "../../global/mlb-global-functions";
import {SidekickWrapperAI} from "../../components/sidekick-wrapper-ai/sidekick-wrapper-ai.component";
import {GlobalSettings} from "../../global/global-settings";
import {SidekickContainerComponent} from "../../components/articles/sidekick-container/sidekick-container.component";
import {SeoService} from '../../seo.service';
import {ArticleDataService} from "../../services/ai-article.service";

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
        SidekickContainerComponent
    ]
})

export class ArticlePages implements OnInit {
    articleData:any;
    randomHeadlines:any;
    imageData:any;
    dataSubscription:any;
    trendingArticles:any;
    images:Array<any>;
    eventID:string;
    eventType:string;
    title:string;
    date:string;
    content:string;
    comment:string;
    articleType:string;
    showLoading:boolean = true;
    copyright:any;
    imageTitle:any;
    teamId:number;
    randomArticles:Array<any>;
    trendingData:Array<any>;
    trendingImages:Array<any>;
    error:boolean = false;
    isTrendingMax:boolean = false;
    aiSidekick:boolean = true;
    hasRun:boolean = false;
    partnerId:string;
    checkPartner:boolean;
    trendingLength:number;
    batch:number = 1;

    constructor(private _params:RouteParams,
                private _router:Router,
                private _articleDataService:ArticleDataService,
                private _seoService:SeoService,
                private _location:Location) {
        window.scrollTo(0, 0);
        this.trendingLength = 10;
        this.eventID = _params.get('eventID');
        this.eventType = _params.get('eventType');
        if (this.eventType == "upcoming-game") {
            this.eventType = "upcoming";
        }
        GlobalSettings.getPartnerID(_router, partnerID => {
            if (partnerID != null) {
                this.partnerId = partnerID.replace("-", ".");
            }
        });
        this.checkPartner = GlobalSettings.getHomeInfo().isPartner;
    }

    getArticles() {
        this.dataSubscription = this._articleDataService.getArticle(this.eventID, this.eventType, this.partnerId, this.eventType)
            .subscribe(Article => {
                    try {
                        this.articleData = Article;
                        this.date = Article.date;
                        if (this.articleData.hasEventId) {
                            this.getRecommendedArticles(this.articleData.eventID);
                        }
                        this.isTrendingMax = false;
                        this.getTrendingArticles(this.eventID);
                        this.metaTags(this.articleData);
                    } catch (e) {
                        this.error = true;
                        var self = this;
                        setTimeout(function () {
                            //removes error page from browser history
                            self._location.replaceState('/');
                            //returns user to previous page
                            self._router.navigateByUrl('/');
                        }, 5000);
                    }
                },
                err => {
                    this.error = true;
                    var self = this;
                    setTimeout(function () {
                        //removes error page from browser history
                        self._location.replaceState('/');
                        //returns user to previous page
                        self._router.navigateByUrl('/');
                    }, 5000);
                }
            );
    }


    getRecommendedArticles(eventId) {
        this._articleDataService.getRecommendationsData(eventId)
            .subscribe(data => {
                this.randomHeadlines = data;
            });
          }


    private getTrendingArticles(currentArticleId) {
        var getData = this._articleDataService.getAiTrendingData(this.trendingLength);
        this.trendingArticles = getData.subscribe(
            data => {
                if (!this.hasRun) {
                    this.hasRun = true;
                    this.trendingData = this._articleDataService.transformTrending(data['data'], currentArticleId);
                    if ((data['article_count'] % 10 == 0 || data.length % 10 == 0) && this.trendingData) {
                        this.trendingLength = this.trendingLength + 10;
                    } else {
                        this.isTrendingMax = true;
                        this.showLoading = false;
                    }
                }
            });
    }

    private trendingScroll(event) {
        if (!this.isTrendingMax) {
            this.hasRun = false;
            if (jQuery(document).height() - window.innerHeight - jQuery("footer").height() <= jQuery(window).scrollTop()) {
                this.showLoading = true;
                this.batch = this.batch + 1;
                this.getTrendingArticles(this.eventID);
            }
        }
    }

    private metaTags(data) {
        //This call will remove all meta tags from the head.
        this._seoService.removeMetaTags();
        //create meta description that is below 160 characters otherwise will be truncated
        var metaData = data;
        let image, metaDesc;
        var teams = [];
        var players = [];
        var keywords;
        var searchArray = [];
        var headerData = data['articleContent']['metadata'];
        let link = window.location.href;
        metaDesc = data['articleContent'].meta_headline;
        if (headerData['team_name'] && headerData['team_name'].constructor === Array) {
            headerData['team_name'].forEach(function (val) {
                searchArray.push(val);
                teams.push(val);
            });
        }
        if (headerData['player_name'] && headerData['player_name'].constructor === Array) {
            headerData['player_name'].forEach(function (val) {
                searchArray.push(val);
                players.push(val);
            });
        }
        if (data['articleContent']['keyword'] && data['articleContent']['keyword'].constructor === Array) {
            data['articleContent']['keyword'].forEach(function (val) {
                searchArray.push(val);
            });
            keywords = searchArray.join(',');
        } else {
            searchArray.push(data['articleContent']['keyword']);
            keywords = searchArray.join(',');
        }
        var date = metaData['articleContent'].last_updated ? metaData['articleContent'].last_updated : metaData['articleContent'].publication_date;
        image = metaData['images']['imageData'][0];
        this._seoService.setCanonicalLink(this._params.params, this._router);
        this._seoService.setOgTitle(metaData.title);
        this._seoService.setOgDesc(metaDesc);
        this._seoService.setOgType('Website');
        this._seoService.setOgUrl(link);
        this._seoService.setOgImage(image);
        this._seoService.setTitle(metaData.title);
        this._seoService.setMetaDescription(metaDesc);
        this._seoService.setMetaRobots('INDEX, NOFOLLOW');
        this._seoService.setStartDate(headerData['relevancy_start_date']);
        this._seoService.setEndDate(headerData['relevancy_end_date']);
        this._seoService.setIsArticle("true");
        this._seoService.setSearchType("article");
        this._seoService.setSource("snt_ai");
        this._seoService.setArticleId(this.eventID);
        this._seoService.setPageTitle(metaData.title);
        this._seoService.setCategory(metaData['articleContent']['keyword']);
        this._seoService.setPublishedDate(date);
        this._seoService.setAuthor(data['articleContent'].author);
        this._seoService.setPublisher(data['articleContent'].publisher);
        this._seoService.setImageUrl(image);
        this._seoService.setPageDescription(metaData.teaser.replace(/<ng2-route>|<\/ng2-route>/g, ''));
        this._seoService.setPageUrl(link);
        this._seoService.setArticleType(metaData.articleType);
        this._seoService.setKeywords(keywords);
    } //metaTags

    ngOnInit() {
        //This has to be resize to trigger the takeover update
        try {
            window.dispatchEvent(new Event('resize'));
        } catch (e) {
            //to run resize event on IE
            var resizeEvent = document.createEvent('UIEvents');
            resizeEvent.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(resizeEvent);
        }
        this.getArticles();
    }

    ngOnDestroy() {
        if (!this.error) {
            this.dataSubscription.unsubscribe();
        }
    } //ngOnDestroy
}
