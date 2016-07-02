import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import {Injectable} from '@angular/core';

import {ModuleFooter, ModuleFooterData} from '../../components/module-footer/module-footer.component';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {MVPListComponent, MVPTabData} from '../../components/mvp-list/mvp-list.component';
import {LoadingComponent} from '../../components/loading/loading.component';

@Component({
    selector: 'mvp-module',
    templateUrl: './app/modules/mvp/mvp.module.html',
    directives: [MVPListComponent, ModuleHeader, ModuleFooter, LoadingComponent],
    providers: [],
    inputs:['mvpData', 'title']
})

export class MVPModule {
  @Output("tabSelected") tabSelectedListener = new EventEmitter();

  @Input() mvpData: Array<MVPTabData>;

  @Input() title: string;

  @Input() query: any;

  modHeadData: ModuleHeaderData;

  footerData: ModuleFooterData;

  tabKey: string;

  ngOnChanges(){
    this.displayData();
  }

  displayData(){
    this.modHeadData = {
        moduleTitle: "Most Valuable "+this.title+" - MLB",
        hasIcon: false,
        iconClass: '',
    };
    var type = this.query.listname.indexOf("pitcher")>=0 ? "pitcher" : "batter";
    var url;
    if ( this.tabKey ) {
      url = ['MVP-list-tab-page', {
        tab: this.tabKey,
        type: type,
        pageNum: "1"
      }];
    }
    else {
      url = ['MVP-list-page', {
        type: type,
        pageNum: "1"
      }];
    }
    this.footerData = {
      infoDesc: 'Want to see everybody involved in this list?',
      text: 'VIEW THE LIST',
      url: url
    };
  }

  tabSelected(tab) {
    this.tabKey = tab.tabDataKey;
    if (!tab.listData) { //let the page handle the service call if there's no data
      this.tabSelectedListener.next(tab);
    }
    else {
      this.displayData();
    }
  }
}
