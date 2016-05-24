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

  @Output("tabSelected") tabSelectedListener = new EventEmitter();

  indexNum($event) {
    let selectedIndex = Number($event);
    this.data.tableData.setRowSelected(selectedIndex);
  }
  tabSelected(event){
    this.tabSelectedListener.emit(event);
  }

  updateCarousel(sortedRows?) {// each time a table sort or tab has been changed then update the carousel to fit the newly sorted array
      var selectedTab = this.data;
      if ( !selectedTab || !selectedTab.tableData ) {
        return;
      }

      let carouselData: Array<any> = [];
      let index = 0;
      let selectedIndex = -1;
      selectedTab.tableData.rows.map((value) => {
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

      this.selectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
      this.carouselData = carouselData;
  }

  constructor() {
  } //constructor ENDS

  ngOnInit(){
  }//ngOnInit ENDS
}
