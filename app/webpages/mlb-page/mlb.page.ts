import {Component, OnInit} from 'angular2/core';

import {AboutUsModule} from '../../modules/about-us/about-us.module';
import {LikeUs} from "../../modules/likeus/likeus.module";
import {DYKModule} from "../../modules/dyk/dyk.module";
import {FAQModule} from "../../modules/faq/faq.module";
import {TwitterModule} from "../../modules/twitter/twitter.module";
import {ComparisonModule} from '../../modules/comparison/comparison.module';
import {ShareModule, ShareModuleInput} from '../../modules/share/share.module';
import {CommentModule} from '../../modules/comment/comment.module';

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
    providers: [ListPageService, StandingsService, ProfileHeaderService, ImagesService]
})

export class MLBPage implements OnInit{
    public shareModuleInput: ShareModuleInput;

    pageParams: MLBPageParameters = {};

    standingsData: StandingsModuleData;

    profileHeaderData: ProfileHeaderData;

    batterParams:any;
    batterData: any;
    pitcherParams:any;
    pitcherData: any;
    imageData:any;
    copyright:any;
    profileType:string;
    isProfilePage:boolean = false;
    profileName:string;
    listMax: number = 10;
    constructor(
    private _standingsService: StandingsService,
    private _profileService: ProfileHeaderService,
    private _imagesService:ImagesService,
    private listService:ListPageService
    ) {
      this.batterParams = { //Initial load for mvp Data
        profile: 'player',
        listname: 'batter-home-runs',
        sort: 'asc',
        conference: 'all',
        division: 'all',
        limit: this.listMax,
        pageNum:1
      };
      this.pitcherParams = { //Initial load for mvp Data
        profile: 'player',
        listname: 'pitcher-innings-pitched',
        sort: 'asc',
        conference: 'all',
        division: 'all',
        limit: this.listMax,
        pageNum:1
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
      },
      err => {
        console.log("Error getting team profile data for " + this.pageParams.teamId + ": " + err);
      }
    );
  }

  private getImages(imageData) {
        this.isProfilePage = true;
        this.profileType = 'league';
        this.profileName = 'MLB';
        var imageArray = [];
        var copyArray = [];
        this._imagesService.getImages(null, this.profileType)
            .subscribe(data => {
                    imageData = data;
                    imageData.images.forEach(function (val, index) {
                        val['images'] = val.image_url;
                        val['copyright'] = val.image_copyright;
                        imageArray.push(val['images']);
                        copyArray.push(val['copyright'])
                    });
                    return this.imageData = imageArray, this.copyright = copyArray;
                },
                err => {
                    console.log("Error getting image data");
                });
    }

  private standingsTabSelected(tab: MLBStandingsTabData) {
    if ( tab && (!tab.sections || tab.sections.length == 0) ) {
      this._standingsService.getTabData(tab, this.pageParams, 5)//only show 5 rows in the module
        .subscribe(data => tab.sections = data,
        err => {
          console.log("Error getting standings data");
        });
    }
  }

    private setupShareModule(){
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
      this.batterParams ={ //Initial load for mvp Data
        profile: 'player',
        listname: event,
        sort: 'asc',
        conference: 'all',
        division: 'all',
        limit: this.listMax,
        pageNum:1
      };
      this.getMVP(this.batterParams, 'batter');
    }

    //each time a tab is selected the carousel needs to change accordingly to the correct list being shown
    private pitcherTab(event) {
      this.pitcherParams ={ //Initial load for mvp Data
        profile: 'player',
        listname: event,
        sort: 'asc',
        conference: 'all',
        division: 'all',
        limit: this.listMax,
        pageNum:1
      };
      this.getMVP(this.pitcherParams, 'pitcher');
    }

    private getMVP(urlParams, moduleType) {

        this.listService.getListModuleService(urlParams, moduleType)
            .subscribe(
                list => {
                  var dataArray, detailedDataArray, carouselDataArray;
                  if(list.listData.length == 0){//makes sure it only runs once
                    detailedDataArray = false;
                  }else{
                    detailedDataArray = list.listData;
                  }
                  dataArray = list.tabArray;
                  carouselDataArray = list.carData;
                  if(moduleType == 'batter'){
                    return this.batterData = {
                      query:this.batterParams,
                      tabArray: dataArray,
                      listData: detailedDataArray,
                      carData: carouselDataArray,
                      errorData: {
                        data: "Sorry, we do not currently have any data for this mvp list",
                        icon: "fa fa-remove"
                      }
                    }
                  }else{
                    return this.pitcherData = {
                      query:this.pitcherParams,
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
