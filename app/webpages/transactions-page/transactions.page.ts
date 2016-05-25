import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {Tabs} from '../../components/tabs/tabs.component';
import {Tab} from '../../components/tabs/tab.component';
import {TitleComponent, TitleInputData} from '../../components/title/title.component';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {TransactionsService} from '../../services/transactions.service';
import {ListPageService} from '../../services/list-page.service';
import {NoDataBox} from '../../components/error/data-box/data-box.component';
import {ProfileHeaderService} from '../../services/profile-header.service';
import {LoadingComponent} from "../../components/loading/loading.component";
import {ErrorComponent} from "../../components/error/error.component";
import {GlobalSettings} from "../../global/global-settings";

declare var moment:any;

@Component({
    selector: 'transactions-page',
    templateUrl: './app/webpages/transactions-page/transactions.page.html',
    directives: [ErrorComponent, LoadingComponent, NoDataBox, BackTabComponent, TitleComponent, Tab, Tabs, SliderCarousel, DetailedListItem, ModuleFooter],
    providers: [TransactionsService, ProfileHeaderService],
    inputs:[]
})

export class TransactionsPage implements OnInit{
  profileHeaderData: TitleInputData;
  errorData: any;
  dataArray: any;//array of data for detailed list
  detailedDataArray:any; //variable that is just a list of the detailed DataArray
  carouselDataArray: any;
  footerData: Object;
  footerStyle: any = {
    ctaBoxClass: "list-footer",
    ctaBtnClass:"list-footer-btn",
    hasIcon: true,
  };
  teamId: number;
  isError: boolean = false;
  titleData: Object;
  profileName: string;
  constructor(public transactionsService:TransactionsService, public profHeadService:ProfileHeaderService, public params: RouteParams){
    this.teamId = Number(this.params.params['teamId']);
  }

  getTransactionsPage(date, teamId) {
      this.profHeadService.getTeamProfile(teamId)
      .subscribe(
          data => {
            var profHeader = this.profHeadService.convertTeamPageHeader(data);
            this.profileHeaderData = profHeader.data;
            this.errorData = {
              data: profHeader.error,
              icon: "fa fa-area-chart"
            }
          },
          err => {
            this.isError= true;
              console.log('Error: transactionsData Profile Header API: ', err);
              // this.isError = true;
          }
      );
      this.transactionsService.getTransactionsService(date, teamId, 'page')
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
                this.carouselDataArray = transactionsData.carData;

                //this.profileName = transactionsData.targetData.playerName != null ? transactionsData.targetData.playerName : transactionsData.targetData.teamName;  // TODO include this
                this.setProfileHeader(this.profileName)

              },
              err => {
                this.isError= true;
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

  ngOnChanges(){
    if(typeof this.errorData !='undefined' && this.detailedDataArray == false){
      this.carouselDataArray = this.errorData;
    }
  }

  selectedTab(event){
    let transactionType;
    switch( event ){
      case "Transactions":
        transactionType = "transactions";
        break;
      case "Suspensions":
        transactionType = "suspensions";
        break;
      case "Injuries":
        transactionType = "injuries";
        break;
      default:
        console.error("Supplied transaction name was not found.");
        transactionType = "transactions";
        break;
    }
    this.getTransactionsPage(transactionType, this.teamId);
  }

  setProfileHeader(profile:string){
    this.titleData = {
      imageURL : GlobalSettings.getImageUrl('/mlb/players/no-image.png'),
      text1 : 'Last Updated: ' + moment().format("dddd, MMMM DD, YYYY"),
      text2 : ' United States',
      text3 : 'Top lists - ' + profile,
      icon: 'fa fa-map-marker',
      hasHover: false
    };
  }


}
