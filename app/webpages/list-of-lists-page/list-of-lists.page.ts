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
import {PaginationFooter} from "../../components/pagination-footer/pagination-footer.component";

declare var moment:any;

@Component({
    selector: 'list-of-lists-page',
    templateUrl: './app/webpages/list-of-lists-page/list-of-lists.page.html',
    directives: [NoDataBox, BackTabComponent, TitleComponent, SliderCarousel, ListOfListItem, ModuleFooter, LoadingComponent, ErrorComponent, PaginationFooter],
    providers: [ListOfListsService],
    inputs:[]
})

export class ListOfListsPage implements OnInit{
    errorData: any;
    dataArray: any; //array of data for detailed list
    detailedDataArray: any; //variable that is just a list of the detailed DataArray
    displayData: any; // paginated data to be displayed
    carouselDataArray: any;
    isError: boolean = false;
    paginationSize: number = 10;
    paginationParameters: Object;
    index: number = 0;
    footerData: Object;
    footerStyle: any = {
        ctaBoxClass: "list-footer",
        ctaBtnClass:"list-footer-btn",
        hasIcon: true,
    };
    titleData: {};

    constructor(private lolService:ListOfListsService){
        this.titleData = {
            imageURL : 'http://prod-sports-images.synapsys.us/mlb/players/no-image.png',
            text1 : 'Last Updated: ' + moment().format("dddd, MMMM DD, YYYY"),
            text2 : ' United States',
            text3 : 'Top lists - [Profile Name]',
            icon: 'fa fa-map-marker',
            hasHover: false
        };
    }

    getListOfListsPage() {
        //   getListOfListsService(version, type?, scope?, conference?, count?, page?){
        this.lolService.getListOfListsService("page", null, null, null, 20, 1)
          .subscribe(
            listOfListsData => {
                console.log("1",listOfListsData);
                this.detailedDataArray = listOfListsData.listData;
                this.dataArray = true
                this.carouselDataArray = listOfListsData.carData
                this.sanitizeListofListData();
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

    sanitizeListofListData(){
        var data = this.detailedDataArray;  // full array
        var size = this.paginationSize;
        var sanitizedArray = [];
        var max = Math.ceil(data.length / size);
        var objCount = 0;

        //Run through a loop the check data and generated and obj array fill with a max of size variable
        data.forEach(function(item, index){
            if(typeof sanitizedArray[objCount] == 'undefined'){
                sanitizedArray[objCount] = [];
            }
            sanitizedArray[objCount].push(item);
            if(item !== null  && sanitizedArray[objCount].length == size){
                objCount++;
            }
        });

        //display current data that user has click on and possibly the page user has declared
        this.displayData = sanitizedArray[this.index];

        if(typeof this.displayData == 'undefined'){
            this.displayData = null;
        }

        if(data != '' || data.length > 0){ //only show if there are results
            //Set up parameters for pagination display
            this.setPaginationParameters(max);
        }else{
            this.paginationParameters = false;
        }
    }

    //Function to set up parameters for pagination footer
    setPaginationParameters(max){
        //Define parameters to send to pagination footer
        this.paginationParameters = {
            index: this.index+1,
            max: max,
            paginationType: 'module',
            viewAllPage: 'Widget-page'
        }
    }

    //Function that fires when a new index is clicked on pagination footer
    newIndex(index){
        this.index = index-1;
        this.showCurrentData();
    }

    //will run for every event that triggers, keystroke, click, tab changes and it will updated the page
    showCurrentData() {
        //check to make sure to only run correctly if data is being shown
        if (typeof this.detailedDataArray !== 'undefined' && typeof this.detailedDataArray !== 'undefined') {
            this.sanitizeListofListData();// this is where the data will be sanitized for pagination
        }
    }
}
