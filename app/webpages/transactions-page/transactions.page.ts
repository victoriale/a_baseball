import {Component, OnInit} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

import {TitleComponent, TitleInputData} from '../../components/title/title.component';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TransactionsService} from '../../services/transactions.service';
import {ProfileHeaderService} from '../../services/profile-header.service';
import {LoadingComponent} from "../../components/loading/loading.component";
import {ErrorComponent} from "../../components/error/error.component";
import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from "../../global/global-functions";
import {MLBGlobalFunctions} from "../../global/mlb-global-functions";
import {SidekickWrapper} from "../../components/sidekick-wrapper/sidekick-wrapper.component";
import {TransactionsComponent, TransactionTabData} from '../../components/transactions/transactions.component';
import {MLBPageParameters} from '../../global/global-interface';


@Component({
    selector: 'transactions-page',
    templateUrl: './app/webpages/transactions-page/transactions.page.html',
    directives: [SidekickWrapper, ErrorComponent, LoadingComponent, BackTabComponent, TitleComponent, TransactionsComponent],
    providers: [TransactionsService, ProfileHeaderService, Title],
    inputs:[]
})

export class TransactionsPage implements OnInit{
  profileHeaderData: TitleInputData;
  pageParams:MLBPageParameters;
  
  tabs: Array<TransactionTabData>;

  isError: boolean = false;
  profileName: string;
  sort: string = "desc";
  limit: number;
  pageNum: number;
  selectedTabKey: string;
  listSort: string = "recent";

  constructor(private _transactionsService:TransactionsService, 
              private _profileService:ProfileHeaderService, 
              private _params: RouteParams, 
              private _title: Title) {
    _title.setTitle(GlobalSettings.getPageTitle("Transactions"));
    this.pageParams = {
        teamId: _params.get("teamId") ? Number(_params.get("teamId")) : null
    };
    this.limit = Number(this._params.params['limit']);
    this.pageNum = Number(this._params.params['pageNum']);

  }

  getProfileInfo() {
    if ( this.pageParams.teamId ) {
      this._profileService.getTeamProfile(this.pageParams.teamId)
      .subscribe(
          data => {
            var stats = data.headerData.stats;
            var profileHeaderData = this._profileService.convertTeamPageHeader(data, "");
            this.profileName = stats.teamName;
            this._title.setTitle(GlobalSettings.getPageTitle("Transactions", this.profileName));

            this.tabs = this._transactionsService.getTabsForPage(this.profileName, this.pageParams.teamId);
            profileHeaderData.text3 = this.tabs[0].tabDisplay + ' - ' + this.profileName;
            this.profileHeaderData = profileHeaderData;

            var teamRoute = MLBGlobalFunctions.formatTeamRoute(data.teamName, this.pageParams.teamId.toString());
          },
          err => {
            this.isError= true;
              console.error('Error: transactionsData Profile Header API: ', err);
              // this.isError = true;
          }
      );
    }
    else {
      this._profileService.getMLBProfile()
        .subscribe(
          data => {
            this.profileName = data.headerData.profileNameShort;
            var profileHeaderData = this._profileService.convertMLBHeader(data.headerData, "");                        
            this._title.setTitle(GlobalSettings.getPageTitle("Transactions", this.profileName));

            this.tabs = this._transactionsService.getTabsForPage(this.profileName, this.pageParams.teamId);
            profileHeaderData.text3 = this.tabs[0].tabDisplay + ' - ' + this.profileName;
            this.profileHeaderData = profileHeaderData;

            var teamRoute = MLBGlobalFunctions.formatTeamRoute(this.profileName, null);
          },
          err => {
            this.isError= true;
              console.error('Error: transactionsData Profile Header API: ', err);
              // this.isError = true;
          }
        )
    }
  }

  getTransactionsPage() {
    var matchingTabs = this.tabs.filter(tab => tab.tabDataKey == this.selectedTabKey);
    if ( matchingTabs.length > 0 ) {
      var tab = matchingTabs[0];
      this._transactionsService.getTransactionsService(tab, this.pageParams.teamId, 'page', this.sort, this.limit, this.pageNum)
        .subscribe(data => {
          //do nothing
        }, err => {
          console.log("Error loading transaction data");
        })
    }
  }

  ngOnInit(){
    this.getProfileInfo();
  }

  tabSwitched(tab) {
    if ( this.selectedTabKey ) {
      this.profileHeaderData.text3 = tab.tabDisplay + ' - ' + this.profileName;
    }
    this.selectedTabKey = tab.tabDataKey;
    this.getTransactionsPage();
  }

  dropdownChanged(event) {
    if( this.listSort != event ){
      this.listSort = event;
      this.sort = this.sort == "asc" ? "desc" : "asc";
      this.getTransactionsPage();
    }
  }
}
