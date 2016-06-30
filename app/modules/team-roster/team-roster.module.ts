import {Component, OnInit, Input, OnChanges, Output, EventEmitter} from '@angular/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {ModuleFooter, ModuleFooterData} from '../../components/module-footer/module-footer.component';
import {RosterComponent, RosterTabData} from "../../components/roster/roster.component";

export interface RosterModuleData<T> {
  moduleTitle: string;

  /**
    * Used for the link in the footer button
    */
  pageRouterLink: Array<any>;

  /**
   * Sent to Roster component
   */
  tabs: Array<RosterTabData<T>>;
}

@Component({
    selector: 'team-roster-module',
    templateUrl: './app/modules/team-roster/team-roster.module.html',
    directives: [RosterComponent,
                ModuleHeader,
                ModuleFooter]
})

export class TeamRosterModule implements OnChanges {
  @Input() data: RosterModuleData<any>;

  public headerInfo: ModuleHeaderData = {
    moduleTitle: "Team Roster",
    hasIcon: false,
    iconClass: ""
  };

  public footerInfo: ModuleFooterData = {
    infoDesc: "Want to see the full team roster?",
    text: "VIEW FULL ROSTER",
    url: ['Team-roster-page']
  };

  ngOnChanges() {
    if ( !this.data ) {
      this.headerInfo.moduleTitle = "Team Roster";
    }
    else {
      this.headerInfo.moduleTitle = this.data.moduleTitle;
      this.footerInfo.url = this.data.pageRouterLink;
    }
  }
}
