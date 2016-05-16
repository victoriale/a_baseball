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
import {MVPBatter} from '../../modules/mvp-batter/mvp-batter.module';

import {ProfileHeaderData, ProfileHeaderModule} from '../../modules/profile-header/profile-header.module';
import {ProfileHeaderService} from '../../services/profile-header.service';

import {Division, Conference, MLBPageParameters} from '../../global/global-interface';

import {HeadlineComponent} from '../../components/headline/headline.component';

import {NewsModule} from '../../modules/news/news.module';
import {GlobalSettings} from "../../global/global-settings";
import {ListPageService} from '../../services/list-page.service';

@Component({
    selector: 'MLB-page',
    templateUrl: './app/webpages/mlb-page/mlb.page.html',
    directives: [
        MVPBatter,
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
        AboutUsModule],
    providers: [ListPageService, StandingsService, ProfileHeaderService]
})

export class MLBPage implements OnInit{
    public shareModuleInput: ShareModuleInput;

    pageParams: MLBPageParameters = {};

    standingsData: StandingsModuleData;

    profileHeaderData: ProfileHeaderData;

    mvpParams:Object;
    mvpData: any;

    constructor(
    private _standingsService: StandingsService,
    private _profileService: ProfileHeaderService,
    private listService:ListPageService
    ) {
      this.mvpParams ={ //Initial load for mvp Data
        profile: 'player',
        listname: 'batter-home-runs',
        sort: 'desc',
        conference: 'all',
        division: 'all',
        limit: 2,
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
        this.mvpData = this.getMVPBatter(this.mvpParams);

          this.setupShareModule();
      },
      err => {
        console.log("Error getting team profile data for " + this.pageParams.teamId + ": " + err);
      }
    );
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

    private getMVPBatter(urlParams) {
        this.listService.getListPageService(urlParams)
            .subscribe(
                list => {
                  console.log('MVP', list);
                  // this.profileHeaderData = list.profHeader;
                  if(list.listData.length == 0){//makes sure it only runs once
                    // this.detailedDataArray = false;
                  }else{
                    // this.detailedDataArray = list.listData;
                  }
                  // this.setPaginationParams(list.pagination);
                  // this.carouselDataArray = list.carData;
                },
                err => {
                    console.log('Error: list API: ', err);
                    // this.isError = true;
                }
            );
      }
}
