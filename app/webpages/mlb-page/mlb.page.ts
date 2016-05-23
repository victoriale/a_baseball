import {Component, OnInit} from 'angular2/core';

import {AboutUsModule} from '../../modules/about-us/about-us.module';
import {LikeUs} from "../../modules/likeus/likeus.module";
import {TwitterModule} from "../../modules/twitter/twitter.module";
import {ComparisonModule} from '../../modules/comparison/comparison.module';
import {ShareModule, ShareModuleInput} from '../../modules/share/share.module';
import {CommentModule} from '../../modules/comment/comment.module';

import {DYKModule, dykModuleData} from "../../modules/dyk/dyk.module";
import {DykService} from '../../services/dyk.service';

import {FAQModule, faqModuleData} from "../../modules/faq/faq.module";
import {FaqService} from '../../services/faq.service';

import {StandingsModule, StandingsModuleData} from '../../modules/standings/standings.module';
import {MLBStandingsTabData} from '../../services/standings.data';
import {StandingsService} from '../../services/standings.service';

import {SchedulesModule} from '../../modules/schedules/schedules.module';
import {BoxScoresModule} from '../../modules/box-scores/box-scores.module';
import {MVPModule} from '../../modules/mvp/mvp.module';

import {ProfileHeaderData, ProfileHeaderModule} from '../../modules/profile-header/profile-header.module';
import {ProfileHeaderService} from '../../services/profile-header.service';

import {Division, Conference, MLBPageParameters} from '../../global/global-interface';

import {HeadlineComponent} from '../../components/headline/headline.component';

import {NewsModule} from '../../modules/news/news.module';
import {NewsService} from '../../services/news.service';

import {GlobalSettings} from "../../global/global-settings";
import {ListPageService} from '../../services/list-page.service';
import {ImagesService} from "../../services/carousel.service";
import {ImagesMedia} from "../../components/carousels/images-media-carousel/images-media-carousel.component";

@Component({
    selector: 'MLB-page',
    templateUrl: './app/webpages/mlb-page/mlb.page.html',
    directives: [
        MVPModule,
        SchedulesModule,
        BoxScoresModule,
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
        NewsModule,
        AboutUsModule,
        ImagesMedia],
    providers: [
        ListPageService,
        StandingsService,
        ProfileHeaderService,
        ImagesService,
        NewsService,
        FaqService,
        DykService
      ]
})

export class MLBPage implements OnInit {
    public shareModuleInput:ShareModuleInput;

    pageParams:MLBPageParameters = {};

    standingsData:StandingsModuleData;

    profileHeaderData:ProfileHeaderData;

    batterParams:any;
    batterData:any;
    pitcherParams:any;
    pitcherData:any;
    imageData:any;
    copyright:any;
    profileType:string;
    isProfilePage:boolean = false;
    profileName:string;
    listMax:number = 10;
    newsDataArray: Array<Object>;
    faqData: Array<faqModuleData>;
    dykData: Array<dykModuleData>;
    constructor(private _standingsService:StandingsService,
                private _profileService:ProfileHeaderService,
                private _imagesService:ImagesService,
                private _newsService: NewsService,
                private _faqService: FaqService,
                private _dykService: DykService,
                private listService:ListPageService) {
        this.batterParams = { //Initial load for mvp Data
            profile: 'player',
            listname: 'batter-home-runs',
            sort: 'asc',
            conference: 'all',
            division: 'all',
            limit: this.listMax,
            pageNum: 1
        };
        this.pitcherParams = { //Initial load for mvp Data
            profile: 'player',
            listname: 'pitcher-innings-pitched',
            sort: 'asc',
            conference: 'all',
            division: 'all',
            limit: this.listMax,
            pageNum: 1
        };
    }

    ngOnInit() {
        this.setupProfileData();
    }

    private setupProfileData() {
        this._profileService.getMLBProfile().subscribe(
            data => {
                this.profileHeaderData = this._profileService.convertToLeagueProfileHeader(data)
                this.standingsData = this._standingsService.loadAllTabsForModule(this.pageParams);
                this.batterData = this.getMVP(this.batterParams, 'batter');
                this.pitcherData = this.getMVP(this.pitcherParams, 'pitcher');
                this.setupShareModule();
                this.getImages(this.imageData);
                this.getNewsService();
                this.getFaqService(this.profileType);
                this.getDykService(this.profileType);
            },
            err => {
                console.log("Error getting team profile data for " + this.pageParams.teamId + ": " + err);
            }
        );
    }
    private getDykService(profileType) {
      this.isProfilePage = true;
      this.profileType = 'league';
      this.profileName = "MLB";
      this._dykService.getDykService(this.profileType)
          .subscribe(data => {
                  this.dykData = data;
              },
              err => {
                  console.log("Error getting did you know data");
              });
  }

    private getFaqService(profileType) {
      this.isProfilePage = true;
      this.profileType = 'league';
      this.profileName = "MLB";
      this._faqService.getFaqService(this.profileType)
          .subscribe(data => {
                  this.faqData = data;
              },
              err => {
                  console.log("Error getting faq data");
              });
   }
    private getNewsService() {
        this.isProfilePage = true;
        this.profileType = 'league';
        this.profileName = "MLB";
        this._newsService.getNewsService('Major League Baseball')
            .subscribe(data => {
                    this.newsDataArray = data.news;
                },
                err => {
                    console.log("Error getting news data");
                });
    }

    private getImages(imageData) {
        this.isProfilePage = true;
        this.profileType = 'league';
        this._imagesService.getImages(this.profileType)
            .subscribe(data => {
                    return this.imageData = data.imageArray, this.copyright = data.copyArray;
                },
                err => {
                    console.log("Error getting image data" + err);
                });
    }

    private standingsTabSelected(tab:MLBStandingsTabData) {
        if (tab && (!tab.sections || tab.sections.length == 0)) {
            this._standingsService.getTabData(tab, this.pageParams, 5)//only show 5 rows in the module
                .subscribe(data => tab.sections = data,
                    err => {
                        console.log("Error getting standings data");
                    });
        }
    }

    private setupShareModule() {
        let profileHeaderData = this.profileHeaderData;
        let imageUrl = typeof profileHeaderData.profileImageUrl === 'undefined' || profileHeaderData.profileImageUrl === null ? GlobalSettings.getImageUrl("/mlb/players/no-image.png") : profileHeaderData.profileImageUrl;
        let shareText = typeof profileHeaderData.profileName === 'undefined' || profileHeaderData.profileName === null ? 'Share This Profile Below' : 'Share ' + profileHeaderData.profileName + '\'s Profile Below:';

        this.shareModuleInput = {
            imageUrl: imageUrl,
            shareText: shareText
        };
    }


    //each time a tab is selected the carousel needs to change accordingly to the correct list being shown
    private batterTab(event) {
        this.batterParams = { //Initial load for mvp Data
            profile: 'player',
            listname: event,
            sort: 'asc',
            conference: 'all',
            division: 'all',
            limit: this.listMax,
            pageNum: 1
        };
        this.getMVP(this.batterParams, 'batter');
    }

    //each time a tab is selected the carousel needs to change accordingly to the correct list being shown
    private pitcherTab(event) {
        this.pitcherParams = { //Initial load for mvp Data
            profile: 'player',
            listname: event,
            sort: 'asc',
            conference: 'all',
            division: 'all',
            limit: this.listMax,
            pageNum: 1
        };
        this.getMVP(this.pitcherParams, 'pitcher');
    }

    private getMVP(urlParams, moduleType) {

        this.listService.getListModuleService(urlParams, moduleType)
            .subscribe(
                list => {
                    var dataArray, detailedDataArray, carouselDataArray;
                    if (list.listData.length == 0) {//makes sure it only runs once
                        detailedDataArray = false;
                    } else {
                        detailedDataArray = list.listData;
                    }
                    dataArray = list.tabArray;
                    carouselDataArray = list.carData;
                    if (moduleType == 'batter') {
                        return this.batterData = {
                            query: this.batterParams,
                            tabArray: dataArray,
                            listData: detailedDataArray,
                            carData: carouselDataArray,
                            errorData: {
                                data: "Sorry, we do not currently have any data for this mvp list",
                                icon: "fa fa-remove"
                            }
                        }
                    } else {
                        return this.pitcherData = {
                            query: this.pitcherParams,
                            tabArray: dataArray,
                            listData: detailedDataArray,
                            carData: carouselDataArray,
                            errorData: {
                                data: "Sorry, we do not currently have any data for this mvp list",
                                icon: "fa fa-remove"
                            }
                        }
                    }

                },
                err => {
                    console.log('Error: list API: ', err);
                    // this.isError = true;
                }
            );
    }
}
