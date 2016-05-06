import {Component, Input, OnInit, OnChanges} from 'angular2/core';

import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {ModuleFooter, ModuleFooterData} from '../../components/module-footer/module-footer.component';
import {StandingsComponent, StandingsComponentData} from '../../components/standings/standings.component';

@Component({
  selector: "standings-module",
  templateUrl: "./app/modules/standings/standings.module.html",
  directives: [ModuleHeader, ModuleFooter, StandingsComponent],
})
export class StandingsModule implements OnChanges {
  @Input() data: StandingsComponentData;

  public headerInfo: ModuleHeaderData = {
    moduleTitle: "Standings",
    hasIcon: false,
    iconClass: ""
  };

  public footerInfo: ModuleFooterData = {
    infoDesc: "Want to see the full standings page?",
    text: "VIEW FULL STANDINGS",
    url: ['Standings-page']
  };
  
  ngOnChanges() {
    console.log("setting up data in module");
    if ( this.data === undefined || this.data === null ) {
      this.headerInfo.moduleTitle = "Standings";
    }
    else {
      this.headerInfo.moduleTitle = this.data.moduleTitle;
      this.footerInfo.url = this.data.pageRouterLink;
    }
    
  }
}
