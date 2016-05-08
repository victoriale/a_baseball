import {Component, OnInit, Input} from 'angular2/core';
import {RouteParams} from "angular2/router";
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TitleComponent, TitleInputData} from "../../components/title/title.component";
import {CircleImage} from '../../components/images/circle-image';
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';
import {RosterComponent, RosterComponentData} from "../../components/roster/roster.component";
import {RosterTabData, RosterTableModel, RosterTableData} from '../../services/roster.data';
import {Division, Conference, MLBPageParameters} from '../../global/global-interface';
import {GlobalFunctions} from '../../global/global-functions';
import {MLBGlobalFunctions} from '../../global/mlb-global-functions';
import {RosterService} from '../../services/roster.service';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';

@Component({
    selector: 'Teamroster-page',
    templateUrl: './app/webpages/team-roster/team-roster.page.html',

    directives: [SliderCarousel, BackTabComponent, TitleComponent, RosterComponent, LoadingComponent, ErrorComponent],
    providers: [RosterService],
})

export class TeamRosterPage implements OnInit{
  public carDataArray: any;
  public data: RosterComponentData;
  public pageParams: MLBPageParameters = {}
  public titleData: TitleInputData = {
    imageURL: "/app/public/profile_placeholder.png",
    text1: "Last Updated: [date]",
    text2: "United States",
    text3: "Team Roster",
    icon: "fa fa-map-marker"
  }
  footerStyle = {
    ctaBoxClass: "list-footer",
    ctaBtnClass:"list-footer-btn",
    hasIcon: true,
  };
  constructor(private _params: RouteParams,
              private _rosterService: RosterService,
              private _globalFunctions: GlobalFunctions,
              private _mlbFunctions: MLBGlobalFunctions) {

    var teamId = _params.get("teamId");
    if ( teamId !== null && teamId !== undefined ) {
      this.pageParams.teamId = Number(teamId);
      // this.pageParams.teamName = "??"
    }
  }

  private setupRosterData() {
    let self = this;
    self._rosterService.getRosterservice("full", "2819")
      .subscribe(data => {
        console.log(data);
        this.carDataArray = data.carousel;
      },
      err => {
        console.log("Error getting team roster data");
      });
  }
  // carData(){
  //
  // }
  ngOnInit() {
    this.setupRosterData();
  }
}
