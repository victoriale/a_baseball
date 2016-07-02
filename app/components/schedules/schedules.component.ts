import {Component, Input, Output, OnInit, DoCheck, EventEmitter} from '@angular/core';

import {SchedulesCarousel, SchedulesCarouselInput} from '../carousels/schedules-carousel/schedules-carousel.component';
import {Tabs} from '../tabs/tabs.component';
import {Tab} from '../tabs/tab.component';
import {CustomTable} from '../custom-table/custom-table.component';
import {TableModel} from '../custom-table/table-data.component';
import {LoadingComponent} from '../loading/loading.component';

export interface TableTabData<T> {
  title: string;
  isActive: boolean;
  sections: Array<TableComponentData<T>>;
}

export interface TableComponentData<T> {
  groupName: string;
  tableData: TableModel<T>;
}
@Component({
    selector: 'schedules-component',
    templateUrl: './app/components/schedules/schedules.component.html',
    directives: [LoadingComponent, Tabs, Tab, SchedulesCarousel, CustomTable],
})

export class SchedulesComponent implements OnInit{
  public selectedIndex;

  @Input() carouselData: Array<SchedulesCarouselInput> = [];// the data to send through the schedules carousel to display
  @Input() data;// the data to display is inputed through this variable
  @Input() tabs;// the tab data gets inputed through here to display all tabs
  tabTitle: string;
  private tabsLoaded: {[index:number]:string};

  @Output("tabSelected") tabSelectedListener = new EventEmitter();

  ngDoCheck() { // checks and runs everytime a dependency has changed
    if ( this.tabs && this.tabs.length > 0 && this.carouselData && this.data != null && !this.tabsLoaded && this.getSelectedTab()) {
      if ( !this.tabsLoaded) {
        this.tabsLoaded = {};
        var selectedTitle = this.getSelectedTab()['display'];
        let matchingTabs = this.tabs.filter(value => value.display == this.tabTitle);
        this.tabs.forEach(tab => {
          this.setSelectedCarouselIndex(tab.tabData, 0);
          if ( matchingTabs[0].display === tab.display ) {
            selectedTitle = tab.display;
          }
        });
        this.tabSelected(selectedTitle);
      }else {
        let selectedTab = this.getSelectedTab()['tabData'];
        if ( selectedTab && selectedTab.sections && selectedTab.sections.length > 0 && this.tabsLoaded != null ) {
          this.tabsLoaded[this.tabTitle] = "1";
          this.updateCarousel();
        }
      }
    }
  }

  indexNum(event) {
    let selectedIndex = event;
    let matchingTabs = this.tabs.filter(value => value.display == this.tabTitle);
    if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {
      let selectedTab = matchingTabs[0].tabData;
      // console.log('selectedTab',selectedIndex,selectedTab);
      this.setSelectedCarouselIndex(selectedTab, selectedIndex);
    }
  }

  setSelectedCarouselIndex(tab: TableTabData<any>, index: number) {
    let offset = 0;
    tab.sections.forEach((section, sectionIndex) => {
      if ( index >= offset && index < section.tableData.rows.length + offset ) {
        section.tableData.setRowSelected(index-offset);
      }
      else {
        section.tableData.setRowSelected(-1);
      }
      offset += section.tableData.rows.length;
    });
  }

  getSelectedTab(): TableTabData<any> {
    var matchingTabs = this.tabs.filter(value => value.display == this.tabTitle);
    if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {
      return matchingTabs[0];
    }
    else {
      return null;
    }
  }

  tabSelected(event){
    this.tabTitle = event;
    this.tabSelectedListener.emit(event);
  }

  ngOnChanges(){
    if(this.getSelectedTab() != null){
      this.getSelectedTab()['tabData'].sections = this.data;
    }
  }

  updateCarousel(sortedRows?) {// each time a table sort or tab has been changed then update the carousel to fit the newly sorted array
    let carouselData: Array<any> = [];
    let index = 0;
    let selectedIndex = -1;
    var selectedTab = this.tabs.filter(value => value.display == this.tabTitle)[0];
    selectedTab.tabData.sections.forEach((section,i) =>{//when updating carousel run through each table to new sorted style
      section.tableData.rows.map((value) => {//then run through each tables rows
        let item = section.updateCarouselData(value, index);
        if ( section.tableData.isRowSelected(value, index) ) {
          selectedIndex = index;
        }
        index++;
        return item;
      })
      .forEach(value => {
        carouselData.push(value);
      });
    })
    this.selectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
    this.carouselData = carouselData;
  }

  constructor() {
  } //constructor ENDS

  ngOnInit(){//on view load set default data
    var selectedTab = this.tabs.filter(value => value.tabData.isActive == true)[0];
    this.tabTitle = selectedTab.display;
  }//ngOnInit ENDS
}
