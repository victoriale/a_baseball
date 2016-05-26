import {Component, Input, OnInit, DoCheck, OnChanges} from 'angular2/core';

import {SliderCarousel, SliderCarouselInput} from '../carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../tabs/tabs.component';
import {Tab} from '../tabs/tab.component';
import {CustomTable} from '../custom-table/custom-table.component';
import {TableModel, TableColumn, TableRow, TableCell} from '../custom-table/table-data.component';

export interface RosterTabData<T> {
  title: string;
  isActive: boolean;
  tableData: TableModel<T>;
  convertToCarouselItem(item:T, index:number):SliderCarouselInput
}

// export interface TableComponentData<T> {
//   groupName: string;
//   tableData: TableModel<T>;
// }

// export interface RosterComponentData {
//   moduleTitle?: string;
//   pageRouterLink?: Array<any>
//   tabs: Array<RosterTableTabData<any>>
// }

@Component({
  selector: "roster-component",
  templateUrl: "./app/components/roster/roster.component.html",
  directives: [SliderCarousel, Tabs, Tab, CustomTable],
})
export class RosterComponent implements OnChanges {
  private selectedIndex: number;
  private carDataCheck: boolean = true;
  private carDataArray: Array<SliderCarouselInput>

  @Input() tabs: Array<RosterTabData<any>>;

  private selectedTabTitle: string;

  constructor() {}

  ngOnChanges() {
    if ( this.tabs != undefined && this.tabs.length > 0 ) {
      this.tabSelected(this.tabs[0].title);
      this.updateCarousel();
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
    this.updateCarousel();
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
    if ( !selectedTab ) {
      this.carDataCheck = false;
      return;
    }

    let carouselData: Array<SliderCarouselInput> = [];
    let selectedIndex = -1;
    if ( selectedTab.tableData ) {
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
    if(this.carDataArray.length < 1){
      this.carDataCheck = false;
    } else {
      this.carDataCheck = true;
    }
  }
}
