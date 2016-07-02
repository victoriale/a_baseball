import {Component, DoCheck, Output, EventEmitter, Input} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import {Injectable} from '@angular/core';

import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {NoDataBox} from '../../components/error/data-box/data-box.component';
import {LoadingComponent} from '../../components/loading/loading.component';
import {FooterStyle} from '../../components/module-footer/module-footer.component';

export interface MVPTabData {
  tabDisplayTitle: string;
  tabDataKey: string;
  errorData: any;
  isLoaded: boolean;
  listData: DetailListInput[];
  getCarouselData(): Array<SliderCarouselInput>;
}

@Component({
    selector: 'mvp-list',
    templateUrl: './app/components/mvp-list/mvp-list.component.html',
    directives: [SliderCarousel, DetailedListItem, Tabs, Tab, NoDataBox, LoadingComponent],
})

export class MVPListComponent implements DoCheck  {
  @Output("tabSelected") tabSelectedListener = new EventEmitter();

  @Input() tabs: Array<MVPTabData>;

  @Input() carouselFooter: FooterStyle;

  detailedDataArray: DetailListInput[]; //variable that is just a list of the detailed DataArray

  carouselDataArray: Array<SliderCarouselInput>;

  @Input() selectedTabTitle: string;

  tabsLoaded: {[index:number]:string};

  ngDoCheck() {
    if ( this.tabs && this.tabs.length > 0 ) {
      if ( !this.tabsLoaded  ) {
        this.tabsLoaded = {};
        if ( !this.selectedTabTitle ) {          
          this.selectedTabTitle = this.tabs[0].tabDisplayTitle;
        }
        this.tabSelected(this.selectedTabTitle);
      }
      else {
        let selectedTab = this.getSelectedTab();
        if ( selectedTab && selectedTab.listData && selectedTab.listData.length > 0 && !this.tabsLoaded[selectedTab.tabDisplayTitle] ) {
          this.tabsLoaded[selectedTab.tabDisplayTitle] = "1";
          this.updateCarousel(selectedTab);
        }
      }
    }
  }

  getSelectedTab() {
    if ( !this.tabs ) return null;

    var tabTitle = this.selectedTabTitle;
    var matches = this.tabs.filter(tab => tab.tabDisplayTitle == tabTitle);
    return matches.length > 0 ? matches[0] : null;
  }

  //each time a tab is selected the carousel needs to change accordingly to the correct list being shown
  tabSelected(tabTitle){
    this.selectedTabTitle = tabTitle;
    var selectedTab = this.getSelectedTab();
    if ( selectedTab ) {
      this.detailedDataArray = null;
      if(!selectedTab.listData){
        selectedTab.isLoaded = false;
        this.tabSelectedListener.next(selectedTab);
      }
      else {
        this.tabSelectedListener.next(selectedTab);
        this.updateCarousel(selectedTab);
      }
    }
  }

  updateCarousel(tab: MVPTabData) {    
    if ( tab.listData.length == 0 ) {
      this.carouselDataArray = tab.getCarouselData()
    }
    else {
      this.carouselDataArray = tab.getCarouselData();
      this.detailedDataArray = tab.listData;
    }
  }
}
