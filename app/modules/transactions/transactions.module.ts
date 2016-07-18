import {Component, Output, EventEmitter, Input} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import {Injectable} from '@angular/core';

import {ModuleFooter, FooterStyle, ModuleFooterData} from '../../components/module-footer/module-footer.component';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
import {TransactionsComponent, TransactionTabData} from '../../components/transactions/transactions.component';

export interface TransactionModuleData {
  tabs: Array<TransactionTabData>;
  ctaRoute: Array<any>;
  profileName: string;
}

@Component({
  selector: 'transactions-module',
  templateUrl: './app/modules/transactions/transactions.module.html',
  directives: [ModuleHeader, ModuleFooter, TransactionsComponent]
})

export class TransactionsModule {
  @Output() tabSwitched = new EventEmitter(true);

  @Input() data: TransactionModuleData;

  modHeadData: ModuleHeaderData;

  footerData: ModuleFooterData;

  ngOnChanges() {
    this.footerData = {
      infoDesc: 'Want to see more transactions?',
      text: 'VIEW TRANSACTIONS',
      url: this.data.ctaRoute
    };
    this.modHeadData = {
      moduleTitle: "Transactions - "+ this.data.profileName,
      hasIcon: false,
      iconClass: '',
    }
  }

  tabSelected(tab) {
    this.tabSwitched.next(tab);
  }
}
