import {Component, OnInit, Input, DoCheck, OnChanges} from 'angular2/core';
import {RouteParams} from "angular2/router";
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent, TitleInputData} from "../../components/title/title.component";
import {RosterComponent, RosterTabData} from "../../components/roster/roster.component";
import {MLBRosterTabData} from '../../services/roster.data';
import {MLBPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';
import {RosterService} from '../../services/roster.service';
import {ProfileHeaderService} from '../../services/profile-header.service';

@Component({
    selector: 'Team-roster-page',
    templateUrl: './app/webpages/team-roster/team-roster.page.html',
    directives: [BackTabComponent,
                TitleComponent,
                RosterComponent],
    providers: [RosterService, ProfileHeaderService],
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
              private _profileService: ProfileHeaderService,
              private _rosterService: RosterService) {
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
          this.setupTitleData(data.teamName, data.fullProfileImageUrl, data.headerData.lastUpdated)
          this.setupRosterData();
        },
        err => {
          this.hasError = true;
          console.log("Error getting team profile data for " + this.pageParams.teamId + ": " + err);
        }
      );
    }
    else {
      //TODO - Load error page since a team is required to show a roster?
    }
  }
  
  private setupTitleData(teamName: string, imageUrl: string, lastUpdated: string) {
    this.titleData = {
      imageURL: imageUrl,
      text1: "Last Updated - " + GlobalFunctions.formatUpdatedDate(lastUpdated),
      text2: "United States",
      text3: this._rosterService.getPageTitle(teamName),
      icon: "fa fa-map-marker"
    };
  }

  private setupRosterData() {
    this.tabs = this._rosterService.initializeAllTabs(this.pageParams.teamId.toString(), this.pageParams.conference);
  }
}
