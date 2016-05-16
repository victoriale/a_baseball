import {Component, Input, OnInit, DoCheck, Output, EventEmitter} from 'angular2/core';

import {SliderCarousel, SliderCarouselInput} from '../carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../tabs/tabs.component';
import {Tab} from '../tabs/tab.component';
import {CustomTable} from '../custom-table/custom-table.component';
import {TableModel, TableColumn, TableRow, TableCell} from '../custom-table/table-data.component';
import {DropdownComponent} from '../../components/dropdown/dropdown.component';

export interface StatsTableTabData<T> {
  tabTitle: string;
  isActive: boolean;
  tableData: {
    [seasonId: string]: TableModel<T>
  };    
  seasonIds: Array<{key: string, value: string}>;
  glossary: Array<{key: string, value: string}>;
  selectedSeasonId: string;
  convertToCarouselItem(item:T, index:number):SliderCarouselInput
}

@Component({
  selector: "player-stats-component",
  templateUrl: "./app/components/player-stats/player-stats.component.html",
  directives: [SliderCarousel, Tabs, Tab, CustomTable, DropdownComponent],
})
export class PlayerStatsComponent implements DoCheck {  
  public selectedIndex;

  public carouselData: Array<SliderCarouselInput> = [];

  @Input() tabs: Array<StatsTableTabData<any>>;
  
  @Output("tabSelected") tabSelectedListener = new EventEmitter(); 
  
  private selectedTabTitle: string;
  private tabsLoaded: {[key: string]: string};

  constructor() {}
  
  // ngOnChanges() {
  //   if ( this.tabs != undefined && this.tabs.length > 0 ) {
  //     this.tabSelected(this.tabs[0].tabTitle);
  //   }
  // }
  
  ngDoCheck() {
    if ( this.tabs && this.tabs.length > 0 ) {
      if ( !this.tabsLoaded  ) {
        this.tabsLoaded = {};
        var selectedTitle = this.tabs[0].tabTitle;
        this.tabs.forEach(tab => {
          // this.setSelectedCarouselIndex(tab, 0);
          if ( tab.isActive ) {
            selectedTitle = tab.tabTitle;
          }
        });
        this.tabSelected(selectedTitle);
      }
      else {
        for ( var i = 0; i < this.tabs.length; i++ ) {
          if ( this.tabs[i].tableData && !this.tabsLoaded[i] ) {
            this.updateCarousel();
            this.tabsLoaded[i] = "1";
          }
        }
      }
    }
  }
  
  dropdownChanged($event) {
    let matchingTabs = this.tabs.filter(value => value.tabTitle === this.selectedTabTitle);
    if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {
      let selectedTab = matchingTabs[0];
      selectedTab.selectedSeasonId = $event;
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
    this.selectedTabTitle = newTitle;
    this.tabSelectedListener.next(this.getSelectedTab());
    this.updateCarousel();
  }
  
  indexNum($event) {
    let selectedIndex = Number($event);
    let matchingTabs = this.tabs.filter(value => value.tabTitle === this.selectedTabTitle);
    if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {  
      let selectedTab = matchingTabs[0];
      let selectedTable = selectedTab.tableData[selectedTab.selectedSeasonId];
      if ( selectedTable ) {
        selectedTable.setRowSelected(selectedIndex);
      }
    }
  }
  
  updateCarousel(sortedRows?) {
    var selectedTab = this.getSelectedTab();
    if ( !selectedTab || !selectedTab.tableData ) {
      return;
    }
       
    let selectedTable = selectedTab.tableData[selectedTab.selectedSeasonId];
    if ( !selectedTable ) {
      return;
    }
    
    let carouselData: Array<SliderCarouselInput> = [];
    let index = 0;
    let selectedIndex = -1; 
    selectedTable.rows.map((value) => {
      let item = selectedTab.convertToCarouselItem(value, index); 
      if ( selectedTable.isRowSelected(value, index) ) {
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
