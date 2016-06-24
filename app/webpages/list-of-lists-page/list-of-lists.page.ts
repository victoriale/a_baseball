import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Title} from 'angular2/platform/browser';

import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {TitleComponent, TitleInputData} from '../../components/title/title.component';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {NoDataBox} from '../../components/error/data-box/data-box.component';
import {ListOfListsItem, IListOfListsItem} from "../../components/list-of-lists-item/list-of-lists-item.component";
import {ListOfListsService} from "../../services/list-of-lists.service";
import {LoadingComponent} from "../../components/loading/loading.component";
import {ErrorComponent} from "../../components/error/error.component";
import {PaginationFooter, PaginationParameters} from "../../components/pagination-footer/pagination-footer.component";
import {GlobalSettings} from "../../global/global-settings";
import {GlobalFunctions} from "../../global/global-functions";
import {MLBGlobalFunctions} from "../../global/mlb-global-functions";
import {SidekickWrapper} from "../../components/sidekick-wrapper/sidekick-wrapper.component";

declare var moment:any;

@Component({
    selector: 'list-of-lists-page',
    templateUrl: './app/webpages/list-of-lists-page/list-of-lists.page.html',
    directives: [SidekickWrapper, NoDataBox, BackTabComponent, TitleComponent, SliderCarousel, ListOfListsItem, ModuleFooter, LoadingComponent, ErrorComponent, PaginationFooter],
    providers: [ListOfListsService, Title],
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

    constructor(private listService:ListOfListsService, private params: RouteParams, private _title: Title) {
        _title.setTitle(GlobalSettings.getPageTitle("List of Lists"));
    }

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
                var profileRoute = ["MLB-page"];
                var profileImage = GlobalSettings.getSiteLogoUrl();
                switch ( urlParams.type ) {
                    case "player":
                        profileRoute = MLBGlobalFunctions.formatPlayerRoute(list.targetData.teamName, list.targetData.playerName, list.targetData.playerId);
                        profileImage = GlobalSettings.getImageUrl(list.targetData.imageUrl);
                        break;

                    case "team":
                        profileRoute = MLBGlobalFunctions.formatTeamRoute(list.targetData.teamName, list.targetData.teamId);
                        profileImage = GlobalSettings.getImageUrl(list.targetData.teamLogo);
                        break;

                    default: break;
                }
                this._title.setTitle(GlobalSettings.getPageTitle("List of Lists", this.profileName));
                this.titleData = {
                    imageURL : profileImage,
                    imageRoute: profileRoute,
                    text1 : 'Last Updated: ' + GlobalFunctions.formatUpdatedDate(list.lastUpdated),
                    text2 : ' United States',
                    text3 : 'Top lists - ' + this.profileName,
                    icon: 'fa fa-map-marker'
                };

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
        console.log("pagination params", input);
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
            navigationPage: navigationPage,
            navigationParams: navigationParams,
            indexKey: 'pageNum'
        };
    }

    ngOnInit(){
        this.getListOfListsPage(this.params.params, this.version);
    }
}
