import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Injectable} from 'angular2/core';

import {AboutUsModule} from '../../modules/about-us/about-us.module';
import {LikeUs} from "../../modules/likeus/likeus.module";

import {DYKModule, dykModuleData} from "../../modules/dyk/dyk.module";
import {DykService} from '../../services/dyk.service';

import {FAQModule, faqModuleData} from "../../modules/faq/faq.module";
import {FaqService} from '../../services/faq.service';

import {TwitterModule} from "../../modules/twitter/twitter.module";
import {ComparisonModule} from '../../modules/comparison/comparison.module';
import {CommentModule} from '../../modules/comment/comment.module';
import {BoxScoresModule} from '../../modules/box-scores/box-scores.module';
import {StandingsModule, StandingsModuleData} from '../../modules/standings/standings.module';
import {MLBStandingsTabData} from '../../services/standings.data';
import {StandingsService} from '../../services/standings.service';

import {SchedulesService} from '../../services/schedules.service';
import {SchedulesModule} from '../../modules/schedules/schedules.module';

import {TeamRosterModule} from '../../modules/team-roster/team-roster.module';
import {RosterService} from '../../services/roster.service';

import {ProfileHeaderData, ProfileHeaderModule} from '../../modules/profile-header/profile-header.module';
import {ProfileHeaderService} from '../../services/profile-header.service';

import {Division, Conference, MLBPageParameters} from '../../global/global-interface';

import {ShareModule, ShareModuleInput} from '../../modules/share/share.module';
import {HeadlineComponent} from '../../components/headline/headline.component';

import {NewsModule} from '../../modules/news/news.module';
import {NewsService} from '../../services/news.service';

import {GlobalSettings} from "../../global/global-settings";

//module | interface | service
import {DraftHistoryModule} from '../../modules/draft-history/draft-history.module';
import {DraftHistoryService} from '../../services/draft-history.service';
import {ArticlesModule} from "../../modules/articles/articles.module";
import {ImagesService} from "../../services/carousel.service";
import {ImagesMedia} from "../../components/carousels/images-media-carousel/images-media-carousel.component";
import {GlobalFunctions} from "../../global/global-functions";
import {ListOfListsService} from "../../services/list-of-lists.service";
import {ListOfListsModule} from "../../modules/list-of-lists/list-of-lists.module";

@Component({
    selector: 'Team-page',
    templateUrl: './app/webpages/team-page/team.page.html',
    directives: [
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
        ListOfListsModule
    ],
    providers: [
      SchedulesService,
      DraftHistoryService,
      StandingsService,
      ProfileHeaderService,
      RosterService,
      ListOfListsService,
      ImagesService,
      NewsService,
      FaqService,
      DykService
    ]
})

export class TeamPage implements OnInit {
    public shareModuleInput:ShareModuleInput;
    headerData:any;
    pageParams:MLBPageParameters;

    standingsData:StandingsModuleData;

    profileHeaderData:ProfileHeaderData;

    imageData:any;
    copyright:any;
    profileType:string;
    isProfilePage:boolean = false;
    draftHistoryData:any;
    currentYear:any;

    schedulesData:any;

    profileName:string;
    listOfListsData:Object; // paginated data to be displayed
    newsDataArray: Array<Object>;
    faqData: Array<faqModuleData>;
    dykData: Array<dykModuleData>;

    constructor(private _params:RouteParams,
                private _standingsService:StandingsService,
                private _schedulesService:SchedulesService,
                private _profileService:ProfileHeaderService,
                private _draftService:DraftHistoryService,
                private _lolService:ListOfListsService,
                private _imagesService:ImagesService,
                private _newsService: NewsService,
                private _faqService: FaqService,
                private _dykService: DykService,
                private _globalFunctions:GlobalFunctions) {
        this.pageParams = {
            teamId: Number(_params.get("teamId")),
            teamName: _params.get("teamName")
        };
        this.currentYear = new Date().getFullYear().toString();
    }

    ngOnInit() {
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
                this.pageParams = data.pageParams;
                this.profileHeaderData = this._profileService.convertToTeamProfileHeader(data);
                this.standingsData = this._standingsService.loadAllTabsForModule(this.pageParams);
                this.getSchedulesData();
                this.setupShareModule();
                this.getImages(this.imageData);
                this.getNewsService(this.pageParams.teamName);
                this.getFaqService(this.profileType, this.pageParams.teamId);
                this.getDykService(this.profileType, this.pageParams.teamId);
                this.draftHistoryModule(this.currentYear, this.pageParams.teamId);//neeeds profile header data will run once header data is in
                this.setupListOfListsModule();
            },
            err => {
                console.log("Error getting team profile data for " + this.pageParams.teamId + ": " + err);
            }
        );
    }

    private getDykService(profileType, teamId) {
        this.isProfilePage = true;
        this.profileType = 'team';
        let name = this.pageParams.teamName.replace(/-/g, " ");
        this.profileName = this._globalFunctions.toTitleCase(name);
        this._dykService.getDykService(this.profileType, this.pageParams.teamId)
            .subscribe(data => {
                    this.dykData = data;
                },
                err => {
                    console.log("Error getting did you know data");
                });
    }

    private getFaqService(profileType, teamId) {
        this.isProfilePage = true;
        this.profileType = 'team';
        let name = this.pageParams.teamName.replace(/-/g, " ");
        this.profileName = this._globalFunctions.toTitleCase(name);
        this._faqService.getFaqService(this.profileType, this.pageParams.teamId)
            .subscribe(data => {
                    this.faqData = data;
                },
                err => {
                    console.log("Error getting faq data");
                });
    }


    private getNewsService(teamName) {
        this.isProfilePage = true;
        this.profileType = 'team';
        let name = this.pageParams.teamName.replace(/-/g, " ");
        this.profileName = this._globalFunctions.toTitleCase(name);
        this._newsService.getNewsService(this.pageParams.teamName)
            .subscribe(data => {
                    this.newsDataArray = data.news;
                },
                err => {
                    console.log("Error getting news data");
                });
    }

    //grab tab to make api calls for post of pre event table
    private scheduleTab(tab) {
     // console.log(tab);
    }

    private getSchedulesData(){
      this._schedulesService.getSchedulesService('team', 2799, 'pre-event')
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
        this.isProfilePage = true;
        this.profileType = 'team';
        let name = this.pageParams.teamName.replace(/-/g, " ");
        this.profileName = this._globalFunctions.toTitleCase(name);
        this._imagesService.getImages(this.profileType, this.pageParams.teamId)
            .subscribe(data => {
                    return this.imageData = data.imageArray, this.copyright = data.copyArray;
                },
                err => {
                    console.log("Error getting image data");
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
        let imageUrl = typeof profileHeaderData.profileImageUrl === 'undefined' || profileHeaderData.profileImageUrl === null ? GlobalSettings.getImageUrl('/mlb/players/no-image.png') : profileHeaderData.profileImageUrl;
        let shareText = typeof profileHeaderData.profileName === 'undefined' || profileHeaderData.profileName === null ? 'Share This Profile Below' : 'Share ' + profileHeaderData.profileName + '\'s Profile Below:';

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

    private draftHistoryModule(year, teamId) {
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


    setupListOfListsModule() {
        // getListOfListsService(version, type, id, scope?, count?, page?){
        this._lolService.getListOfListsService("module", "team", this.pageParams.teamId, "league", 4, 1)
            .subscribe(
                listOfListsData => {
                    this.listOfListsData = listOfListsData.listData;
                },
                err => {
                    console.log('Error: listOfListsData API: ', err);
                }
            );
    }
}
