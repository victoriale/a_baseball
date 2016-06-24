import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {Title} from 'angular2/platform/browser';

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
import {ProfileHeaderService} from '../../services/profile-header.service';

import {Division, Conference, MLBPageParameters} from '../../global/global-interface';

import {HeadlineComponent} from '../../components/headline/headline.component';

import {DraftHistoryModule} from '../../modules/draft-history/draft-history.module';
import {DraftHistoryService} from '../../services/draft-history.service';

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

declare var moment;

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
        ImagesMedia],
    providers: [
        BoxScoresService,
        SchedulesService,
        ListPageService,
        StandingsService,
        ProfileHeaderService,
        DraftHistoryService,
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
    public shareModuleInput:ShareModuleInput;

    pageParams:MLBPageParameters = {};
    currentYear: number;
    partnerID:string = null;
    hasError: boolean = false;

    standingsData:StandingsModuleData;

    profileHeaderData:ProfileHeaderData;

    comparisonModuleData: ComparisonModuleData;

    transactionsData:TransactionModuleData;

    boxScoresData:any;
    currentBoxScores:any;
    dateParam:any;
    draftHistoryData:any;

    batterParams:any;
    batterData:Array<BaseballMVPTabData>;
    pitcherParams:any;
    pitcherData:Array<BaseballMVPTabData>;

    imageData:any;
    copyright:any;
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
                private _draftService:DraftHistoryService,
                private _faqService: FaqService,
                private _dykService: DykService,
                private _twitterService: TwitterService,
                private _comparisonService: ComparisonStatsService,
                private _transactionsService: TransactionsService,
                private _lolService: ListOfListsService,
                private listService:ListPageService) {
        _title.setTitle(GlobalSettings.getPageTitle("MLB"));

        this.currentYear = new Date().getFullYear();
        
        //for boxscores
        var currentUnixDate = new Date().getTime();
        //convert currentDate(users local time) to Unix and push it into boxScoresAPI as YYYY-MM-DD in EST using moment timezone (America/New_York)
        this.dateParam ={
          profile:'league',//current profile page
          teamId:null,
          date: moment.tz( currentUnixDate , 'America/New_York' ).format('YYYY-MM-DD')
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
                this.profileHeaderData = this._profileService.convertToLeagueProfileHeader(data)
                this.profileName = "MLB";

                /*** Keep Up With Everything MLB ***/
                this.getBoxScores(this.dateParam);
                this.getSchedulesData('pre-event');//grab pre event data for upcoming games
                this.standingsData = this._standingsService.loadAllTabsForModule(this.pageParams);                
                this.draftHistoryModule(this.currentYear);
                this.transactionsData = this._transactionsService.loadAllTabsForModule(data.profileName1);
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
                // this.setupListOfListsModule(); //NO VALID API YET
                this.getDykService(this.profileType);
                this.getTwitterService(this.profileType);
            },
            err => {
                this.hasError = true;
                console.log("Error getting team profile data for mlb", err);
            }
        );
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
      if(status == 'post-event'){
        limit = 3;
      }
      this._schedulesService.getSchedulesService('league', status, limit, 1)
      .subscribe(
        data => {
          this.schedulesData = data;
        },
        err => {
          console.log("Error getting Schedules Data");
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
        // getListOfListsService(version, type, id, scope?, count?, page?){
        let params = {
          id : this.pageParams.teamId,
          limit : 4,
          pageNum : 1,
          type : "mbl"
        }
        this._lolService.getListOfListsService(params, "module")
            .subscribe(
                listOfListsData => {
                    this.listOfListsData = listOfListsData.listData;
                    this.listOfListsData["type"] = "mbl";
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
                    return this.imageData = data.imageArray, this.copyright = data.copyArray;
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
        let shareText = !profileHeaderData.profileName ? 'Share This Profile Below' : 'Share ' + profileHeaderData.profileName + '\'s Profile Below:';

        this.shareModuleInput = {
            imageUrl: imageUrl,
            shareText: shareText
        };
    }

    //each time a tab is selected the carousel needs to change accordingly to the correct list being shown
    private draftTab(event) {
        var firstTab = 'Current Season';
        if (event == firstTab) {
            event = this.currentYear;
        }
        this.draftHistoryModule(event);
        // this.draftData = this.teamPage.draftHistoryModule(event, this.teamId);
    }

    private draftHistoryModule(year: number) {
      var errorMessage = "Sorry, " + this.profileHeaderData.profileName + " does not currently have any data for the " + year + " draft history";
      this._draftService.getDraftHistoryService(year, null, errorMessage, 'module')
        .subscribe(
            draftData => {
                var dataArray, detailedDataArray, carouselDataArray;
                if (typeof dataArray == 'undefined') {//makes sure it only runs once
                    dataArray = draftData.tabArray;
                }
                if (draftData.listData.length == 0) {//makes sure it only runs once
                    detailedDataArray = false;
                } else {
                    detailedDataArray = draftData.listData;
                }
                carouselDataArray = draftData.carData
                return this.draftHistoryData = {
                    tabArray: dataArray,
                    listData: detailedDataArray,
                    carData: carouselDataArray,
                    errorData: {
                        data: errorMessage,
                        icon: "fa fa-remove"
                    }
                }
            },
            err => {
                console.log('Error: draftData API: ', err);
                // this.isError = true;
            }
        );
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
        this.listService.getListModuleService(tab, this.batterParams)
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
        this.listService.getListModuleService(tab, this.pitcherParams)
            .subscribe(updatedTab => {
                //do nothing?
            }, err => { 
                tab.isLoaded = true;
                console.log('Error: Loading MVP Pitchers: ', err);
            })
    }

    // private getMVP(urlParams, moduleType) {
    //     this.listService.getListModuleService(urlParams, moduleType)
    //         .subscribe(
    //             list => {
    //                 var dataArray, detailedDataArray, carouselDataArray;
    //                 if (list.listData.length == 0) {//makes sure it only runs once
    //                     detailedDataArray = false;
    //                 } else {
    //                     detailedDataArray = list.listData;
    //                 }
    //                 dataArray = list.tabArray;
    //                 carouselDataArray = list.carData;
    //                 if (moduleType == 'batter') {
    //                     this.batterData = {
    //                         query: this.batterParams,
    //                         tabArray: dataArray,
    //                         listData: detailedDataArray,
    //                         carData: carouselDataArray,
    //                         errorData: {
    //                             data: "Sorry, we do not currently have any data for this mvp list",
    //                             icon: "fa fa-remove"
    //                         }
    //                     }
    //                 } else {
    //                     this.pitcherData = {
    //                         query: this.pitcherParams,
    //                         tabArray: dataArray,
    //                         listData: detailedDataArray,
    //                         carData: carouselDataArray,
    //                         errorData: {
    //                             data: "Sorry, we do not currently have any data for this mvp list",
    //                             icon: "fa fa-remove"
    //                         }
    //                     }
    //                 }

    //             },
    //             err => {
    //                 console.log('Error: list API: ', err);
    //                 // this.isError = true;
    //             }
    //         );
    // }
}
