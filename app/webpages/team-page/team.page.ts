import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Injectable} from 'angular2/core';

import {AboutUsModule} from '../../modules/about-us/about-us.module';
import {LikeUs} from "../../modules/likeus/likeus.module";
import {DYKModule} from "../../modules/dyk/dyk.module";
import {FAQModule} from "../../modules/faq/faq.module";
import {TwitterModule} from "../../modules/twitter/twitter.module";
import {ComparisonModule} from '../../modules/comparison/comparison.module';
import {CommentModule} from '../../modules/comment/comment.module';
import {BoxScoresModule} from '../../modules/box-scores/box-scores.module';
import {StandingsModule, StandingsModuleData} from '../../modules/standings/standings.module';
import {MLBStandingsTabData} from '../../services/standings.data';
import {StandingsService} from '../../services/standings.service';
import {SchedulesModule} from '../../modules/schedules/schedules.module';

import {TeamRosterModule} from '../../modules/team-roster/team-roster.module';
import {RosterService} from '../../services/roster.service';

import {ProfileHeaderData, ProfileHeaderModule} from '../../modules/profile-header/profile-header.module';
import {ProfileHeaderService} from '../../services/profile-header.service';

import {Division, Conference, MLBPageParameters} from '../../global/global-interface';

import {ShareModule, ShareModuleInput} from '../../modules/share/share.module';
import {HeadlineComponent} from '../../components/headline/headline.component';

import {NewsModule} from '../../modules/news/news.module';
import {GlobalSettings} from "../../global/global-settings";

//module | interface | service
import {DraftHistoryModule} from '../../modules/draft-history/draft-history.module';
import {DraftHistoryService} from '../../services/draft-history.service';
import {ArticlesModule} from "../../modules/articles/articles.module";
import {ListOfListsService} from "../../services/list-of-lists.service";


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
        ArticlesModule],
    providers: [DraftHistoryService, StandingsService, ProfileHeaderService, RosterService, ListOfListsService]
})

export class TeamPage implements OnInit{
    public shareModuleInput: ShareModuleInput;
    headerData: any;
    pageParams: MLBPageParameters;

    standingsData: StandingsModuleData;

    profileHeaderData: ProfileHeaderData;

    draftHistoryData: any;
    currentYear: any;

    detailedDataArray     : any; //variable that is just a list of the detailed DataArray
    dataArray             : any; //array of data for detailed list
    carouselDataArray     : any;
    profileName           : string;
    listOfListsData           : any; // paginated data to be displayed

    constructor(
        private _params: RouteParams,
        private _standingsService: StandingsService,
        private _profileService: ProfileHeaderService,
        private _draftService:DraftHistoryService,
        private _lolService:ListOfListsService
    ) {
        this.pageParams = {
            teamId: Number(_params.get("teamId"))
        };
        this.currentYear = new Date().getFullYear().toString();
    }

  ngOnInit() {
    this.setupProfileData();
  }

private setupProfileData() {
    this._profileService.getTeamProfile(this.pageParams.teamId).subscribe(
      data => {
        this.pageParams = data.pageParams;
        this.profileHeaderData = this._profileService.convertToTeamProfileHeader(data)
        this.standingsData = this._standingsService.loadAllTabsForModule(this.pageParams);
        this.setupShareModule();
        this.draftHistoryModule(this.currentYear, this.pageParams.teamId);//neeeds profile header data will run once header data is in
        this.setupListOfListsModule();
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
        let imageUrl = typeof profileHeaderData.profileImageUrl === 'undefined' || profileHeaderData.profileImageUrl === null ? GlobalSettings.getImageUrl('/mlb/players/no-image.png') : profileHeaderData.profileImageUrl;
        let shareText = typeof profileHeaderData.profileName === 'undefined' || profileHeaderData.profileName === null ? 'Share This Profile Below' : 'Share ' + profileHeaderData.profileName + '\'s Profile Below:';

        this.shareModuleInput = {
            imageUrl: imageUrl,
            shareText: shareText
        };
    }

    //each time a tab is selected the carousel needs to change accordingly to the correct list being shown
    private draftTab(event){
      var firstTab = 'Current Season';
      if(event == firstTab){
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
                if(typeof dataArray == 'undefined'){//makes sure it only runs once
                  dataArray = draftData.tabArray;
                }
                if(draftData.listData.length == 0){//makes sure it only runs once
                  detailedDataArray = false;
                }else{
                  detailedDataArray = draftData.listData;
                }
                carouselDataArray = draftData.carData
                return this.draftHistoryData = {
                  tabArray:dataArray,
                  listData:detailedDataArray,
                  carData:carouselDataArray,
                  errorData : {
                    data:"Sorry, the " + this.profileHeaderData.profileName + " do not currently have any data for the " + year + " draft history",
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
    this._lolService.getListOfListsService("module","team", this.pageParams.teamId, "league", 4, 1)
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
