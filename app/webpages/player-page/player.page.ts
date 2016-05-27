import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {MLBPageParameters} from '../../global/global-interface';

import {AboutUsModule} from '../../modules/about-us/about-us.module';
import {LikeUs} from "../../modules/likeus/likeus.module";

import {DYKModule, dykModuleData} from "../../modules/dyk/dyk.module";
import {DykService} from '../../services/dyk.service';

import {FAQModule, faqModuleData} from "../../modules/faq/faq.module";
import {FaqService} from '../../services/faq.service';

import {TwitterModule, twitterModuleData} from "../../modules/twitter/twitter.module";
import {TwitterService} from '../../services/twitter.service';

import {SeasonStatsService} from '../../services/season-stats.service';
import {SeasonStatsModule, SeasonStatsModuleData} from '../../modules/season-stats/season-stats.module';

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

import {BoxScoresModule} from '../../modules/box-scores/box-scores.module';
import {GlobalSettings} from "../../global/global-settings";
import {ImagesService} from "../../services/carousel.service";
import {ImagesMedia} from "../../components/carousels/images-media-carousel/images-media-carousel.component";
import {GlobalFunctions} from "../../global/global-functions";
import {ListOfListsService} from "../../services/list-of-lists.service";
import {ListOfListsModule} from "../../modules/list-of-lists/list-of-lists.module";

@Component({
    selector: 'Player-page',
    templateUrl: './app/webpages/player-page/player.page.html',
    directives: [
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
      ImagesMedia],
    providers: [
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
      TwitterService
    ],
})

export class PlayerPage implements OnInit {
  public shareModuleInput:ShareModuleInput;
  pageParams:MLBPageParameters;
  standingsData:StandingsModuleData;
  profileHeaderData: ProfileHeaderData;
  seasonStatsData: SeasonStatsModuleData;
  comparisonModuleData: ComparisonModuleData;
  imageData:any;
  copyright:any;
  profileType:string = "player";
  isProfilePage:boolean = true;
  profileName:string;
  teamName: string;
  newsDataArray: Array<Object>;
  faqData: Array<faqModuleData>;
  dykData: Array<dykModuleData>;
  listOfListsData: Object; // paginated data to be displayed
  twitterData: Array<twitterModuleData>;
  schedulesData:any;

  constructor(private _params:RouteParams,
              private _standingsService:StandingsService,
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
              private _globalFunctions:GlobalFunctions) {

      this.pageParams = {
          playerId: Number(_params.get("playerId"))
      };

        // Scroll page to top to fix routerLink bug
        window.scrollTo(0, 0);
  }

  ngOnInit() {
      this.setupPlayerProfileData();
  }

  private setupPlayerProfileData() {
      this._profileService.getPlayerProfile(this.pageParams.playerId).subscribe(
          data => {
              /*** About [Player Name] ***/
              this.pageParams = data.pageParams;
              this.profileName = data.headerData.info.playerName;
              this.teamName = data.headerData.info.teamName;
              this.profileHeaderData = this._profileService.convertToPlayerProfileHeader(data);
              this.setupTeamProfileData();

              /*** Keep Up With Everything [Player Name] ***/
              //this.getBoxScores();
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
              console.log("Error getting player profile data for " + this.pageParams.playerId + ": " + err);
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
    this._schedulesService.getSchedulesService('team', status, 5, 1, this.pageParams.teamId)
    .subscribe(
      data => {
        this.schedulesData = data;
      },
      err => {
        console.log("Error getting Schedules Data");
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

    private getImages(imageData) {
        this._imagesService.getImages(this.profileType, this.pageParams.playerId)
            .subscribe(data => {
                return this.imageData = data.imageArray, this.copyright = data.copyArray;
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
                this.standingsData = this._standingsService.loadAllTabsForModule(data.pageParams, data.teamName);
            },
            err => {
                console.log("Error getting player profile data for " + this.pageParams.playerId + ": " + err);
            }
        );
    }

    private standingsTabSelected(tab:MLBStandingsTabData) {
        //only show 5 rows in the module;
        this._standingsService.getStandingsTabData(tab, this.pageParams, (data) => {}, 5);
    }

    private setupComparisonData() {
        this._comparisonService.getInitialPlayerStats(this.pageParams).subscribe(
            data => {
                this.comparisonModuleData = data;
            },
            err => {
                console.log("Error getting comparison data for "+ this.pageParams.playerId + ": " + err);
            });
    }
    private setupSeasonstatsData() {
        this._seasonStatsService.getInitialPlayerStats(this.pageParams)
        .subscribe(
            data => {
                // console.log("set up season stats", data, this.pageParams);
                this.seasonStatsData = data;
            },
            err => {
                console.log("Error getting season stats data for "+ this.pageParams.playerId);
            });
    }
    private setupShareModule() {
        let profileHeaderData = this.profileHeaderData;
        let imageUrl = typeof profileHeaderData.profileImageUrl === 'undefined' || profileHeaderData.profileImageUrl === null ? GlobalSettings.getImageUrl('/mlb/players/no-image.png') : profileHeaderData.profileImageUrl;
        let shareText = typeof profileHeaderData.profileName === 'undefined' || profileHeaderData.profileName === null ? 'Share This Profile Below' : 'Share ' + profileHeaderData.profileName + '\'s Profile Below:';

        this.shareModuleInput = {
            imageUrl: imageUrl,
            shareText: shareText
        };
    }

    setupListOfListsModule() {
      // getListOfListsService(version, type, id, scope?, count?, page?){
      let params = {
        id : this.pageParams.playerId,
        limit : 4,
        pageNum : 1,
        type : "player"
      }
      this._lolService.getListOfListsService(params, "module")
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
