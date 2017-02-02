import {Component, Input, OnInit, DoCheck, Output, EventEmitter} from '@angular/core';

import {SliderCarousel, SliderCarouselInput} from '../carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../tabs/tabs.component';
import {Tab} from '../tabs/tab.component';
import {CustomTable} from '../custom-table/custom-table.component';
import {TableModel, TableColumn} from '../custom-table/table-data.component';
import {DropdownComponent} from '../../components/dropdown/dropdown.component';
import {LoadingComponent} from '../../components/loading/loading.component';
import {NoDataBox} from '../../components/error/data-box/data-box.component';

export interface StatsTableTabData<T> {
  tabTitle: string;
  isActive: boolean;
  isLoaded: boolean;
  hasError: boolean;
  tableData: TableModel<T>;
  seasonIds: Array<{key: string, value: string}>;
  glossary: Array<{key: string, value: string}>;
  convertToCarouselItem(item:T, index:number):SliderCarouselInput
}

@Component({
  selector: "player-stats-component",
  templateUrl: "./app/components/player-stats/player-stats.component.html",
  directives: [SliderCarousel, Tabs, Tab, CustomTable, DropdownComponent, LoadingComponent, NoDataBox],
})
export class PlayerStatsComponent implements DoCheck {
  public selectedIndex;

  public carouselData: Array<SliderCarouselInput> = [];

  @Input() tabs: Array<StatsTableTabData<any>>;

  @Input() showGlossary: boolean;

  @Output("tabSelected") tabSelectedListener = new EventEmitter();

  private selectedTabTitle: string;
  private tabsLoaded: {[key: string]: string};
  private selectedSeasonId: string;
  private initialSeasonId: string;
  private noDataMessage = "Sorry, there is no data available.";

  constructor() {}

  ngDoCheck() {
    if ( this.tabs && this.tabs.length > 0 ) {
      if ( !this.tabsLoaded  ) {
        this.tabsLoaded = {};
        var selectedTitle = this.tabs[0].tabTitle;
        this.tabs.forEach(tab => {
          if ( tab.isActive ) {
            selectedTitle = tab.tabTitle;
          }
        });
        this.tabSelected(selectedTitle);
      }
      else {
        for ( var i = 0; i < this.tabs.length; i++ ) {
          if ( this.tabs[i].isLoaded && !this.tabsLoaded[i] ) {
            this.updateCarousel();
            this.tabsLoaded[i] = "1";
          }
        }
      }
    }
  }

  dropdownChanged($event) {
    this.selectedSeasonId = $event;
    let matchingTabs = this.tabs.filter(value => value.tabTitle === this.selectedTabTitle);
    if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {
      let selectedTab = matchingTabs[0];
      this.tabSelectedListener.next([selectedTab, $event]);
      this.updateCarousel();
    }
  }

  getSelectedTab(): StatsTableTabData<any> {
    var matchingTabs = this.tabs.filter(value => value.tabTitle === this.selectedTabTitle);
    if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {
      return matchingTabs[0];
    }
    else {
      return null;
    }
  }

  tabSelected(newTitle) {
    this.initialSeasonId = this.tabs[0].seasonIds[0].key;
    this.selectedTabTitle = newTitle;
    this.noDataMessage = "Sorry, there are no " + newTitle + " stats available.";
    if ( this.initialSeasonId != this.selectedSeasonId ) {
      this.initialSeasonId = this.selectedSeasonId;
    }
    this.tabSelectedListener.next([this.getSelectedTab(), this.selectedSeasonId]);
    this.updateCarousel();
  }

  indexNum($event) {
    let selectedIndex = Number($event);
    let matchingTabs = this.tabs.filter(value => value.tabTitle === this.selectedTabTitle);
    if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {
      let selectedTab = matchingTabs[0];
      if ( selectedTab.tableData ) {
        selectedTab.tableData.setRowSelected(selectedIndex);
      }
    }
  }

  updateCarousel(sortedRows?) {
    var selectedTab = this.getSelectedTab();
    if ( !selectedTab || !selectedTab.tableData ) {
      return;
    }

    let carouselData: Array<SliderCarouselInput> = [];
    let index = 0;
    let selectedIndex = -1;
    selectedTab.tableData.rows.map((value) => {
      let item = selectedTab.convertToCarouselItem(value, index);
      if ( selectedTab.tableData.isRowSelected(value, index) ) {
        selectedIndex = index;
      }
      index++;
      return item;
    })
    .forEach(value => {
      carouselData.push(value);
    });

    this.selectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
    this.carouselData = carouselData;
  }
}
