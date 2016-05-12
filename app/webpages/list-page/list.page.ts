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

@Component({
    selector: 'list-page',
    templateUrl: './app/webpages/list-page/list.page.html',
    directives: [PaginationFooter, BackTabComponent, TitleComponent, SliderCarousel, DetailedListItem,  ModuleFooter],
    providers: [ListPageService, ProfileHeaderService],
    inputs:[]
})

export class ListPage implements OnInit{
  dataParams:any;
  dataArray: any;
  detailedDataArray:any;
  carouselDataArray: any;
  footerData: Object;
  profileHeaderData: TitleInputData;
  errorData: any;
  footerStyle: any = {
    ctaBoxClass: "list-footer",
    ctaBtnClass:"list-footer-btn",
    hasIcon: true,
  };
  paginationParameters:any;
  constructor(private listService:ListPageService, private profHeadService:ProfileHeaderService, private params: RouteParams){

  }

  getListPage(urlParams) {
    this.listService.getListPageService(urlParams)
        .subscribe(
            list => {
              this.profileHeaderData = list.profHeader;

              if(list.listData.length == 0){//makes sure it only runs once
                this.detailedDataArray = false;
              }else{
                this.detailedDataArray = list.listData;
              }
              this.setPaginationParams(list.pagination);
              this.carouselDataArray = list.carData;
            },
            err => {
                console.log('Error: list API: ', err);
                // this.isError = true;
            }
        );
  }

  //PAGINATION
  //sets the total pages for particular lists to allow client to move from page to page without losing the sorting of the list
  setPaginationParams(input) {
      var info = input.listInfo;
      var params = this.params.params;

      var navigationParams = {
        profile: params['profile'],
        listname: params['listname'],
        sort: params['sort'],
        conference: params['conference'],
        division: params['division'],
        limit: params['limit'],
      };

      if(this.detailedDataArray == false){
        this.paginationParameters = {
          index: params['pageNum'],
          max: input.pageCount,
          paginationType: 'page',
          navigationPage: 'Error-page',
          navigationParams: navigationParams,
          indexKey: 'pageNum'
        };
      }else{
        this.paginationParameters = {
          index: params['pageNum'],
          max: input.pageCount,
          paginationType: 'page',
          navigationPage: 'List-page',
          navigationParams: navigationParams,
          indexKey: 'pageNum'
        };
      }
  }

  ngOnInit(){
      this.getListPage(this.params.params);
  }

}
