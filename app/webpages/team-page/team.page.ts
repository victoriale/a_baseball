import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Injectable} from 'angular2/core';
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
import {ProfileHeaderService} from '../../services/profile-header.service';

import {NewsModule} from '../../modules/news/news.module';
import {NewsService} from '../../services/news.service';

import {PlayerStatsModule, PlayerStatsModuleData} from '../../modules/player-stats/player-stats.module';
import {PlayerStatsService} from '../../services/player-stats.service'
import {MLBPlayerStatsTableData} from '../../services/player-stats.data'

//module | interface | service
import {DraftHistoryModule} from '../../modules/draft-history/draft-history.module';
import {DraftHistoryService} from '../../services/draft-history.service';

import {ImagesMedia} from "../../components/carousels/images-media-carousel/images-media-carousel.component";
import {ImagesService} from "../../services/carousel.service";

import {ListOfListsModule} from "../../modules/list-of-lists/list-of-lists.module";
import {ListOfListsService} from "../../services/list-of-lists.service";

import {TransactionsModule} from "../../modules/transactions/transactions.module";
import {TransactionsService} from "../../services/transactions.service";
import {DailyUpdateModule} from "../../modules/daily-update/daily-update.module";

declare var moment;

@Component({
    selector: 'Team-page',
    templateUrl: './app/webpages/team-page/team.page.html',
    directives: [
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
        TransactionsModule
    ],
    providers: [
      BoxScoresService,
      SchedulesService,
      DraftHistoryService,
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
      TwitterService
    ]
})

export class TeamPage implements OnInit {
    public shareModuleInput:ShareModuleInput;
    headerData:any;
    pageParams:MLBPageParameters;
    hasError: boolean = false;

    profileHeaderData:ProfileHeaderData;
    comparisonModuleData: ComparisonModuleData;
    standingsData: StandingsModuleData;
    playerStatsData: PlayerStatsModuleData;
    rosterData: RosterModuleData<TeamRosterData>;

    imageData:any;
    copyright:any;
    profileType:string = "team";
    isProfilePage:boolean = true;
    draftHistoryData:any;

    boxScoresData:any;
    dateParam:any;

    transactionsData:any;
    currentYear: number;

    schedulesData:any;

    profileName:string;
    listOfListsData:Object; // paginated data to be displayed
    newsDataArray: Array<Object>;
    faqData: Array<faqModuleData>;
    dykData: Array<dykModuleData>;
    twitterData: Array<twitterModuleData>;

    constructor(private _params:RouteParams,
                private _standingsService:StandingsService,
                private _boxScores:BoxScoresService,
                private _schedulesService:SchedulesService,
                private _profileService:ProfileHeaderService,
                private _draftService:DraftHistoryService,
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
                private _globalFunctions:GlobalFunctions) {
        this.pageParams = {
            teamId: Number(_params.get("teamId"))
        };
        this.currentYear = new Date().getFullYear();
    }

    ngOnInit() {
      var currentUnixDate = new Date().getTime();
      console.log('currentUnixDate', currentUnixDate);
      //convert currentDate(users local time) to Unix and push it into boxScoresAPI as YYYY-MM-DD in EST using moment timezone (America/New_York)
      this.dateParam ={
        profile:'team',//current profile page
        teamId:this.pageParams.teamId, // teamId if it exists
        date: moment.tz( currentUnixDate , 'America/New_York' ).format('YYYY-MM-DD')
      }
      console.log('dateParam',this.dateParam);

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
                this.pageParams = data.pageParams;
                this.profileName = data.teamName;
                this.profileHeaderData = this._profileService.convertToTeamProfileHeader(data);

                /*** Keep Up With Everything [Team Name] ***/
                this.getBoxScores(this.dateParam.date);
                this.getSchedulesData('pre-event');//grab pre event data for upcoming games
                this.standingsData = this._standingsService.loadAllTabsForModule(this.pageParams, data.teamName);
                this.rosterData = this._rosterService.loadAllTabsForModule(this.pageParams.teamId, data.teamName, this.pageParams.conference);
                this.playerStatsData = this._playerStatsService.loadAllTabsForModule(this.pageParams.teamId, data.teamName);
                this.transactionsModule(this.currentYear, this.pageParams.teamId);
                this.draftHistoryModule(this.currentYear, this.pageParams.teamId);
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
                console.log("Error getting team profile data for " + this.pageParams.teamId + ": " + err);
            }
        );
    }
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
                this.dykData = data;
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
                    console.log("Error getting faq data");
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
    private getBoxScores(date?){
      if(typeof date == 'undefined'){
        var currentUnixDate = new Date().getTime();
        //convert currentDate(users local time) to Unix and push it into boxScoresAPI as YYYY-MM-DD in EST using moment timezone (America/New_York)
        this.dateParam.date = moment.tz( currentUnixDate , 'America/New_York' ).format('YYYY-MM-DD');
        date = this.dateParam.date;
      }
      console.log('Current Date sending to Box Scores API',date);
      this._boxScores.getBoxScoresService('team', date, this.pageParams.teamId)
      .subscribe(
        data => {
          this.boxScoresData = data;
        },
        err => {
          console.log("Error getting Schedules Data");
        }
      )
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
      this._schedulesService.getSchedulesService('team', status, limit, 1, this.pageParams.teamId)
      .subscribe(
        data => {
          this.schedulesData = data;
        },
        err => {
          console.log("Error getting Schedules Data");
        }
      )
    }

    private getImages(imageData) {
        this._imagesService.getImages(this.profileType, this.pageParams.teamId)
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
                console.log("Error getting comparison data for "+ this.pageParams.teamId, err);
            });
    }

    private standingsTabSelected(tabData: Array<any>) {
        //only show 5 rows in the module
        this._standingsService.getStandingsTabData(tabData, this.pageParams, (data) => {}, 5);
    }

    private playerStatsTabSelected(tabData: Array<any>) {
         //only show 4 rows in the module
        this._playerStatsService.getStatsTabData(tabData, this.pageParams, data => {}, 4);
    }

    private setupShareModule() {
        let profileHeaderData = this.profileHeaderData;
        let imageUrl = !profileHeaderData.profileImageUrl ? GlobalSettings.getImageUrl('/mlb/players/no-image.png') : profileHeaderData.profileImageUrl;
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
        this.draftHistoryModule(event, this.pageParams.teamId);
        // this.draftData = this.teamPage.draftHistoryModule(event, this.teamId);
    }

    private transactionsTab(event) {
      let transactionType;
      switch( event ){
        case "Transactions":
          transactionType = "transactions";
          break;
        case "Suspensions":
          transactionType = "suspensions";
          break;
        case "Injuries":
          transactionType = "injuries";
          break;
        default:
          console.error("Supplied transaction name was not found.");
          transactionType = "transactions";
          break;
      }
      this.transactionsModule(transactionType, this.pageParams.teamId);
    }

    private draftHistoryModule(year: number, teamId: number) {
        this._draftService.getDraftHistoryService(year, teamId, 'module')
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
                            data: "Sorry, the " + this.profileHeaderData.profileName + " do not currently have any data for the " + year + " draft history",
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

  private transactionsModule(transactionType, teamId) {
    this._transactionsService.getTransactionsService(transactionType, teamId, 'module')
      .subscribe(
        transactionsData => {
          var dataArray, transactionsDataArray, carouselDataArray;
          if (typeof dataArray == 'undefined') {//makes sure it only runs once
            dataArray = transactionsData.tabArray;
          }
          if (transactionsData.listData.length == 0) {//makes sure it only runs once
            transactionsDataArray = false;
          } else {
            transactionsDataArray = transactionsData.listData;
          }
          carouselDataArray = transactionsData.carData
          return this.transactionsData = {
            tabArray: dataArray,
            listData: transactionsDataArray,
            carData: carouselDataArray,
            errorData: {
              data: "Sorry, the " + this.profileHeaderData.profileName + " do not currently have any data for "+ transactionType + ".",
              icon: "fa fa-remove"
            }
          }
        },
        err => {
          console.log('Error: transactionsData API: ', err);
          // this.isError = true;
        }
      );
  }


    setupListOfListsModule() {
        // getListOfListsService(version, type, id, scope?, count?, page?){
        let params = {
          id : this.pageParams.teamId,
          limit : 4,
          pageNum : 1,
          type : "team"
        }
        this._lolService.getListOfListsService(params, "module")
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
