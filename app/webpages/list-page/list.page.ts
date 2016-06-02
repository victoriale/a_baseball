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
import {GlobalFunctions} from "../../global/global-functions";
import {DynamicWidgetCall} from "../../services/dynamic-list-page.service";

@Component({
    selector: 'list-page',
    templateUrl: './app/webpages/list-page/list.page.html',
    directives: [ErrorComponent, LoadingComponent,PaginationFooter, BackTabComponent, TitleComponent, SliderCarousel, DetailedListItem,  ModuleFooter],
    providers: [ListPageService, ProfileHeaderService, DynamicWidgetCall],
    inputs:[]
})

export class ListPage implements OnInit{
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
  isError: boolean = false;
  tw: string;
  sw: string;
  input: string;
  pageNumber: any;

  constructor(private listService:ListPageService, private profHeadService:ProfileHeaderService, private params: RouteParams, private dynamicWidget: DynamicWidgetCall){
    if(params.params['query'] != null){
      let query = params.params['query'];
      // Setup this way in case we want to switch out null with some default values
      let twArr = query.match(/tw-(.*?)(\+|$)/);
      this.tw = twArr != null && twArr.length > 1 ? twArr[1] : null;
      let swArr = query.match(/sw-(.*?)(\+|$)/);
      this.sw = swArr != null && swArr.length > 1 ? swArr[1] : null;
      // input always needs to be last item
      let inputArr = query.match(/input-(.*)/);
      this.input = inputArr != null &&  inputArr.length > 1 ? inputArr[1] : null;
      this.pageNumber = 1;
    }
  }

  getListPage(urlParams) {
    if(urlParams.query != null){
      this.getDynamicList();
    }else {
      this.getStandardList(urlParams);
    }
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

  setDynamicPagination(input) {
    var navigationParams = {
      query: this.params.params['query'],
    };

    if(this.detailedDataArray == false){
      this.paginationParameters = {
        index: this.pageNumber,
        max: input.max,
        paginationType: 'page',
        navigationPage: 'Error-page',
        navigationParams: navigationParams,
        indexKey: 'pageNum'
      };
    }else{
      this.paginationParameters = {
        index: this.pageNumber,
        max: input.max,
        paginationType: 'module',
        navigationPage: 'List-page',
        navigationParams: navigationParams,
        indexKey: null
      };
    }
  }


  getStandardList(urlParams){
    this.listService.getListPageService(urlParams)
      .subscribe(
        list => {
          this.profileHeaderData = list.profHeader;
          if (list.listData.length == 0) {//makes sure it only runs once
            this.detailedDataArray = false;
          } else {
            this.detailedDataArray = list.listData;
          }
          this.setPaginationParams(list.pagination);
          this.carouselDataArray = list.carData;
        },
        err => {
          this.isError = true;
          console.log('Error: list API: ', err);
          // this.isError = true;
        }
      );
  }

  getDynamicList() {
    if( !this.tw ){
      // Not enough parameter : display error message
      this.isError = true;
      return;
    }
    this.dynamicWidget.getWidgetData(this.tw, this.sw, this.input)
      .subscribe(
        list => {
          this.profileHeaderData = list.profHeader;
          if (list.listData.length == 0) {//makes sure it only runs once
            this.detailedDataArray = false;
          } else {
            this.detailedDataArray = list.listData;
          }
          this.setDynamicPagination(list.pagination);
          this.carouselDataArray = list.carData;
        },

        err => {
          this.isError = true;
          console.log(err);
        }
      );
  }

  newIndex(index){
    this.pageNumber = index;
    window.scrollTo(0, 0);
  }


  ngOnInit(){
      this.getListPage(this.params.params);
  }

}
