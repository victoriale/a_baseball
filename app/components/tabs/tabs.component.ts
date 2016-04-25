import { Component, ContentChildren, QueryList, AfterContentInit, Input } from 'angular2/core';
import { Tab } from './tab.component';

@Component({
  selector: 'tabs',
  templateUrl: './app/components/tabs/tabs.component.html',
})

export class Tabs implements AfterContentInit {
  public tabWidth: string;
  @ContentChildren(Tab) tabs: QueryList<Tab>;

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    let activeTabs = this.tabs.filter((tab)=>tab.active);
    // if there is no active tab set, activate the first
    if(activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
    // get width for each tab
    this.tabWidth = 100/(this.tabs.length) + "%";
  }

  selectTab(tab: Tab){
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);
    // activate the tab the user has clicked on.
    tab.active = true;
  }
}
