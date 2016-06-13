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
import {TransactionsListItem} from "../../components/transactions-list-item/transactions-list-item.component";
import {DropdownComponent} from "../../components/dropdown/dropdown.component";
import {GlobalFunctions} from "../../global/global-functions";
import {MLBGlobalFunctions} from "../../global/mlb-global-functions";
import {SidekickWrapper} from "../../components/sidekick-wrapper/sidekick-wrapper.component";

declare var moment:any;

@Component({
    selector: 'transactions-page',
    templateUrl: './app/webpages/transactions-page/transactions.page.html',
    directives: [SidekickWrapper, ErrorComponent, LoadingComponent, NoDataBox, BackTabComponent, TitleComponent, Tab, Tabs, SliderCarousel, DetailedListItem, ModuleFooter, TransactionsListItem, DropdownComponent],
    providers: [TransactionsService, ProfileHeaderService],
    inputs:[]
})

export class TransactionsPage implements OnInit{
  profileHeaderData: TitleInputData;
  errorData: any;
  dataArray: any;//array of data for detailed list
  transactionsDataArray:any; //variable that is just a list of the detailed DataArray
  carouselDataArray: any;
  footerData: Object;
  footerStyle: any = {
    ctaBoxClass: "list-footer",
    ctaBtnClass:"list-footer-btn",
    hasIcon: true,
  };
  transactionType: string;
  teamId: any;
  teamName: string;
  isError: boolean = false;
  titleData: Object;
  imageData: Object;
  profileName: string;
  sort: string = "desc";
  limit: number;
  pageNum: number;
  pageName: string;
  listSort: string = "recent";

  constructor(public transactionsService:TransactionsService, public profHeadService:ProfileHeaderService, public params: RouteParams){
    this.teamId = Number(this.params.params['teamId']);
    this.limit = Number(this.params.params['limit']);
    this.pageNum = Number(this.params.params['pageNum']);

  }

  getTransactionsPage(transactionType, teamId) {
      if( this.transactionType != null) this.transactionType = transactionType;
      if( this.teamId != null) this.teamId = teamId;
      this.profHeadService.getTeamProfile(teamId)
      .subscribe(
          data => {
            var profHeader = this.profHeadService.convertTransactionsPageHeader(data, "Transactions");
            this.profileHeaderData = profHeader.data;
            this.teamName = data.headerData.stats.teamName;
            this.setProfileHeader(this.profileName)
            if(this.pageName != null){this.profileHeaderData['text3'] = this.pageName + this.profileHeaderData['text3'];}

            this.errorData = {
              data: profHeader.error,
              icon: "fa fa-area-chart"
            }
          },
          err => {
            this.isError= true;
              console.error('Error: transactionsData Profile Header API: ', err);
              // this.isError = true;
          }
      );
      this.transactionsService.getTransactionsService(transactionType, teamId, 'page', this.sort, this.limit, this.pageNum)
          .subscribe(
              transactionsData => {
                if(typeof this.dataArray == 'undefined'){//makes sure it only runs once
                  this.dataArray = transactionsData.tabArray;
                  this.pageName = this.dataArray[0].tabDisplay;
                  // have to call this again to update the title component text based on the selected transaciton
                  this.profileHeaderData['text3'] = this.pageName + this.profileHeaderData['text3'];
                }
                if(transactionsData.listData.length == 0){//makes sure it only runs once
                  this.transactionsDataArray = false;
                }else{
                  this.transactionsDataArray = transactionsData.listData;
                }
                this.carouselDataArray = transactionsData.carData;
                //this.profileName = transactionsData.targetData.playerName != null ? transactionsData.targetData.playerName : transactionsData.targetData.teamName;  // TODO include this

              },
              err => {
                this.isError= true;
                  console.error('Error: transactionsData API: ', err);
                  // this.isError = true;
              }
          );
  }

  ngOnInit(){
    var currentTab = "transactions";
    this.getTransactionsPage(currentTab, this.teamId);
  }

  ngOnChanges(){
    if(typeof this.errorData !='undefined' && this.transactionsDataArray == false){
      this.carouselDataArray = this.errorData;
    }
  }

  selectedTab(event){
    switch( event ){
      case "Transactions":
        this.transactionType = "transactions";
        break;
      case "Suspensions":
        this.transactionType = "suspensions";
        break;
      case "Injuries":
        this.transactionType = "injuries";
        break;
      default:
        console.error("Supplied transaction name was not found.");
        this.transactionType = "transactions";
        break;
    }
    this.getTransactionsPage(this.transactionType, this.teamId);
    this.pageName = event;
  }

  setProfileHeader(profile:string){
    this.titleData = {
      imageURL : GlobalSettings.getImageUrl('/mlb/players/no-image.png'),
      text1 : 'Last Updated: ' + GlobalFunctions.formatUpdatedDate(new Date()),
      text2 : ' United States!',
      text3 : 'Top lists - ' + profile,
      icon: 'fa fa-map-marker',
      hasHover: false
    };

    this.imageData = {
      imageUrl: MLBGlobalFunctions.formatTeamLogo(this.teamName),
      urlRouteArray: MLBGlobalFunctions.formatTeamRoute(this.teamName, this.teamId),
      hoverText: "<p>View</p><p>Profile</p>",
      imageClass: "border-2"
    }
  }

  // TODO-JVW Add an arg to the transactions API call for asc/desc to sort the list appropriately
  dropdownChanged(event) {
    if( this.listSort != event){
      this.listSort = event;
      // this.transactionsDataArray.reverse();
      // this.carouselDataArray.reverse();
      this.sort = this.sort == "asc" ? "desc" : "asc";
      this.getTransactionsPage(this.transactionType, this.teamId);
    }
  }
}
