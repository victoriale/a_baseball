import {Component, Input, Output, OnInit, DoCheck, EventEmitter} from 'angular2/core';

import {SchedulesCarousel, SchedulesCarouselInput} from '../carousels/schedules-carousel/schedules-carousel.component';
import {Tabs} from '../tabs/tabs.component';
import {Tab} from '../tabs/tab.component';
import {CustomTable} from '../custom-table/custom-table.component';
import {TableModel, TableColumn, TableRow, TableCell} from '../custom-table/table-data.component';
import {LoadingComponent} from '../loading/loading.component';

export interface TableTabData<T> {
  title: string;
  isActive: boolean;
  sections: Array<TableComponentData<T>>;
  convertToCarouselItem(item:T, index:number):SchedulesCarouselInput
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

  @Output("tabSelected") tabSelectedListener = new EventEmitter();

  indexNum($event) {
    let selectedIndex = Number($event);
    console.log('carousel Selected', selectedIndex);
    let matchingTabs = this.tabs.filter(value => value.title === this.tabTitle);
    if ( matchingTabs.length > 0 && matchingTabs[0] !== undefined ) {
      let selectedTab = matchingTabs[0].tabData;
      console.log('selectedTab',selectedTab);
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
    var matchingTabs = this.tabs.filter(value => value.display === this.tabTitle);
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
    console.log('carousel Sort Changed');
      var selectedTab = this.tabs.filter(value => value.title === this.tabTitle)[0];
      if ( !selectedTab || !selectedTab.tableData ) {
        return;
      }

      let carouselData: Array<any> = [];
      let index = 0;
      let selectedIndex = -1;
      selectedTab.tableData.rows.map((value) => {
        console.log('VALUE',value);
        let item = selectedTab.updateCarouselData(value, index);
        if ( selectedTab.tableData.isRowSelected(value, index) ) {
          selectedIndex = index;
        }
        index++;
        return item;
      })
      .forEach(value => {
        carouselData.push(value);
      });
      console.log(carouselData);
      this.selectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
      this.carouselData = carouselData;
  }

  constructor() {
  } //constructor ENDS

  ngOnInit(){
    this.tabs[0]['tabData'].sections = this.data;
  }//ngOnInit ENDS
}
