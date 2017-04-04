import {Component, OnInit, Injectable} from '@angular/core';
import {Router, RouteParams} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {GlobalFunctions} from "../../global/global-functions";
import {Division, Conference, MLBPageParameters} from '../../global/global-interface';
import {GlobalSettings} from "../../global/global-settings";
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';

import {CommentModule} from '../../modules/comment/comment.module';
import {LikeUs} from "../../modules/likeus/likeus.module";
import {HeadlineComponent} from '../../components/headline/headline.component';

import {AboutUsModule} from '../../modules/about-us/about-us.module';
import {ArticlesModule} from "../../modules/articles/articles.module";

import {TwitterModule, twitterModuleData} from "../../modules/twitter/twitter.module";
import {TwitterService} from '../../services/twitter.service';

import {ShareModule, ShareModuleInput} from '../../modules/share/share.module';

import {DYKModule, dykModuleData} from "../../modules/dyk/dyk.module";
import {DykService} from '../../services/dyk.service';

import {FAQModule, faqModuleData} from "../../modules/faq/faq.module";
import {FaqService} from '../../services/faq.service';

import {BoxScoresModule} from '../../modules/box-scores/box-scores.module';
import {BoxScoresService} from '../../services/box-scores.service';

import {ComparisonModule, ComparisonModuleData} from '../../modules/comparison/comparison.module';
import {ComparisonStatsService} from '../../services/comparison-stats.service';

import {StandingsModule, StandingsModuleData} from '../../modules/standings/standings.module';
import {MLBStandingsTabData} from '../../services/standings.data';
import {StandingsService} from '../../services/standings.service';

import {SchedulesService} from '../../services/schedules.service';
import {SchedulesModule} from '../../modules/schedules/schedules.module';

import {TeamRosterModule, RosterModuleData} from '../../modules/team-roster/team-roster.module';
import {RosterService} from '../../services/roster.service';
import {TeamRosterData} from '../../services/roster.data';

import {ProfileHeaderData, ProfileHeaderModule} from '../../modules/profile-header/profile-header.module';
import {IProfileData, ProfileHeaderService} from '../../services/profile-header.service';

import {NewsModule} from '../../modules/news/news.module';
import {NewsService} from '../../services/news.service';

import {PlayerStatsModule, PlayerStatsModuleData} from '../../modules/player-stats/player-stats.module';
import {PlayerStatsService} from '../../services/player-stats.service'
import {MLBPlayerStatsTableData} from '../../services/player-stats.data'

//module | interface | service
import {DraftHistoryModule} from '../../modules/draft-history/draft-history.module';

import {ImagesMedia} from "../../components/carousels/images-media-carousel/images-media-carousel.component";
import {ImagesService} from "../../services/carousel.service";

import {ListOfListsModule} from "../../modules/list-of-lists/list-of-lists.module";
import {ListOfListsService} from "../../services/list-of-lists.service";

import {TransactionsModule, TransactionModuleData} from "../../modules/transactions/transactions.module";
import {TransactionsService} from "../../services/transactions.service";
import {DailyUpdateModule} from "../../modules/daily-update/daily-update.module";
import {DailyUpdateService, DailyUpdateData} from "../../services/daily-update.service";

import {SidekickWrapper} from "../../components/sidekick-wrapper/sidekick-wrapper.component";

import {ResponsiveWidget} from '../../components/responsive-widget/responsive-widget.component';

import {SeoService} from '../../seo.service';
import {ArticleDataService} from "../../services/ai-article.service";

@Component({
    selector: 'Team-page',
    templateUrl: './app/webpages/team-page/team.page.html',
    directives: [
        SidekickWrapper,
        LoadingComponent,
        ErrorComponent,
        DailyUpdateModule,
        SchedulesModule,
        BoxScoresModule,
        DraftHistoryModule,
        HeadlineComponent,
        ProfileHeaderModule,
        StandingsModule,
        CommentModule,
        DYKModule,
        FAQModule,
        LikeUs,
        TwitterModule,
        ComparisonModule,
        ShareModule,
        TeamRosterModule,
        NewsModule,
        AboutUsModule,
        ArticlesModule,
        ImagesMedia,
        ListOfListsModule,
        PlayerStatsModule,
        TransactionsModule,
        ResponsiveWidget
    ],
    providers: [
      BoxScoresService,
      SchedulesService,
      StandingsService,
      ProfileHeaderService,
      RosterService,
      ListOfListsService,
      ImagesService,
      NewsService,
      FaqService,
      DykService,
      PlayerStatsService,
      TransactionsService,
      ComparisonStatsService,
      DailyUpdateService,
      TwitterService,
      Title
    ]
})

export class TeamPage implements OnInit {
    public widgetPlace: string = "widgetForModule";
    public shareModuleInput:ShareModuleInput;
    private headlineData:any;
    headerData:any;
    pageParams:MLBPageParameters;
    partnerID:string = null;
    hasError: boolean = false;

    profileHeaderData:ProfileHeaderData;
    profileData:IProfileData;
    comparisonModuleData: ComparisonModuleData;
    standingsData: StandingsModuleData;
    playerStatsData: PlayerStatsModuleData;
    rosterData: RosterModuleData<TeamRosterData>;
    dailyUpdateData: DailyUpdateData;
    seasonBase: string;


    imageData:any;
    copyright:any;
    imageTitle: any;
    profileType:string = "team";
    isProfilePage:boolean = true;
    // draftHistoryData:any;

    boxScoresData:any;
    currentBoxScores:any;
    dateParam:any;

    transactionsData:TransactionModuleData;
    // currentYear: any;

    schedulesData:any;

    profileName:string;
    listOfListsData:Object; // paginated data to be displayed
    newsDataArray: Array<Object>;
    faqData: Array<faqModuleData>;
    dykData: Array<dykModuleData>;
    twitterData: Array<twitterModuleData>;

    constructor(private _params:RouteParams,
                private _router:Router,
                private _title: Title,
                private _standingsService:StandingsService,
                private _boxScores:BoxScoresService,
                private _schedulesService:SchedulesService,
                private _profileService:ProfileHeaderService,
                private _lolService: ListOfListsService,
                private _transactionsService:TransactionsService,
                private _imagesService:ImagesService,
                private _playerStatsService: PlayerStatsService,
                private _rosterService: RosterService,
                private _newsService: NewsService,
                private _faqService: FaqService,
                private _dykService: DykService,
                private _twitterService: TwitterService,
                private _comparisonService: ComparisonStatsService,
                private _dailyUpdateService: DailyUpdateService,
                private _seoService: SeoService,
                private _headlineDataService:ArticleDataService
              ) {
        this.pageParams = {
            teamId: Number(_params.get("teamId"))
        };
        GlobalSettings.getPartnerID(_router, partnerID => {
            this.partnerID = partnerID;
        });
    }

    ngOnInit() {
      var currDate = new Date();
    //   this.currentYear = currDate.getFullYear();
      var currentUnixDate = currDate.getTime();
      //convert currentDate(users local time) to Unix and push it into boxScoresAPI as YYYY-MM-DD in EST using moment timezone (America/New_York)
      this.dateParam ={
        profile:'team',//current profile page
        teamId:this.pageParams.teamId, // teamId if it exists
        date: GlobalFunctions.getDateElement(currentUnixDate, "fullDate")
      }

      this.setupProfileData();
    }

    /**
     *
     * Profile Header data is needed to fill in data info for other modules.
     * It is required to synchronously aquire data first before making any asynchronous
     * calls from other modules.
     *
     **/
    private setupProfileData() {
        this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
            data => {
                /*** About the [Team Name] ***/
                this.seasonBase = data.pageParams.seasonId;
                this.metaTags(data);
                this.pageParams = data.pageParams;
                this.profileData = data;
                this.profileName = data.teamName;
                this._title.setTitle(GlobalSettings.getPageTitle(this.profileName));
                this.profileHeaderData = this._profileService.convertToTeamProfileHeader(data);
                this.dailyUpdateModule(this.pageParams.teamId);
                this.getHeadlines();

                /*** Keep Up With Everything [Team Name] ***/
                this.getBoxScores(this.dateParam);
                this.getSchedulesData('pre-event');//grab pre event data for upcoming games
                this.standingsData = this._standingsService.loadAllTabsForModule(this.pageParams, this.pageParams.teamId, data.teamName);
                this.rosterData = this._rosterService.loadAllTabsForModule(this.pageParams.teamId, data.teamName, this.pageParams.conference, true);
                this.playerStatsData = this._playerStatsService.loadAllTabsForModule(this.pageParams.teamId, data.teamName, true,this.seasonBase);
                this.transactionsData = this._transactionsService.loadAllTabsForModule(data.teamName, this.pageParams.teamId);
                //this.loadMVP
                this.setupComparisonData();

                /*** Other [League Name] Content You May Love ***/
                this.getImages(this.imageData);
                this.getDykService();
                this.getFaqService();
                this.setupListOfListsModule();
                this.getNewsService();

                /*** Interact With [League Name]’s Fans ***/
                this.getTwitterService();
                this.setupShareModule();
            },
            err => {
                this.hasError = true;
                console.log("Error getting team profile data for " + this.pageParams.teamId, err);
            }
        );
    }

    private metaTags(data){
      //This call will remove all meta tags from the head.
      this._seoService.removeMetaTags();
      //create meta description that is below 160 characters otherwise will be truncated
      let metaDesc =  data.headerData.description;
      let link = window.location.href;
      var keywords = "baseball, team page, " + GlobalSettings.getSportLeagueAbbrv();
      keywords += data.profileName ? ', ' + data.profileName : '';
      this._seoService.setCanonicalLink(this._params.params, this._router);
      this._seoService.setOgTitle(data.profileName);
      this._seoService.setOgDesc(metaDesc);
      this._seoService.setOgType('image');
      this._seoService.setOgUrl(link);
      this._seoService.setOgImage(GlobalSettings.getImageUrl(data.headerData.profileImage));
      this._seoService.setTitle(data.profileName);
      this._seoService.setMetaDescription(metaDesc);
      this._seoService.setMetaRobots('Index, Follow');
      this._seoService.setIsArticle("false");
      this._seoService.setPageUrl(link);
      this._seoService.setSearchType("team profile page");
      this._seoService.setCategory("baseball, " + GlobalSettings.getSportLeagueAbbrv());
      this._seoService.setPageTitle(data.profileName);
      this._seoService.setImageUrl(data.fullProfileImageUrl);
      this._seoService.setKeywords(keywords);
      this._seoService.setPageDescription(metaDesc);
    }

    private dailyUpdateModule(teamId: number) {
        this._dailyUpdateService.getTeamDailyUpdate(teamId)
            .subscribe(data => {
                this.dailyUpdateData = data;
            },
            err => {
                this.dailyUpdateData = this._dailyUpdateService.getErrorData();
                console.log("Error getting daily update data", err);
            });
    }

    private getHeadlines(){
        this._headlineDataService.getAiHeadlineData(this.pageParams.teamId, false)
            .subscribe(
                HeadlineData => {
                    this.headlineData = HeadlineData;
                },
                err => {
                    console.log("Error loading AI headline data for " + this.pageParams.teamId, err);
                }
            )
    } //getHeadlines

    private getTwitterService() {
        this._twitterService.getTwitterService(this.profileType, this.pageParams.teamId)
            .subscribe(data => {
                this.twitterData = data;
            },
            err => {
                console.log("Error getting twitter data");
            });
    }

    private getDykService() {
        this._dykService.getDykService(this.profileType, this.pageParams.teamId)
            .subscribe(data => {
                if(data.length <= 0) {
                  this.dykData = null;
                } else {
                  this.dykData = data;
                }
            },
            err => {
                console.log("Error getting did you know data");
            });
    }

    private getFaqService() {
        this._faqService.getFaqService(this.profileType, this.pageParams.teamId)
            .subscribe(data => {
                    this.faqData = data;
                },
                err => {
                    console.log("Error getting faq data for team", err);
                });
    }


    private getNewsService() {
        this._newsService.getNewsService(this.profileName)
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

    //api for Schedules
    private getSchedulesData(status){
      var limit = 5;
      this._schedulesService.getSchedulesService('team', status, limit, 1, true, this.pageParams.teamId) // isTeamProfilePage = true
      .subscribe(
        data => {
          this.schedulesData = data;
        },
        err => {
          console.warn("Error getting Schedules Data -- Data Insufficient -- HRL season data for upcoming season is not in place.");
        }
      )
    }

    private getImages(imageData) {
        this._imagesService.getImages(this.profileType, this.pageParams.teamId)
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
                console.log("Error getting comparison data for "+ this.pageParams.teamId, err);
            });
    }

    private standingsTabSelected(tabData: Array<any>) {
        //only show 5 rows in the module
        this._standingsService.getStandingsTabData(tabData, this.pageParams, (data) => {}, 5);
    }

    private playerStatsTabSelected(tabData: Array<any>) {
         //only show 4 rows in the module
        this._playerStatsService.getStatsTabData(tabData, this.pageParams, data => {}, 5, this.seasonBase);
    }

    private setupShareModule() {
        let profileHeaderData = this.profileHeaderData;
        let imageUrl = !profileHeaderData.profileImageUrl ? GlobalSettings.getImageUrl('/mlb/players/no-image.png') : profileHeaderData.profileImageUrl;
        let shareText = !profileHeaderData.profileName ?
            'Share This Profile Below' :
            'Share ' + GlobalFunctions.convertToPossessive(profileHeaderData.profileName) + ' Profile Below:';

        this.shareModuleInput = {
            imageUrl: imageUrl,
            shareText: shareText
        };
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

    setupListOfListsModule() {
        let params = {
          id : this.pageParams.teamId,
          limit : 5,
          pageNum : 1
        }
        this._lolService.getListOfListsService(params, "team", "module")
            .subscribe(
                listOfListsData => {
                    this.listOfListsData = listOfListsData.listData;
                    this.listOfListsData["type"] = "team";
                    this.listOfListsData["id"] = this.pageParams.teamId;
                },
                err => {
                    console.log('Error: listOfListsData API: ', err);
                }
            );
    }
}
