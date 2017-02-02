import {Component, Output, EventEmitter, Injectable, Input, OnInit} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';

import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {NoDataBox} from '../../components/error/data-box/data-box.component';
import {LoadingComponent} from "../../components/loading/loading.component";
import {DraftHistoryComponent} from "../../components/draft-history/draft-history.component";
import {IProfileData, ProfileHeaderService} from '../../services/profile-header.service';

@Component({
    selector: 'draft-history-module',
    templateUrl: './app/modules/draft-history/draft-history.module.html',
    directives: [DraftHistoryComponent, ModuleHeader, ModuleFooter]
})

export class DraftHistoryModule implements OnInit {

  modHeadData: Object;

  footerData: Object;

  @Input() profileData: IProfileData;

  @Input() seasonBase: string;


  constructor() {}

  ngOnInit(){
    if ( this.profileData != null ) {
      this.displayData();
    }
  }

  displayData(){
    var pageRoute = this.profileData.profileType == "team" ?
      ['Draft-history-page',{teamName: this.profileData.profileName, teamId:this.profileData.profileId}] :
      ["Draft-history-mlb-page"];

    this.footerData = {
      infoDesc: 'Want to see everybody involved in this list?',
      text: 'VIEW THE LIST',
      url: pageRoute
    };

    this.modHeadData = {
        moduleTitle: "Draft History - "+ this.profileData.profileName,
        hasIcon: false,
        iconClass: '',
    }
  }
}
