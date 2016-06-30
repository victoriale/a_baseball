import {Component, OnInit, OnChanges, Input} from '@angular/core';

import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {ListPageService} from '../../services/list-page.service';
import {NoDataBox} from '../../components/error/data-box/data-box.component';
import {LoadingComponent} from "../../components/loading/loading.component";
import {ErrorComponent} from "../../components/error/error.component";
import {DraftHistoryTab, DraftHistoryService} from '../../services/draft-history.service';
import {IProfileData} from '../../services/profile-header.service';

@Component({
    selector: 'draft-history',
    templateUrl: './app/components/draft-history/draft-history.component.html',
    directives: [ErrorComponent, LoadingComponent, NoDataBox, Tab, Tabs, SliderCarousel, DetailedListItem]
})

export class DraftHistoryComponent implements OnInit {
  @Input() profileData: IProfileData;

/**
 * 'page' or 'module'
 */
  @Input() type: string;

  private dataArray: Array<DraftHistoryTab>;
  
  private carouselDataArray: Array<SliderCarouselInput>;

  private isError: boolean = false;

  constructor(private _draftService:DraftHistoryService) {
  }

  ngOnInit() {
    if ( this.profileData != null ) {
      this.dataArray = this._draftService.getDraftHistoryTabs(this.profileData);
      if ( this.dataArray && this.dataArray.length > 0 ) {
        this.getDraftPage(this.dataArray[0]);
      }
    }
  }

  getDraftPage(tab: DraftHistoryTab) {
    if ( tab.isLoaded ) {
      this.carouselDataArray = tab.carouselDataArray;
      return;
    }
    
    this._draftService.getDraftHistoryService(this.profileData, tab, this.type)
        .subscribe(
            draftData => {
              tab.isLoaded = true;
              tab.detailedDataArray = draftData.detailedDataArray;
              tab.carouselDataArray = draftData.carouselDataArray;
              this.carouselDataArray = draftData.carouselDataArray;
            },
            err => {
              tab.isLoaded = true;
              this.isError = true;
              console.log('Error: draftData API: ', err);
            }
        );
  }

  selectedTab(tabTitle){
    let tabs = this.dataArray.filter(tab => tab.tabTitle == tabTitle);
    if ( tabs.length > 0 ) {
      this.getDraftPage(tabs[0]);
    }
  }
}
