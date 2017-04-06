import {Component, OnInit} from '@angular/core';
import {Router, RouteParams, RouteConfig} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {MLBPageParameters} from '../../global/global-interface';
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';

import {AboutUsModule} from '../../modules/about-us/about-us.module';
import {LikeUs} from "../../modules/likeus/likeus.module";

import {DYKModule, dykModuleData} from "../../modules/dyk/dyk.module";
import {DykService} from '../../services/dyk.service';

import {FAQModule, faqModuleData} from "../../modules/faq/faq.module";
import {FaqService} from '../../services/faq.service';

import {BoxScoresModule} from '../../modules/box-scores/box-scores.module';
import {BoxScoresService} from '../../services/box-scores.service';

import {TwitterModule, twitterModuleData} from "../../modules/twitter/twitter.module";
import {TwitterService} from '../../services/twitter.service';

import {SeasonStatsService} from '../../services/season-stats.service';
import {SeasonStatsModule} from '../../modules/season-stats/season-stats.module';

import {ComparisonModule, ComparisonModuleData} from '../../modules/comparison/comparison.module';
import {ComparisonStatsService} from '../../services/comparison-stats.service';

import {CommentModule} from '../../modules/comment/comment.module';

import {StandingsModule, StandingsModuleData} from '../../modules/standings/standings.module';
import {MLBStandingsTabData} from '../../services/standings.data';
import {StandingsService} from '../../services/standings.service';

import {ProfileHeaderData, ProfileHeaderModule} from '../../modules/profile-header/profile-header.module';
import {ProfileHeaderService} from '../../services/profile-header.service';

import {ShareModule, ShareModuleInput} from '../../modules/share/share.module';

import {HeadlineComponent} from '../../components/headline/headline.component';

import {NewsModule} from '../../modules/news/news.module';
import {NewsService} from '../../services/news.service';

import {SchedulesModule} from '../../modules/schedules/schedules.module';
import {SchedulesService} from '../../services/schedules.service';

import {GlobalSettings} from "../../global/global-settings";
import {ImagesService} from "../../services/carousel.service";
import {ImagesMedia} from "../../components/carousels/images-media-carousel/images-media-carousel.component";
import {GlobalFunctions} from "../../global/global-functions";
import {ListOfListsService} from "../../services/list-of-lists.service";
import {ListOfListsModule} from "../../modules/list-of-lists/list-of-lists.module";

import {DailyUpdateModule} from "../../modules/daily-update/daily-update.module";
import {DailyUpdateService, DailyUpdateData} from "../../services/daily-update.service";

import {SidekickWrapper} from "../../components/sidekick-wrapper/sidekick-wrapper.component";

import {ResponsiveWidget} from '../../components/responsive-widget/responsive-widget.component';

import {SeoService} from '../../seo.service';

@Component({
    selector: 'Player-page',
    templateUrl: './app/webpages/player-page/player.page.html',
    directives: [
      SidekickWrapper,
      LoadingComponent,
      ErrorComponent,
      SchedulesModule,
      BoxScoresModule,
      ProfileHeaderModule,
      StandingsModule,
      HeadlineComponent,
      CommentModule,
      DYKModule,
      FAQModule,
      LikeUs,
      TwitterModule,
      SeasonStatsModule,
      ComparisonModule,
      NewsModule,
      ShareModule,
      AboutUsModule,
      ListOfListsModule,
      DailyUpdateModule,
      ImagesMedia,
      ResponsiveWidget
    ],
    providers: [
      BoxScoresService,
      SchedulesService,
      StandingsService,
      ProfileHeaderService,
      ImagesService,
      NewsService,
      FaqService,
      DykService,
      ListOfListsService,
      SeasonStatsService,
      ComparisonStatsService,
      DailyUpdateService,
      TwitterService,
      Title
    ],
})

export class PlayerPage implements OnInit {
  public widgetPlace: string = "widgetForModule";
  public shareModuleInput:ShareModuleInput;
  pageParams:MLBPageParameters;
  partnerID:string = null;
  hasError: boolean = false;

  profileHeaderData: ProfileHeaderData;
  standingsData:StandingsModuleData;
  dailyUpdateData: DailyUpdateData;
  seasonStatsData: any;
  comparisonModuleData: ComparisonModuleData;

  boxScoresData:any;
  currentBoxScores:any;
  dateParam:any;
  seasonBase:any;

  imageData:any;
  copyright:any;
  imageTitle:any;
  profileType:string = "player";
  isProfilePage:boolean = true;
  profileName:string;
  teamName: string;
  teamId:number;
  newsDataArray: Array<Object>;
  faqData: Array<faqModuleData>;
  dykData: Array<dykModuleData>;
  listOfListsData: Object; // paginated data to be displayed
  twitterData: Array<twitterModuleData>;
  schedulesData:any;

  constructor(private _params:RouteParams,
              private _router:Router,
              private _title: Title,
              private _standingsService:StandingsService,
              private _boxScores:BoxScoresService,
              private _schedulesService:SchedulesService,
              private _profileService:ProfileHeaderService,
              private _imagesService:ImagesService,
              private _newsService: NewsService,
              private _faqService: FaqService,
              private _dykService: DykService,
              private _lolService : ListOfListsService,
              private _twitterService: TwitterService,
              private _seasonStatsService: SeasonStatsService,
              private _comparisonService: ComparisonStatsService,
              private _dailyUpdateService: DailyUpdateService,
              private _seoService: SeoService) {
      this.pageParams = {
          playerId: Number(_params.get("playerId"))
      };

    GlobalSettings.getPartnerID(_router, partnerID => {
        this.partnerID = partnerID;
    });
  }

  ngOnInit() {
      this.setupPlayerProfileData();
  }

  private setupPlayerProfileData() {
      this._profileService.getPlayerProfile(this.pageParams.playerId).subscribe(
          data => {
              /*** About [Player Name] ***/
              this.seasonBase = data.headerData.stats.seasonId;
              this.metaTags(data);
              this.pageParams = data.pageParams;
              this.profileName = data.headerData.info.playerName;
              this.teamName = data.headerData.info.teamName;
              this.teamId = data.headerData.info.teamId;
              this._title.setTitle(GlobalSettings.getPageTitle(this.profileName));
              this.profileHeaderData = this._profileService.convertToPlayerProfileHeader(data);
              this.setupTeamProfileData();
              this.dailyUpdateModule(this.pageParams.playerId);

              //get current date for box-scores
              var currentUnixDate = new Date().getTime();
              this.dateParam ={
                profile:'player',
                teamId:this.teamId, // teamId if it exists
                date: GlobalFunctions.getDateElement(currentUnixDate, "fullDate")
              }
              this.getBoxScores(this.dateParam);

              /*** Keep Up With Everything [Player Name] ***/
              this.getSchedulesData('pre-event');//grab pre event data for upcoming games
              this.setupSeasonstatsData();
              this.setupComparisonData();
              /*** Other [League Name] Content You May Love ***/
              this.getImages(this.imageData);
              this.getDykService();
              this.getFaqService();
              this.setupListOfListsModule();
              this.getNewsService();

              /*** Interact With [League Name]’s Fans ***/
              this.setupShareModule();
              this.getTwitterService();
          },
          err => {
              this.hasError = true;
              console.log("Error getting player profile data for " + this.pageParams.playerId + ": " + err);
          }
      );
  }

  private metaTags(data){
    //This call will remove all meta tags from the head.
    this._seoService.removeMetaTags();
    //create meta description that is below 160 characters otherwise will be truncated
    let metaDesc =  data.headerData.description;
    let link = window.location.href;
    let params = data['pageParams'];
    var keywords = "baseball, " + GlobalSettings.getSportLeagueAbbrv();
    keywords += params.playerName ? ", " + params.playerName : "";
    keywords += params.teamName ? ", " + params.teamName : "";
    this._seoService.setCanonicalLink(this._params.params, this._router);
    this._seoService.setOgTitle(data.profileName);
    this._seoService.setOgDesc(metaDesc);
    this._seoService.setOgType('image');
    this._seoService.setOgUrl(link);
    this._seoService.setOgImage(data.fullProfileImageUrl);
    this._seoService.setTitle(data.profileName);
    this._seoService.setMetaDescription(metaDesc);
    this._seoService.setMetaRobots('Index, Follow');
    this._seoService.setIsArticle("false");
    this._seoService.setSearchType("player profile page");
    this._seoService.setPageTitle(data.profileName);
    this._seoService.setCategory("baseball, " + GlobalSettings.getSportLeagueAbbrv());
    this._seoService.setImageUrl(data.fullProfileImageUrl);
    this._seoService.setPageUrl(link);
    this._seoService.setKeywords(keywords);
    this._seoService.setPageDescription(metaDesc);
  }

private dailyUpdateModule(playerId: number) {
    this._dailyUpdateService.getPlayerDailyUpdate(playerId)
        .subscribe(data => {
            this.dailyUpdateData = data;
        },
        err => {
            this.dailyUpdateData = this._dailyUpdateService.getErrorData();
            console.log("Error getting daily update data", err);
        });
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
  private setupSeasonstatsData() {
      this._seasonStatsService.getPlayerStats(this.pageParams.playerId)
      .subscribe(
          data => {
              this.seasonStatsData = data;
          },
          err => {
              console.log("Error getting season stats data for "+ this.pageParams.playerId, err);
          });
  }
  //api for Schedules
  private getSchedulesData(status){
    var limit = 5;
    if(status == 'post-event'){
      limit = 3;
    }
    this._schedulesService.getSchedulesService('team', status, limit, 1, false, this.pageParams.teamId)// isTeamProfilePage = false
    .subscribe(
      data => {
        this.schedulesData = data;
      },
      err => {
        console.warn("Error getting Schedules Data -- Data Insufficient -- HRL season data for upcoming season is not in place.");
      }
    )
  }

  private getTwitterService() {
    this._twitterService.getTwitterService("team", this.pageParams.teamId) //getting team twitter information for now
        .subscribe(data => {
            this.twitterData = data;
        },
        err => {
            console.log("Error getting twitter data");
        });
    }

    private getDykService() {
        this._dykService.getDykService(this.profileType, this.pageParams.playerId)
            .subscribe(data => {
                this.dykData = data;
            },
            err => {
                console.log("Error getting did you know data");
            });
    }

    private getFaqService(){
      this._faqService.getFaqService(this.profileType, this.pageParams.playerId)
          .subscribe(data => {
            this.faqData = data;
          },
          err => {
              console.log("Error getting faq data for player", err);
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
    //function for MLB/Team Profiles
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
        this._imagesService.getImages(this.profileType, this.pageParams.playerId)
            .subscribe(data => {
                return this.imageData = data.imageArray, this.copyright = data.copyArray, this.imageTitle = data.titleArray;
            },
            err => {
                console.log("Error getting image data" + err);
            });
    }

    //This gets team-specific data such as
    // conference and division
    private setupTeamProfileData() {
        this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
            data => {
                this.standingsData = this._standingsService.loadAllTabsForModule(data.pageParams, null, data.teamName);
            },
            err => {
                console.log("Error getting player profile data for " + this.pageParams.playerId + ": " + err);
            }
        );
    }

    private standingsTabSelected(tabData: Array<any>) {
        //only show 5 rows in the module;
        this._standingsService.getStandingsTabData(tabData, this.pageParams, (data) => {}, 5);
    }

    private setupComparisonData() {
        this._comparisonService.getInitialPlayerStats(this.pageParams).subscribe(
            data => {
                this.comparisonModuleData = data;
            },
            err => {
                console.log("Error getting comparison data for "+ this.pageParams.playerId, err);
            });
    }

    private setupShareModule() {
        let profileHeaderData = this.profileHeaderData;
        let imageUrl = typeof profileHeaderData.profileImageUrl === 'undefined' || profileHeaderData.profileImageUrl === null ? GlobalSettings.getImageUrl('/mlb/players/no-image.png') : profileHeaderData.profileImageUrl;
        let shareText = typeof profileHeaderData.profileName === 'undefined' || profileHeaderData.profileName === null ?
            'Share This Profile Below' :
            'Share ' + GlobalFunctions.convertToPossessive(profileHeaderData.profileName) + ' Profile Below:';

        this.shareModuleInput = {
            imageUrl: imageUrl,
            shareText: shareText
        };
    }

    setupListOfListsModule() {
      let params = {
        id : this.pageParams.playerId,
        limit : 5,
        pageNum : 1
      }
      this._lolService.getListOfListsService(params, "player", "module")
        .subscribe(
          listOfListsData => {
            this.listOfListsData = listOfListsData.listData;
            this.listOfListsData["type"] = "player";
            this.listOfListsData["id"] = this.pageParams.playerId;
          },
          err => {
            console.log('Error: listOfListsData API: ', err);
          }
        );
    }
}
