import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {LikeUs} from "../../modules/likeus/likeus.module";
import {DYKModule} from "../../modules/dyk/dyk.module";
import {FAQModule} from "../../modules/faq/faq.module";
import {TwitterModule} from "../../modules/twitter/twitter.module";
import {ComparisonModule} from '../../modules/comparison/comparison.module';
import {ShareModule} from '../../modules/share/share.module';
import {CommentModule} from '../../modules/comment/comment.module';
import {DraftHistoryModule} from '../../modules/draft-history/draft-history.module';
import {BoxScoresModule} from '../../modules/box-scores/box-scores.module';
import {StandingsModule, StandingsModuleData} from '../../modules/standings/standings.module';
import {StandingsService} from '../../services/standings.service';
import {SchedulesModule} from '../../modules/schedules/schedules.module';

import {ProfileHeaderData, ProfileHeaderModule} from '../../modules/profile-header/profile-header.module';
import {ProfileHeaderService} from '../../services/profile-header.service';

import {Division, Conference, MLBPageParameters} from '../../global/global-interface';

import {ShareModuleInput} from '../../modules/share/share.module';
import {HeadlineComponent} from '../../components/headline/headline.component';

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
        ShareModule],
    providers: [StandingsService, ProfileHeaderService]
})

export class TeamPage implements OnInit{
    public shareModuleInput: ShareModuleInput = {
        imageUrl: './app/public/mainLogo.png'
    };

    pageParams: MLBPageParameters;

    standingsData: StandingsModuleData;

    profileHeaderData: ProfileHeaderData;

    constructor(
        private _params: RouteParams,
        private _standingsService: StandingsService,
        private _profileService: ProfileHeaderService) {

        if ( !this.pageParams ) {
            //TODO: get team id from URL parameters, other values will be found in profile data
            this.pageParams = {
                teamId: Number(_params.get("teamID"))
            };
        }
    }

  ngOnInit() {
    this.setupProfileData();
  }

  private setupProfileData() {
    this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
      data => {
        this.pageParams = data.pageParams;
        this.profileHeaderData = this._profileService.convertToTeamProfileHeader(data)
        this.setupStandingsData();
      },
      err => {
        console.log("Error getting team profile data for " + this.pageParams.teamId + ": " + err);
      }
    );
  }

  private setupStandingsData() {
    let self = this;
    self._standingsService.loadAllTabs(this.pageParams, 5) //only show 5 rows in the module
      .subscribe(data => {
        if ( data ) {
            data.forEach(tab => {
                if ( !tab.sections ) return;

                tab.sections.forEach(section => {
                    section.tableData.selectedKey = this.pageParams.teamId;
                });
            });
        }
        this.standingsData = {
            moduleTitle: self._standingsService.getModuleTitle(this.pageParams),
            pageRouterLink: self._standingsService.getLinkToPage(this.pageParams),
            tabs: data
        };
      },
      err => {
        console.log("Error getting standings data");
      });
  }
}
