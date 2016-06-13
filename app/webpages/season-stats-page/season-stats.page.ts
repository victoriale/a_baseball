import {Component, OnInit, Input} from 'angular2/core';
import {RouteParams} from "angular2/router";
import {BackTabComponent} from "../../components/backtab/backtab.component";
import {TitleComponent, TitleInputData} from "../../components/title/title.component";
import {CircleImageData} from "../../components/images/image-data";
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';
import {MLBSeasonStatsTabData, MLBSeasonStatsTableData} from '../../services/season-stats-page.data';
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';
import {Season, MLBPageParameters} from '../../global/global-interface';

import {SeasonStatsComponent} from "../../components/season-stats/season-stats.component";
import {ProfileHeaderService} from '../../services/profile-header.service';
import {SeasonStatsPageService} from '../../services/season-stats.service';
import {SidekickWrapper} from "../../components/sidekick-wrapper/sidekick-wrapper.component";

@Component({
    selector: 'Season-stats-page',
    templateUrl: './app/webpages/season-stats-page/season-stats.page.html',
    directives: [SidekickWrapper, BackTabComponent, TitleComponent, SeasonStatsComponent, LoadingComponent, ErrorComponent],
    providers: [SeasonStatsPageService, ProfileHeaderService],
})

export class SeasonStatsPage implements OnInit {
  public tabs: Array<MLBSeasonStatsTabData>;

  public pageParams: MLBPageParameters = {}

  public profileLoaded: boolean = false;

  public hasError: boolean = false;

  public titleData: TitleInputData;

  constructor(private _params: RouteParams,
              private _profileService: ProfileHeaderService,
              private _seasonStatsPageService: SeasonStatsPageService,
              private _globalFunctions: GlobalFunctions,
              private _mlbFunctions: MLBGlobalFunctions) {

    var type = _params.get("type");
    if ( type !== null && type !== undefined ) {
      type = type.toLowerCase();
      this.pageParams.season = Season[type];
    }

    var teamId = _params.get("teamId");
    if ( type == "team" && teamId !== null && teamId !== undefined ) {
      this.pageParams.teamId = Number(teamId);
    }

    // Scroll page to top to fix routerLink bug
    window.scrollTo(0, 0);
  }

  ngOnInit() {
    if ( this.pageParams.teamId ) {
      this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
        data => {
          this.profileLoaded = true;
          this.pageParams = data.pageParams;
          this.setupTitleData(data.teamName, data.fullProfileImageUrl);
          this.tabs = this._seasonStatsPageService.initializeAllTabs(this.pageParams);
        },
        err => {
          this.hasError = true;
          console.log("Error getting team profile data for " + this.pageParams.teamId + ": " + err);
        }
      );
    }
    else {
      this.setupTitleData();
      this.tabs = this._seasonStatsPageService.initializeAllTabs(this.pageParams);
    }
  }

  private setupTitleData(teamName?: string, imageUrl?: string) {
    var title = this._seasonStatsPageService.getPageTitle(this.pageParams, teamName);
    this.titleData = {
      imageURL: imageUrl,
      text1: "",
      text2: "United States",
      text3: title,
      icon: "fa fa-map-marker"
    };
  }

  private seasonStatsTabSelected(tab: MLBSeasonStatsTabData) {
    this._seasonStatsPageService.getSeasonStatsTabData(tab, this.pageParams, data => {
      this.getLastUpdatedDateForPage(data);
    });
  }

  private getLastUpdatedDateForPage(data: MLBSeasonStatsTableData[]) {
      if ( data && data.length > 0 &&
        data[0].tableData && data[0].tableData.rows &&
        data[0].tableData.rows.length > 0 ) {
          var lastUpdated = data[0].tableData.rows[0].lastUpdated;
          this.titleData.text1 = "Last Updated: " + GlobalFunctions.formatUpdatedDate(lastUpdated, false);
      }
  }
}
