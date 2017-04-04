import {Component, OnInit} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';
import {Title} from '@angular/platform-browser';

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
import {ProfileHeaderService} from '../../services/profile-header.service';
import {ResponsiveWidget} from '../../components/responsive-widget/responsive-widget.component';

@Component({
    selector: 'list-of-lists-page',
    templateUrl: './app/webpages/list-of-lists-page/list-of-lists.page.html',
    directives: [SidekickWrapper, NoDataBox, BackTabComponent, TitleComponent, SliderCarousel, ListOfListsItem, ModuleFooter, LoadingComponent, ErrorComponent, PaginationFooter, ResponsiveWidget],
    providers: [ListOfListsService, Title, ProfileHeaderService],
    inputs:[]
})

export class ListOfListsPage implements OnInit{
    errorData             : string;
    detailedDataArray     : Array<IListOfListsItem>; //variable that is just a list of the detailed DataArray
    carouselDataArray     : Array<SliderCarouselInput>;
    profileName           : string;
    isError               : boolean = false;
    pageType              : string; // [player,team]
    id                    : string; // [playerId, teamId]
    limit                 : string; // pagination limit
    pageNum               : string; // page of pages to show

    paginationSize        : number = 10;
    index                 : number = 0;
    paginationParameters  : PaginationParameters;
    titleData             : TitleInputData;
    dataProvidedBy        : string;

    constructor(private listService:ListOfListsService,
        private _profileService: ProfileHeaderService,
        private _params: RouteParams,
        private _title: Title) {
        _title.setTitle(GlobalSettings.getPageTitle("List of Lists"));
        this.pageType = this._params.get("type");
        if ( this.pageType == null ) {
            this.pageType = "league";
        }
        this.dataProvidedBy = GlobalSettings.getDataProvidedBy();
    }

    getListOfListsPage(urlParams, logoUrl?: string) {
        this.listService.getListOfListsService(urlParams, this.pageType, "page")
          .subscribe(
            list => {
                if(list.listData.length == 0){//makes sure it only runs once
                    this.detailedDataArray = null;
                }else{
                    this.detailedDataArray = list.listData;
                }
                this.setPaginationParams(list.pagination);
                this.carouselDataArray = list.carData;


                var profileName = "MLB";
                var profileRoute = ["MLB-page"];
                var profileImage = logoUrl ? logoUrl : GlobalSettings.getSiteLogoUrl();
                switch ( urlParams.type ) {
                    case "player":
                        profileName = list.targetData.playerName;
                        profileRoute = MLBGlobalFunctions.formatPlayerRoute(list.targetData.teamName, list.targetData.playerName, list.targetData.playerId);
                        profileImage = GlobalSettings.getImageUrl(list.targetData.imageUrl, GlobalSettings._imgLgLogo);
                        break;

                    case "team":
                        profileName = list.targetData.teamName;
                        profileRoute = MLBGlobalFunctions.formatTeamRoute(list.targetData.teamName, list.targetData.teamId);
                        profileImage = GlobalSettings.getImageUrl(list.targetData.teamLogo, GlobalSettings._imgLgLogo);
                        break;

                    default: break;
                }
                this.profileName = profileName
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
        var params = this._params.params;

        var navigationParams = {
            limit      : params['limit'],
            pageNum    : params['pageNum'],
        };

        if(params['scope'] != null) {
           navigationParams['scope'] = params['scope'];
        }

        if(params['id'] != null) {
           navigationParams['id'] = params['id'];
        }

        if ( this.pageType != "league" ) {
           navigationParams['type'] = this.pageType;
        }

        var navigationPage = this.pageType == "league" ? 'List-of-lists-league-page' : 'List-of-lists-page';
        if ( !this.detailedDataArray ) {
            navigationPage = "Error-page";
        }
        else if ( navigationParams['scope'] ) {
            navigationPage = 'List-of-lists-page-scoped';
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
        if ( this.pageType == "league" ) {
            this._profileService.getMLBProfile()
            .subscribe(data => {
                this.getListOfListsPage(this._params.params, GlobalSettings.getImageUrl(data.headerData.logo, GlobalSettings._imgProfileLogo));
            }, err => {
                console.log("Error loading MLB profile");
            });
        }
        else {
            this.getListOfListsPage(this._params.params);
        }
    }
}
