import {Component, OnInit} from 'angular2/core';
import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter, ModuleFooterData, FooterStyle} from '../../components/module-footer/module-footer.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {TitleComponent, TitleInputData} from '../../components/title/title.component';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {DraftHistoryService} from '../../services/draft-history.service';
import {RouteParams} from 'angular2/router';
import {ListPageService} from '../../services/list-page.service';
import {NoDataBox} from '../../components/error/data-box/data-box.component';
import {ProfileHeaderService} from '../../services/profile-header.service';
import {PaginationFooter} from '../../components/pagination-footer/pagination-footer.component';
import {LoadingComponent} from "../../components/loading/loading.component";
import {ErrorComponent} from "../../components/error/error.component";

@Component({
    selector: 'schedules-page',
    templateUrl: './app/webpages/schedules-page/schedules.page.html',
    directives: [ErrorComponent, LoadingComponent,PaginationFooter, BackTabComponent, TitleComponent, SliderCarousel, DetailedListItem,  ModuleFooter],
    providers: [ListPageService, ProfileHeaderService],
    inputs:[]
})

export class SchedulesPage implements OnInit{
  dataParams:any;
  dataArray: any;
  detailedDataArray:any;
  carouselDataArray: any;
  footerData: Object;
  profileHeaderData: TitleInputData;
  errorData: any;
  paginationParameters:any;
  isError: boolean = false;
  constructor(private listService:ListPageService, private profHeadService:ProfileHeaderService, private params: RouteParams){

  }

  getSchedulesPage(urlParams) {
    // this.listService.getListPageService(urlParams)
    //     .subscribe(
    //         list => {
    //           this.profileHeaderData = list.profHeader;
    //           if(list.listData.length == 0){//makes sure it only runs once
    //             this.detailedDataArray = false;
    //           }else{
    //             this.detailedDataArray = list.listData;
    //           }
    //           this.setPaginationParams(list.pagination);
    //           this.carouselDataArray = list.carData;
    //         },
    //         err => {
    //           this.isError= true;
    //             console.log('Error: list API: ', err);
    //             // this.isError = true;
    //         }
    //     );
  }

  ngOnInit(){
      // this.getListPage(this.params.params);
  }

}
