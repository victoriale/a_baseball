import {Component, OnInit} from 'angular2/core';
import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter} from '../../components/module-footer/module-footer.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {TitleComponent, TitleInputData} from '../../components/title/title.component';
import {BackTabComponent} from '../../components/backtab/backtab.component';
import {NoDataBox} from '../../components/error/data-box/data-box.component';
import {ListOfListItem} from "../../components/list-of-list-item/list-of-list-item.component";
import {ListOfListsService} from "../../services/list-of-lists.service";
import {RouteParams} from 'angular2/router';
import {LoadingComponent} from "../../components/loading/loading.component";
import {ErrorComponent} from "../../components/error/error.component";

@Component({
    selector: 'list-of-lists-page',
    templateUrl: './app/webpages/list-of-lists-page/list-of-lists.page.html',
    directives: [NoDataBox, BackTabComponent, TitleComponent, SliderCarousel, ListOfListItem, ModuleFooter, LoadingComponent, ErrorComponent],
    providers: [ListOfListsService],
    inputs:[]
})

export class ListOfListsPage implements OnInit{
    errorData: any;
    dataArray: any;//array of data for detailed list
    detailedDataArray:any; //variable that is just a list of the detailed DataArray
    carouselDataArray: any;
    isError: boolean: false;
    footerData: Object;
    footerStyle: any = {
        ctaBoxClass: "list-footer",
        ctaBtnClass:"list-footer-btn",
        hasIcon: true,
    };

    constructor(private lolService:ListOfListsService){
    }

    getListOfListsPage() {
        this.lolService.getListOfListsService("module")
          .subscribe(
            listOfListsData => {
                //console.log(listOfListsData);
                this.detailedDataArray = listOfListsData.listData;
                this.dataArray = true
                //this.carouselDataArray = listOfListsData.carData
            },
            err => {
                console.log('Error: listOfListsData API: ', err);
                this.isError = true;
            }
          );
    }

    ngOnInit(){
      this.getListOfListsPage();
    }


}
