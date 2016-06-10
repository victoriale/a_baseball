import {Component, OnInit} from 'angular2/core';
import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {TitleComponent, TitleInputData} from '../../components/title/title.component';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {NoDataBox} from '../../components/error/data-box/data-box.component';
import {ListOfListsItem, IListOfListsItem} from "../../components/list-of-lists-item/list-of-lists-item.component";
import {ListOfListsService} from "../../services/list-of-lists.service";
import {RouteParams} from 'angular2/router';
import {LoadingComponent} from "../../components/loading/loading.component";
import {ErrorComponent} from "../../components/error/error.component";
import {PaginationFooter, PaginationParameters} from "../../components/pagination-footer/pagination-footer.component";
import {GlobalSettings} from "../../global/global-settings";

declare var moment:any;

@Component({
    selector: 'list-of-lists-page',
    templateUrl: './app/webpages/list-of-lists-page/list-of-lists.page.html',
    directives: [NoDataBox, BackTabComponent, TitleComponent, SliderCarousel, ListOfListsItem, ModuleFooter, LoadingComponent, ErrorComponent, PaginationFooter],
    providers: [ListOfListsService],
    inputs:[]
})

export class ListOfListsPage implements OnInit{
    errorData             : string;
    detailedDataArray     : Array<IListOfListsItem>; //variable that is just a list of the detailed DataArray
    carouselDataArray     : Array<SliderCarouselInput>;
    profileName           : string;
    isError               : boolean = false;
    version               : string = "page"; // [page,module]
    type                  : string; // [player,team]
    id                    : string; // [playerId, teamId]
    limit                 : string; // pagination limit
    pageNum               : string; // page of pages to show

    paginationSize        : number = 10;
    index                 : number = 0;
    paginationParameters  : PaginationParameters;
    titleData             : TitleInputData;

    constructor(private listService:ListOfListsService, private params: RouteParams) {}

    //getListOfListsService(version, type, id, scope?, count?, page?){
    getListOfListsPage(urlParams, version) {
        this.listService.getListOfListsService(urlParams, version)
          .subscribe(
            list => {
                if(list.listData.length == 0){//makes sure it only runs once
                    this.detailedDataArray = null;
                }else{
                    this.detailedDataArray = list.listData;
                }
                this.setPaginationParams(list.pagination);
                this.carouselDataArray = list.carData;

                this.profileName = list.targetData.playerName != null ? list.targetData.playerName : list.targetData.teamName;  // TODO include this
                this.setProfileHeader(this.profileName)

            },
            err => {
                this.isError= true;
                console.log('Error: ListOfLists API: ', err);
            }
          );
    }

    //PAGINATION
    //sets the total pages for particular lists to allow client to move from page to page without losing the sorting of the list
    setPaginationParams(input) {
        var params = this.params.params;

        var navigationParams = {
            type       : params['type'],
            id         : params['id'],
            limit      : params['limit'],
            pageNum    : params['pageNum'],
        };

        if(params['scope'] != null) {
           navigationParams['scope'] = params['scope'];
        }

        var navigationPage: string;
        if ( !this.detailedDataArray ) {
            navigationPage = "Error-page";
        }
        else {
            navigationPage = navigationParams['scope'] != null ? 'List-of-lists-page-scoped' : 'List-of-lists-page';
        }
        
        this.paginationParameters = {
            index: params['pageNum'] != null ? Number(params['pageNum']) : null,
            max: Number(input.pageCount),
            paginationType: 'page',
            navigationPage: 'Error-page',
            navigationParams: navigationParams,
            indexKey: 'pageNum'
        };
    }

    ngOnInit(){
        this.getListOfListsPage(this.params.params, this.version);
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
