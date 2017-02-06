import {Component, OnInit} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {GlobalSettings} from "../../global/global-settings";
import {TitleComponent, TitleInputData} from '../../components/title/title.component';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {LoadingComponent} from "../../components/loading/loading.component";
import {ErrorComponent} from "../../components/error/error.component";
import {SidekickWrapper} from "../../components/sidekick-wrapper/sidekick-wrapper.component";
import {DraftHistoryComponent} from "../../components/draft-history/draft-history.component";
import {IProfileData, ProfileHeaderService} from '../../services/profile-header.service';
import {ResponsiveWidget} from '../../components/responsive-widget/responsive-widget.component';

@Component({
    selector: 'draft-history-page',
    templateUrl: './app/webpages/draft-history-page/draft-history.page.html',
    directives: [SidekickWrapper, ErrorComponent, LoadingComponent, DraftHistoryComponent, BackTabComponent, TitleComponent, ResponsiveWidget],
    providers: [ProfileHeaderService, Title]
})

export class DraftHistoryPage implements OnInit{
  whatProfile:string = "Draft History";

  profileHeaderData: TitleInputData;

  profileData: IProfileData;

  seasonBase:any;

  isError: boolean = false;

  constructor(private _profileService:ProfileHeaderService,
              private params: RouteParams,
              private _title: Title) {
    _title.setTitle(GlobalSettings.getPageTitle(this.whatProfile));
  }

  ngOnInit() {
    let teamId = null;
    if ( this.params.get('teamId') != null ) {
      teamId = Number(this.params.get('teamId'));
    }

    if ( teamId ) {
      this._profileService.getTeamProfile(teamId)
      .subscribe(
          data => {
            this._title.setTitle(GlobalSettings.getPageTitle("Draft History", data.teamName));
            var pageNameForTitle = data.profileName + " " + data.headerData.stats.seasonId + " - " + this.whatProfile;
            this.profileHeaderData = this._profileService.convertTeamPageHeader(data, pageNameForTitle);
            this.profileData = data;
            this.seasonBase = data.headerData.seasonId;
          },
          err => {
            this.isError= true;
              console.log('Error: draftData Profile Header API: ', err);
          }
      );
    }
    else {
      this._profileService.getMLBProfile()
      .subscribe(
          data => {
            this._title.setTitle(GlobalSettings.getPageTitle("Draft History", data.headerData.profileNameShort));
            this.profileHeaderData = this._profileService.convertMLBHeader(data.headerData, "MLB's " + this.whatProfile);
            this.profileData = data;
            this.seasonBase = data.headerData.seasonId;
          },
          err => {
            this.isError= true;
              console.log('Error: draftData Profile Header API: ', err);
          }
      );
    }
  }
}
