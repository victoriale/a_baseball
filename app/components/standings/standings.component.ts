import {Component, Input, OnChanges, DoCheck} from 'angular2/core';

import {SliderCarousel, SliderCarouselInput} from '../carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../tabs/tabs.component';
import {Tab} from '../tabs/tab.component';
import {CustomTable} from '../custom-table/custom-table.component';
import {TableModel, TableColumn, TableRow, TableCell} from '../custom-table/table-data.component';

export interface TableTabData<T> {
  title: string;
  isActive: boolean;
  sections: Array<TableComponentData<T>>;
  convertToCarouselItem(item:T, index:number):SliderCarouselInput
}

export interface TableComponentData<T> {
  groupName: string;
  tableData: TableModel<T>;  
}

export interface StandingsComponentData {
  moduleTitle: string;
  maxRows?: number;
  tabs: Array<TableTabData<any>>
}

@Component({
  selector: "standings-component",
  templateUrl: "./app/components/standings/standings.component.html",
  directives: [SliderCarousel, Tabs, Tab, CustomTable],
})
export class StandingsComponent implements OnChanges, DoCheck {
  @Input() data: StandingsComponentData;
  
  public selectedIndex;

  public carouselData: Array<SliderCarouselInput> = [];

  @Input() tabs: Array<TableTabData<any>> = [];
  
  private selectedTabTitle: string;

  constructor() {}
  
  ngOnChanges() {
    this.setupData();
  }
  
  ngDoCheck() {
    //check for tabs loaded and update on first tab found
    if ( this.tabs.length > 0 && this.selectedTabTitle === undefined) {
      this.tabSelected(this.tabs[0].title);
    }
  }
  
  setupData() {
    if ( this.data === undefined || this.data === null ) {
      this.data = {
        moduleTitle: "Standings",
        tabs: []
      }
    }
    
    // this.tabs = this.data.tabs;
    if ( this.tabs.length > 0 ) {
      this.tabSelected(this.tabs[0].title);
    }
  }
  
  getSelectedTab(): TableTabData<any> {
    var matchingTabs = this.tabs.filter(value => value.title === this.selectedTabTitle);
    if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) { 
      return matchingTabs[0];
    }
    else {
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
    if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {  
      let selectedTab = matchingTabs[0];
      let offset = 0;
      selectedTab.sections.forEach((section) => {
        if ( selectedIndex < section.tableData.rows.length + offset ) {
          section.tableData.setRowSelected(selectedIndex);
        }
        else {
          section.tableData.setRowSelected(-1);
          offset += section.tableData.rows.length;
        }
      });
    }
  }
  
  updateCarousel(sortedRows?) {
    var selectedTab = this.getSelectedTab();
    let carouselData: Array<SliderCarouselInput> = [];
    let index = 0;
    let selectedIndex = -1;      
    selectedTab.sections.forEach(section => {
      section.tableData.rows
        .map((value) => {
          let item = selectedTab.convertToCarouselItem(value, index); 
          if ( section.tableData.isRowSelected(value, index) ) {
            selectedIndex = index;
          }
          index++;            
          return item;
        })
        .forEach(value => {
          carouselData.push(value);
        });
    });
    
    this.selectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
    this.carouselData = carouselData;    
  }
}
