import {Component, Input, OnInit, OnChanges} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {ModuleFooter, ModuleFooterData} from '../../components/module-footer/module-footer.component';
import {RosterComponent, RosterComponentData} from '../../components/roster/roster.component';

@Component({
    selector: 'team-roster-module',
    templateUrl: './app/modules/team-roster/team-roster.module.html',
    directives:[ModuleHeader, ModuleFooter],
})

export class TeamRosterModule implements OnChanges{
  @Input() data: RosterComponentData;
  public headerInfo: ModuleHeaderData = {
    moduleTitle: "Team Roster",
    hasIcon: false,
    iconClass: ""
  };

  ngOnChanges() {
    console.log('teamRosterModule', this.data);
    if ( this.data === undefined || this.data === null ) {
      this.headerInfo.moduleTitle = "Team Roster";
    }
    else {
      this.headerInfo.moduleTitle = this.data.moduleTitle;
    }

  }
}
