import {Component, Input, OnInit} from 'angular2/core';

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
  tabs: Array<TableTabData<any>>
}

@Component({
  selector: "standings-component",
  templateUrl: "./app/components/standings/standings.component.html",
  directives: [SliderCarousel, Tabs, Tab, CustomTable],
})
export class StandingsComponent implements OnInit {
  @Input() data: StandingsComponentData;
  
  public selectedIndex;

  public carouselData: Array<SliderCarouselInput> = [];

  public tabs: Array<TableTabData<any>> = [];
  
  private selectedTabTitle: string = "";

  constructor() {}
  
  ngOnInit() {
    this.setupData();
  }
  
  setupData() {
    if ( this.data === undefined || this.data === null ) {
      this.data = {
        moduleTitle: "Standings",
        tabs: []
      }
    }
    
    this.tabs = this.data.tabs;
    if ( this.data.tabs.length > 0 ) {
      this.tabSelected(this.data.tabs[0].title);
    }
  }
  
  tabSelected(newTitle) {
    this.selectedTabTitle = newTitle;
    var matchingTabs = this.tabs.filter(value => value.title === this.selectedTabTitle);
    if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) { 
      let selectedTab = matchingTabs[0];
      let carouselData: Array<SliderCarouselInput> = [];
      let index = 0;
      let selectedIndex = 0;      
      selectedTab.sections.forEach(section => {
        if ( section.tableData.selectedIndex >= 0 ) {
          selectedIndex = index + section.tableData.selectedIndex;
        }
        section.tableData.rows
          .map((value) => {
            let item = selectedTab.convertToCarouselItem(value, index); 
            index++;            
            return item;
          })
          .forEach(value => {
            carouselData.push(value);
          });
      });
      
      this.selectedIndex = selectedIndex;
      this.carouselData = carouselData;
    }
    else {
      console.log("no matching tab found for " + this.selectedTabTitle);
    }
  }
  
  indexNum($event) {
    let selectedIndex = Number($event);
    let matchingTabs = this.tabs.filter(value => value.title === this.selectedTabTitle);
    if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {  
      let selectedTab = matchingTabs[0];
      let offset = 0;
      selectedTab.sections.forEach((section) => {
        if ( selectedIndex < section.tableData.rows.length + offset ) {
          section.tableData.selectedIndex = selectedIndex;
        }
        else {
          section.tableData.selectedIndex = -1;
          offset += section.tableData.rows.length;
        }
      });
    }
    else {
      console.log("no matching tab found for " + this.selectedTabTitle);
    }
  }
}
