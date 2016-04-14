import {Component, OnInit, Input, OnChanges} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {moduleHeader} from "../../components/module-header/module-header";
import {MediaImages} from "../../components/media-images/media-images.component";
import {GlobalFunctions} from '../../global/global-functions';
import {PropertyListingInterface} from '../../global/global-interface';
import {ListViewCarousel} from '../../components/carousel/list-view/list-view.component';
declare var moment: any;

@Component({
    selector: 'trending-homes',
    templateUrl: './app/modules/trending-homes/trending-homes.module.html',

    directives: [ListViewCarousel, moduleHeader, MediaImages],
    inputs:['locData']
})

export class TrendingHomes implements OnInit {
    public locData:any;
    public moduleTitle: string;
    public profileType: string;
    public trending: boolean;
    public counter: number = 0;
    carouselData: any = [];
    listData:any = [];
    headerData: any;
    expand:boolean = false;
    data: any;
    modal:boolean = true;
    public index: number = 0;
    @Input() trendingHomesData: any;
    image_url:string ='/app/public/no_photo_images/onError.png';

    constructor(private router: Router, private _params: RouteParams, private globalFunctions: GlobalFunctions){
      //Determine what page the profile header module is on
      this.profileType = this.router.hostComponent.name;
    }

    expandModal(){
      if(this.expand == true){
        this.expand = false;
      }else{
        this.expand = true;
      }
      return this.expand;
    }

    left(){
      this.counter--;
      if(this.counter < 0){
        this.counter = this.carouselData.length - 1;
      }
      this.listData = this.carouselData[this.counter];
    }

    right(){
      this.counter++;
      if(this.counter == this.carouselData.length){
        this.counter = 0;
      }
      this.listData = this.carouselData[this.counter];
    }

    dataFormatter(){// TRANSFORM DATA TO PLUG INTO COMPONENTS
      //grab data for the header
      var data = this.trendingHomesData;
      //grab data for the list
      var originalData = data.listData;
      var listData = [];
      var carouselData = [];
      var globeFunc = this.globalFunctions;
      var totalLength = originalData.length;
      var defaultImage = this.image_url;
      var cityState = this.globalFunctions.toTitleCase(originalData[0].city) + ', ' + this.globalFunctions.stateToAP(originalData[0].stateOrProvince);
      var location = this.globalFunctions.toTitleCase(originalData[0].fullStreetAddress) + ' ' + cityState;
      if(this.profileType === 'LocationPage'){
          this.moduleTitle = 'Most Trending Homes In ' + cityState;
      }else if(this.profileType === 'ProfilePage'){
          this.moduleTitle = 'Most Trending Homes Around ' + location;
      }
      originalData.forEach(function(val, i){
        val.listPrice = globeFunc.commaSeparateNumber(val.listPrice);
        for(var obj in val){
          if(val[obj] == null){
            val[obj] = 'N/A';
          }
        }

        //grab featured data about listing
        if(typeof val.virtualTour == 'undefined'){
          val.virtualTour = 'N/A';
        }
        //if there is no photo put in default photo
        if(val.photos.length == 0){
          val.photos.push(defaultImage);
        }
        var carData = {
          address:val.fullStreetAddress,
          daysOnMarket: globeFunc.formatDaysOnMarket(val.daysOnMarket),
          largeImage:val.photos[0],
          price: val.listPrice,
          priceName: "SALE",
          zipCode:val.postalCode,
          city: val.city,
          state: val.stateOrProvince,
          photos:val.photos,
          locUrl1: "Location-page",
          locUrl2: {loc: val.city + '_' +val.stateOrProvince},
          virtualTour: val.virtualTour,
          listName: globeFunc.convertListName(data.listName),
          totalListings: totalLength,
          rank: i+1,
        }
        carData['url1'] = "../../Magazine";
        carData['url2'] = {addr:val.addressKey};
        carData['url3'] = "PropertyOverview";

        carouselData.push(carData);
      })//END of forEach
      //set to listData
      this.carouselData = carouselData;
      this.counter = 0;
      this.listData = carouselData[this.counter];
    }//END OF TRANSFORM FUNCTION

    ngOnInit(){
        this.trending = true; // set flag to display trending button for media-images.component
    }
    //On Change Call
    ngOnChanges(event){
        //Get changed input
        var currentTrendingHomesData = event.trendingHomesData.currentValue;
        //If the data input is valid run transform data function
        if(currentTrendingHomesData !== null && currentTrendingHomesData !== false) {
            this.dataFormatter();
        }
    }
}
