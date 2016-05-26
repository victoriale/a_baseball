import {Component, Input, OnInit, DoCheck, Output, EventEmitter} from 'angular2/core';

import {SliderCarousel, SliderCarouselInput} from '../carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../tabs/tabs.component';
import {Tab} from '../tabs/tab.component';
import {CustomTable} from '../custom-table/custom-table.component';
import {LoadingComponent} from '../loading/loading.component';
import {TableModel, TableColumn, TableRow, TableCell} from '../custom-table/table-data.component';

export interface RosterTabData<T> {
  title: string;
  tableData: TableModel<T>;
  isLoaded: boolean;
  hasError: boolean;
  errorMessage: string;
  convertToCarouselItem(item:T, index:number):SliderCarouselInput
}

@Component({
  selector: "roster-component",
  templateUrl: "./app/components/roster/roster.component.html",
  directives: [SliderCarousel, Tabs, Tab, CustomTable, LoadingComponent],
})
export class RosterComponent implements DoCheck {
  private tabsLoaded: {[index:number]:string};
  private selectedIndex: number;
  private carDataArray: Array<SliderCarouselInput>

  @Input() tabs: Array<RosterTabData<any>>;

  @Output("tabSelected") tabSelectedListener = new EventEmitter();

  private selectedTabTitle: string;
  
  public noDataMessage: string = "Sorry, there is no data available.";
  
  public footerStyle = {
    ctaBoxClass: "list-footer",
    ctaBtnClass:"list-footer-btn",
    hasIcon: true
  };

  constructor() {}

  ngDoCheck() {
    if ( this.tabs && this.tabs.length > 0 ) {
      if ( !this.tabsLoaded  ) {
        this.tabsLoaded = {};
        var selectedTitle = this.tabs[0].title;
        this.tabs.forEach((tab, i) => {
          this.setSelectedCarouselIndex(tab, 0);
          if ( i == 0 ) {
            selectedTitle = tab.title;
          }
        });
        this.tabSelected(selectedTitle);
      }
      else {
        let selectedTab = this.getSelectedTab();
        if ( selectedTab && !this.tabsLoaded[selectedTab.title] ) {
          this.updateCarousel();
          this.tabsLoaded[selectedTab.title] = "1";
        }
      }
    }
  }
  
  setSelectedCarouselIndex(tab: RosterTabData<any>, index: number) {
    if ( tab.tableData ) {
      tab.tableData.setRowSelected(index);
    }
  }

  getSelectedTab(): RosterTabData<any> {
    var matchingTabs = this.tabs.filter(value => value.title === this.selectedTabTitle);
    if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {
      return matchingTabs[0];
    } else {
      return null;
    }
  }

  tabSelected(newTitle) {
    this.selectedTabTitle = newTitle;
    var selectedTab = this.getSelectedTab();
    if ( selectedTab ) {
      this.noDataMessage = selectedTab.errorMessage;
      this.tabSelectedListener.next(selectedTab);
      this.updateCarousel();
    }
  }

  indexNum($event) {
    let selectedIndex = Number($event);
    let matchingTabs = this.tabs.filter(value => value.title === this.selectedTabTitle);
    if ( matchingTabs.length > 0 ) {
      if ( !matchingTabs[0] || !matchingTabs[0].tableData ) {
        return;
      }
      let selectedTab = matchingTabs[0];
      let table = selectedTab.tableData;
      if ( selectedIndex < table.rows.length ) {
        table.setRowSelected(selectedIndex);
      }
    }
  }

  updateCarousel(sortedRows?) {
    var selectedTab = this.getSelectedTab();
    let carouselData: Array<SliderCarouselInput> = [];
    let selectedIndex = -1;
    if ( selectedTab && selectedTab.tableData ) {
      let table = selectedTab.tableData;
      let index = 0;
      table.rows.map((value) => {
        let item = selectedTab.convertToCarouselItem(value, index);
        if ( table.isRowSelected(value, index) ) {
          selectedIndex = index;
        }
        index++;
        return item;
      })
      .forEach(value => {
        carouselData.push(value);
      });
    }
    this.selectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
    this.carDataArray = carouselData;
  }
}
