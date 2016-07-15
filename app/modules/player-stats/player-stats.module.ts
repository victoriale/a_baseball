import {Component, Input, OnInit, OnChanges, Output, EventEmitter} from '@angular/core';

import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {ModuleFooter, ModuleFooterData} from '../../components/module-footer/module-footer.component';
import {PlayerStatsComponent, StatsTableTabData} from '../../components/player-stats/player-stats.component';

export interface PlayerStatsModuleData {
  moduleTitle: string;

  /**
    * Used for the link in the footer button
    */
  pageRouterLink: Array<any>;

  /**
   * Sent to Standings component
   */
  tabs: Array<StatsTableTabData<any>>;
}

@Component({
  selector: "player-stats-module",
  templateUrl: "./app/modules/player-stats/player-stats.module.html",
  directives: [ModuleHeader, ModuleFooter, PlayerStatsComponent],
})
export class PlayerStatsModule implements OnChanges {
  @Input() data: PlayerStatsModuleData;

  @Output("tabSelected") tabSelectedListener = new EventEmitter();

  public headerInfo: ModuleHeaderData = {
    moduleTitle: "Player Stats",
    hasIcon: false,
    iconClass: ""
  };

  public footerInfo: ModuleFooterData = {
    infoDesc: "Want to see more player statistics?",
    text: "VIEW FULL STATISTICS",
    url: ['Player-stats-page']
  };

  public tabs: Array<StatsTableTabData<any>>;

  ngOnChanges() {
    if ( !this.data ) {
      this.headerInfo.moduleTitle = "Player Stats";
    }
    else {
      this.headerInfo.moduleTitle = this.data.moduleTitle;
      this.footerInfo.url = this.data.pageRouterLink;
      this.tabs = this.data.tabs;
    }
  }

  tabSelected(tabData) {
    this.tabSelectedListener.next(tabData);
  }
}
