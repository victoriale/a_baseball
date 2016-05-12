import {Component, OnInit} from 'angular2/core';
import {LikeUs} from "../../modules/likeus/likeus.module";
import {DYKModule} from "../../modules/dyk/dyk.module";
import {FAQModule} from "../../modules/faq/faq.module";
import {TwitterModule} from "../../modules/twitter/twitter.module";
import {ComparisonModule} from '../../modules/comparison/comparison.module';
import {ShareModule} from '../../modules/share/share.module';
import {CommentModule} from '../../modules/comment/comment.module';

import {StandingsModule, StandingsModuleData} from '../../modules/standings/standings.module';
import {MLBStandingsTabData} from '../../services/standings.data';
import {StandingsService} from '../../services/standings.service';

import {ProfileHeaderData, ProfileHeaderModule} from '../../modules/profile-header/profile-header.module';
import {ProfileHeaderService} from '../../services/profile-header.service';

import {Division, Conference, MLBPageParameters} from '../../global/global-interface';

import {ShareModuleInput} from '../../modules/share/share.module';
import {HeadlineComponent} from '../../components/headline/headline.component';

@Component({
    selector: 'MLB-page',
    templateUrl: './app/webpages/mlb-page/mlb.page.html',
    directives: [
        HeadlineComponent,
        ProfileHeaderModule,
        StandingsModule,
        CommentModule,
        DYKModule,
        FAQModule,
        LikeUs,
        TwitterModule,
        ComparisonModule,
        ShareModule],
    providers: [StandingsService, ProfileHeaderService]
})

export class MLBPage implements OnInit{
    public shareModuleInput: ShareModuleInput = {
    imageUrl: './app/public/mainLogo.png'
    };

    pageParams: MLBPageParameters = {}

    standingsData: StandingsModuleData;

    profileHeaderData: ProfileHeaderData;

    constructor(
    private _standingsService: StandingsService,
    private _profileService: ProfileHeaderService) {
    }

  ngOnInit() {
    this.setupProfileData();
  }

  private setupProfileData() {
    this._profileService.getMLBProfile().subscribe(
      data => {
        this.profileHeaderData = this._profileService.convertToLeagueProfileHeader(data)
        this.standingsData = this._standingsService.loadAllTabsForModule(this.pageParams);      
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
}
