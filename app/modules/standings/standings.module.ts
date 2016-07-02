import {Component, Input, OnInit, OnChanges, Output, EventEmitter} from '@angular/core';

import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {ModuleFooter, ModuleFooterData} from '../../components/module-footer/module-footer.component';
import {StandingsComponent, StandingsTableTabData} from '../../components/standings/standings.component';

export interface StandingsModuleData {
  moduleTitle: string;

  /**
    * Used for the link in the footer button
    */
  pageRouterLink: Array<any>;

  /**
   * Sent to Standings component
   */
  tabs: Array<StandingsTableTabData<any>>;
}

@Component({
  selector: "standings-module",
  templateUrl: "./app/modules/standings/standings.module.html",
  directives: [ModuleHeader, ModuleFooter, StandingsComponent],
})
export class StandingsModule implements OnChanges {
  @Input() data: StandingsModuleData;

  @Output("tabSelected") tabSelectedListener = new EventEmitter();

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
    if ( !this.data ) {
      this.headerInfo.moduleTitle = "Standings";
    }
    else {
      this.headerInfo.moduleTitle = this.data.moduleTitle;
      this.footerInfo.url = this.data.pageRouterLink;
    }
  }

  tabSelected(tabData) {
    this.tabSelectedListener.next(tabData);
  }
}
