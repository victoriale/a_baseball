import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {ModuleHeader} from '../../components/module-header/module-header.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {TransactionsService} from '../../services/transactions.service';
import {NoDataBox} from '../../components/error/data-box/data-box.component';
import {ProfileHeaderService} from '../../services/profile-header.service';

@Component({
    selector: 'transactions',
    templateUrl: './app/modules/transactions/transactions.module.html',
    directives: [NoDataBox, Tab, Tabs, SliderCarousel, DetailedListItem, ModuleHeader, ModuleFooter],
    providers: [TransactionsService, ProfileHeaderService],
    inputs:[]
})

export class TransactionsModule{
  modHeadData: Object;
  profileHeaderData: any;
  errorData: any;
  dataArray: any;//array of data for detailed list
  detailedDataArray:any; //variable that is just a list of the detailed DataArray
  carouselDataArray: any;
  footerData: Object;
  footerStyle: any;
  teamId:number;
  constructor(private transactionsService:TransactionsService, private profHeadService:ProfileHeaderService, public params: RouteParams){
    this.teamId = Number(this.params.params['teamId']);
    this.footerData = {
      infoDesc: 'Want to see everybody involved in this list?',
      text: 'VIEW THE LIST',
      url: ['Transactions-page',{teamName:this.params.params['teamName'], teamId:this.teamId}]
    };

  }

  getTransactionsPage(date, teamId) {
    this.profHeadService.getTeamProfile(teamId)
    .subscribe(
        data => {
          var profHeader = this.profHeadService.convertTeamPageHeader(data);
          this.profileHeaderData = profHeader.data;
          this.modHeadData = {
              moduleTitle: "Transactions - "+ data.headerData.stats.teamName,
              hasIcon: false,
              iconClass: '',
          }
          this.errorData = {
            data:profHeader.error,
            icon: "fa fa-area-chart"
          }
        },
        err => {
            console.log('Error: transactionsData Profile Header API: ', err);
            // this.isError = true;
        }
    );
      this.transactionsService.getTransactionsService(date, teamId, 'module')
          .subscribe(
              transactionsData => {
                if(typeof this.dataArray == 'undefined'){//makes sure it only runs once
                  this.dataArray = transactionsData.tabArray;
                }
                if(transactionsData.listData.length == 0){//makes sure it only runs once
                  this.detailedDataArray = false;
                }else{
                  this.detailedDataArray = transactionsData.listData;
                }
                this.carouselDataArray = transactionsData.carData
              },
              err => {
                  console.log('Error: transactionsData API: ', err);
                  // this.isError = true;
              }
          );
  }

  ngOnInit(){
    //MLB starts and ends in same year so can use current year logic to grab all current season and back 4 years for tabs
    var currentTab = new Date().getFullYear();
    this.getTransactionsPage(currentTab, this.teamId);
  }

  //each time a tab is selected the carousel needs to change accordingly to the correct list being shown
  selectedTab(event){
    var firstTab = 'Current Season';
    if(event == firstTab){
      event = new Date().getFullYear();
    }
    this.getTransactionsPage(event, this.teamId);
  }
}
