import {Component, OnInit} from '@angular/core';
import {Router, RouteParams} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';

import {AboutUsModule} from '../../modules/about-us/about-us.module';
import {LikeUs} from "../../modules/likeus/likeus.module";

import {TwitterModule, twitterModuleData} from "../../modules/twitter/twitter.module";
import {TwitterService} from '../../services/twitter.service';

import {ComparisonModule, ComparisonModuleData} from '../../modules/comparison/comparison.module';
import {ComparisonStatsService} from '../../services/comparison-stats.service';

import {ShareModule, ShareModuleInput} from '../../modules/share/share.module';
import {CommentModule} from '../../modules/comment/comment.module';

import {DYKModule, dykModuleData} from "../../modules/dyk/dyk.module";
import {DykService} from '../../services/dyk.service';

import {FAQModule, faqModuleData} from "../../modules/faq/faq.module";
import {FaqService} from '../../services/faq.service';

import {BoxScoresModule} from '../../modules/box-scores/box-scores.module';
import {BoxScoresService} from '../../services/box-scores.service';

import {StandingsModule, StandingsModuleData} from '../../modules/standings/standings.module';
import {MLBStandingsTabData} from '../../services/standings.data';
import {StandingsService} from '../../services/standings.service';

import {SchedulesModule} from '../../modules/schedules/schedules.module';
import {SchedulesService} from '../../services/schedules.service';

import {MVPModule} from '../../modules/mvp/mvp.module';
import {ListPageService, BaseballMVPTabData} from '../../services/list-page.service';

import {ProfileHeaderData, ProfileHeaderModule} from '../../modules/profile-header/profile-header.module';
import {IProfileData, ProfileHeaderService} from '../../services/profile-header.service';

import {Division, Conference, MLBPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';

import {HeadlineComponent} from '../../components/headline/headline.component';

import {DraftHistoryModule} from '../../modules/draft-history/draft-history.module';

import {NewsModule} from '../../modules/news/news.module';
import {NewsService} from '../../services/news.service';

import {TransactionsModule, TransactionModuleData} from "../../modules/transactions/transactions.module";
import {TransactionsService} from "../../services/transactions.service";

import {ListOfListsModule} from "../../modules/list-of-lists/list-of-lists.module";
import {ListOfListsService} from "../../services/list-of-lists.service";

import {GlobalSettings} from "../../global/global-settings";
import {ImagesService} from "../../services/carousel.service";
import {ImagesMedia} from "../../components/carousels/images-media-carousel/images-media-carousel.component";
import {SidekickWrapper} from "../../components/sidekick-wrapper/sidekick-wrapper.component";

import {ResponsiveWidget} from '../../components/responsive-widget/responsive-widget.component';

import {SeoService} from '../../seo.service';
import {ArticleDataService} from "../../services/ai-article.service";
import {ArticlesModule} from "../../modules/articles/articles.module";

@Component({
    selector: 'MLB-page',
    templateUrl: './app/webpages/mlb-page/mlb.page.html',
    directives: [
        SidekickWrapper,
        LoadingComponent,
        ErrorComponent,
        MVPModule,
        SchedulesModule,
        BoxScoresModule,
        HeadlineComponent,
        ProfileHeaderModule,
        StandingsModule,
        CommentModule,
        DYKModule,
        DraftHistoryModule,
        FAQModule,
        LikeUs,
        TwitterModule,
        ComparisonModule,
        ShareModule,
        TransactionsModule,
        NewsModule,
        AboutUsModule,
        ListOfListsModule,
        ImagesMedia,
        ResponsiveWidget,
        ArticlesModule
      ],
    providers: [
        BoxScoresService,
        SchedulesService,
        ListPageService,
        StandingsService,
        ProfileHeaderService,
        ImagesService,
        NewsService,
        FaqService,
        DykService,
        ComparisonStatsService,
        TwitterService,
        TransactionsService,
        ListOfListsService,
        Title
      ]
})

export class MLBPage implements OnInit {
    public widgetPlace: string = "widgetForModule";
    public shareModuleInput:ShareModuleInput;
    private headlineData:any;

    pageParams:MLBPageParameters = {};
    partnerID:string = null;
    hasError: boolean = false;

    standingsData:StandingsModuleData;

    profileHeaderData:ProfileHeaderData;
    seasonBase:any;

    profileData:IProfileData;

    comparisonModuleData: ComparisonModuleData;

    transactionsData:TransactionModuleData;

    boxScoresData:any;
    currentBoxScores:any;
    dateParam:any;

    batterParams:any;
    batterData:Array<BaseballMVPTabData>;
    pitcherParams:any;
    pitcherData:Array<BaseballMVPTabData>;

    imageData:any;
    copyright:any;
    imageTitle:any;
    isProfilePage:boolean = true;
    profileType:string = "league";
    profileName:string = "MLB";
    listMax:number = 10;
    listOfListsData:Object; // paginated data to be displayed
    newsDataArray: Array<Object>;
    faqData: Array<faqModuleData>;
    dykData: Array<dykModuleData>;
    twitterData: Array<twitterModuleData>;
    schedulesData:any;

    constructor(private _router:Router,
                private _title: Title,
                private _standingsService:StandingsService,
                private _boxScores:BoxScoresService,
                private _profileService:ProfileHeaderService,
                private _schedulesService:SchedulesService,
                private _imagesService:ImagesService,
                private _newsService: NewsService,
                private _faqService: FaqService,
                private _dykService: DykService,
                private _twitterService: TwitterService,
                private _comparisonService: ComparisonStatsService,
                private _transactionsService: TransactionsService,
                private _lolService: ListOfListsService,
                private listService:ListPageService,
                private _seoService: SeoService,
                private _params:RouteParams,
                private _headlineDataService:ArticleDataService
              ) {
        _title.setTitle(GlobalSettings.getPageTitle("MLB"));

        // this.currentYear = new Date().getFullYear();

        //for boxscores
        var currentUnixDate = new Date().getTime();
        //convert currentDate(users local time) to Unix and push it into boxScoresAPI as YYYY-MM-DD in EST using moment timezone (America/New_York)
        this.dateParam ={
          profile:'league',//current profile page
          teamId:null,
          date: GlobalFunctions.getDateElement(currentUnixDate, "fullDate")
        }

        GlobalSettings.getPartnerID(_router, partnerID => {
            this.partnerID = partnerID;
        });
    }

    ngOnInit() {
        this.setupProfileData();
    }

    private setupProfileData() {
        this._profileService.getMLBProfile().subscribe(
            data => {
                /*** About MLB ***/
                this.metaTags(data);
                this.profileData = data;
                this.profileHeaderData = this._profileService.convertToLeagueProfileHeader(data.headerData)
                this.profileName = "MLB";
                this.getHeadlines();

                this.seasonBase = data.headerData.seasonId;
                /*** Keep Up With Everything MLB ***/
                this.getBoxScores(this.dateParam);
                this.getSchedulesData('pre-event');//grab pre event data for upcoming games
                this.standingsData = this._standingsService.loadAllTabsForModule(this.pageParams);
                this.transactionsData = this._transactionsService.loadAllTabsForModule(data.profileName);
                this.batterData = this.listService.getMVPTabs('batter', 'module');
                if ( this.batterData && this.batterData.length > 0 ) {
                    this.batterTab(this.batterData[0]);
                }
                this.pitcherData = this.listService.getMVPTabs('pitcher', 'module');
                if ( this.pitcherData && this.pitcherData.length > 0 ) {
                    this.pitcherTab(this.pitcherData[0]);
                }
                this.setupComparisonData();

                /*** Keep Up With Everything MLB ***/
                this.setupShareModule();
                this.getImages(this.imageData);
                this.getNewsService();
                this.getFaqService(this.profileType);
                this.setupListOfListsModule();
                this.getDykService(this.profileType);
                this.getTwitterService(this.profileType);
            },
            err => {
                this.hasError = true;
                console.log("Error getting team profile data for mlb", err);
            }
        );
    }

    private metaTags(data){
      //This call will remove all meta tags from the head.
      this._seoService.removeMetaTags();
      //create meta description that is below 160 characters otherwise will be truncated
      let header = data.headerData;
      let metaDesc =  header.profileNameLong + ' loyal to ' + header.totalTeams + ' teams ' + 'and ' + header.totalPlayers + ' players.';
      let link = window.location.href;
      var keywords = "Baseball";
      keywords += header.profileNameShort ? ", " + header.profileNameShort : '';
      keywords += header.profileNameLong ? ", " + header.profileNameLong : '';
      this._seoService.setCanonicalLink(this._params.params, this._router);
      this._seoService.setOgTitle(data.profileName);
      this._seoService.setOgDesc(metaDesc);
      this._seoService.setOgType('image');
      this._seoService.setOgUrl(link);
      this._seoService.setOgImage(GlobalSettings.getImageUrl(header.logo));
      this._seoService.setTitle(data.profileName);
      this._seoService.setMetaDescription(metaDesc);
      this._seoService.setMetaRobots('Index, Follow');
      this._seoService.setIsArticle("false");
      this._seoService.setSearchType("League Page");
      this._seoService.setPageTitle(header.profileNameLong);
      this._seoService.setCategory("Baseball, " + header.profileNameShort);
      this._seoService.setImageUrl(GlobalSettings.getImageUrl(header.logo));
      this._seoService.setPageUrl(link);
      this._seoService.setKeywords(keywords);
      this._seoService.setPageDescription(metaDesc);
    }

    //grab tab to make api calls for post of pre event table
    private scheduleTab(tab) {
        if(tab == 'Upcoming Games'){
            this.getSchedulesData('pre-event');
        }else if(tab == 'Previous Games'){
            this.getSchedulesData('post-event');
        }else{
            this.getSchedulesData('post-event');// fall back just in case no status event is present
        }
    }

    //league headline module
    private getHeadlines(){
        this._headlineDataService.getAiHeadlineDataLeague(true)
            .subscribe(
                HeadlineData => {
                    this.headlineData = HeadlineData;
                },
                err => {
                    console.log("Error loading AI headline data for League Page", err);
                }
            )
    } //getHeadlines

    //api for Schedules
    private getSchedulesData(status){
      var limit = 5;
      if(status == 'post-event'){
        limit = 3;
      }
      this._schedulesService.getSchedulesService('league', status, limit, 1)
      .subscribe(
        data => {
          this.schedulesData = data;
        },
        err => {
          console.warn("Error getting Schedules Data -- Data Insufficient -- HRL season data for upcoming season is not in place.");
        }
      )
    }

    private transactionsTab(tab) {
        this._transactionsService.getTransactionsService(tab, this.pageParams.teamId, 'module')
        .subscribe(
            transactionsData => {
                //do nothing
            },
            err => {
            console.log('Error: transactionsData API: ', err);
            }
        );
    }

    private getTwitterService(profileType) {
          this.isProfilePage = true;
          this.profileType = 'league';
          this.profileName = "MLB";
          this._twitterService.getTwitterService(this.profileType)
              .subscribe(data => {
                  this.twitterData = data;
              },
              err => {
                  console.log("Error getting twitter data");
              });
    }
    private getDykService(profileType) {
      this._dykService.getDykService(this.profileType)
          .subscribe(data => {
                this.dykData = data;
            },
            err => {
                console.log("Error getting did you know data");
            });
  }

    private getFaqService(profileType) {
      this._faqService.getFaqService(this.profileType)
        .subscribe(data => {
            this.faqData = data;
        },
        err => {
            console.log("Error getting faq data for mlb", err);
        });
   }

    private setupListOfListsModule() {
        let params = {
          limit : 4,
          pageNum : 1
        }
        this._lolService.getListOfListsService(params, "league", "module")
            .subscribe(
                listOfListsData => {
                    this.listOfListsData = listOfListsData.listData;
                    this.listOfListsData["type"] = "league";
                },
                err => {
                    console.log('Error: listOfListsData API: ', err);
                }
            );
    }

    private getNewsService() {
        this._newsService.getNewsService('Major League Baseball')
            .subscribe(data => {
                this.newsDataArray = data.news;
            },
            err => {
                console.log("Error getting news data");
            });
    }

    //api for BOX SCORES
    private getBoxScores(dateParams?) {
        if ( dateParams != null ) {
            this.dateParam = dateParams;
        }
        this._boxScores.getBoxScores(this.boxScoresData, this.profileName, this.dateParam, (boxScoresData, currentBoxScores) => {
            this.boxScoresData = boxScoresData;
            this.currentBoxScores = currentBoxScores;
        })
    }

    private getImages(imageData) {
        this._imagesService.getImages(this.profileType)
            .subscribe(data => {
                    return this.imageData = data.imageArray, this.copyright = data.copyArray, this.imageTitle = data.titleArray;
                },
                err => {
                    console.log("Error getting image data" + err);
                });
    }

    private setupComparisonData() {
        this._comparisonService.getInitialPlayerStats(this.pageParams).subscribe(
            data => {
                this.comparisonModuleData = data;
            },
            err => {
                console.log("Error getting comparison data for mlb", err);
            });
    }

    private standingsTabSelected(tabData: Array<any>) {
        //only show 5 rows in the module
        this._standingsService.getStandingsTabData(tabData, this.pageParams, (data) => {}, 5);
    }

    private setupShareModule() {
        let profileHeaderData = this.profileHeaderData;
        let imageUrl = !profileHeaderData.profileImageUrl ? GlobalSettings.getImageUrl("/mlb/players/no-image.png") : profileHeaderData.profileImageUrl;
        let shareText = !profileHeaderData.profileName ?
            'Share This Profile Below' :
            'Share ' + GlobalFunctions.convertToPossessive(profileHeaderData.profileName) + ' Profile Below:';

        this.shareModuleInput = {
            imageUrl: imageUrl,
            shareText: shareText
        };
    }

    //each time a tab is selected the carousel needs to change accordingly to the correct list being shown
    private batterTab(tab: BaseballMVPTabData) {
        this.batterParams = { //Initial load for mvp Data
            profile: 'player',
            listname: tab.tabDataKey,
            sort: 'asc',
            conference: 'all',
            division: 'all',
            limit: this.listMax,
            pageNum: 1
        };
        this.listService.getListModuleService(tab, this.batterParams, this.seasonBase)
            .subscribe(updatedTab => {
                //do nothing?
            }, err => {
                tab.isLoaded = true;
                console.log('Error: Loading MVP Batters: ', err);
            })
    }

    //each time a tab is selected the carousel needs to change accordingly to the correct list being shown
    private pitcherTab(tab: BaseballMVPTabData) {
        this.pitcherParams = { //Initial load for mvp Data
            profile: 'player',
            listname: tab.tabDataKey,
            sort: 'asc',
            conference: 'all',
            division: 'all',
            limit: this.listMax,
            pageNum: 1
        };
        this.listService.getListModuleService(tab, this.pitcherParams,this.seasonBase)
            .subscribe(updatedTab => {
                //do nothing?
            }, err => {
                tab.isLoaded = true;
                console.log('Error: Loading MVP Pitchers: ', err);
            })
    }
}
