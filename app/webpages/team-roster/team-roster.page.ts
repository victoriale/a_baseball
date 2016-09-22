import {Component, OnInit, Input, DoCheck, OnChanges} from '@angular/core';
import {RouteParams} from "@angular/router-deprecated";
import {Title} from '@angular/platform-browser';

import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent, TitleInputData} from "../../components/title/title.component";
import {RosterComponent, RosterTabData} from "../../components/roster/roster.component";
import {MLBRosterTabData} from '../../services/roster.data';
import {MLBPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';
import {GlobalSettings} from "../../global/global-settings";
import {RosterService} from '../../services/roster.service';
import {ProfileHeaderService} from '../../services/profile-header.service';
import {SidekickWrapper} from "../../components/sidekick-wrapper/sidekick-wrapper.component";
import {MLBGlobalFunctions} from "../../global/mlb-global-functions";

@Component({
    selector: 'Team-roster-page',
    templateUrl: './app/webpages/team-roster/team-roster.page.html',
    directives: [SidekickWrapper, BackTabComponent, TitleComponent, RosterComponent],
    providers: [RosterService, ProfileHeaderService, Title],
})

export class TeamRosterPage implements OnInit {
  public pageParams: MLBPageParameters = {}
  public titleData: TitleInputData;
  public profileLoaded: boolean = false;
  public hasError: boolean = false;
  public footerData = {
      infoDesc: 'Interested in discovering more about this player?',
      text: 'View Profile',
      url: ['Team-roster-page']
  };
  public tabs: Array<MLBRosterTabData>;
  private selectedTabTitle: string;

  constructor(private _params: RouteParams,
              private _title: Title,
              private _profileService: ProfileHeaderService,
              private _rosterService: RosterService) {
    _title.setTitle(GlobalSettings.getPageTitle("Team Roster"));
    let teamId = _params.get("teamId");
    if ( teamId !== null && teamId !== undefined ) {
      this.pageParams.teamId = Number(teamId);
    }
  }

  ngOnInit() {
    this.getData();
  }

  getData(){
    if ( this.pageParams.teamId ) {
      this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
        data => {
          this.profileLoaded = true;
          this.pageParams = data.pageParams;
          this._title.setTitle(GlobalSettings.getPageTitle("Team Roster", data.teamName));
          this.titleData = this._profileService.convertTeamPageHeader(data, this._rosterService.getPageTitle(data.teamName));
          this.setupRosterData();
        },
        err => {
          this.hasError = true;
          console.log("Error getting team profile data for " + this.pageParams.teamId, err);
        }
      );
    }
    else {
      //TODO - Load error page since a team is required to show a roster?
    }
  }

  private setupRosterData() {
    this.tabs = this._rosterService.initializeAllTabs(this.pageParams.teamId.toString(), this.pageParams.conference);
  }
}
