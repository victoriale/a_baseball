import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {Router, RouteParams} from '@angular/router-deprecated';

import {ModuleHeader} from '../../components/module-header/module-header.component';
import {FlipTilesComponent, TileData} from '../../components/flip-tiles/flip-tiles.component';
import {FeatureComponent} from '../../components/feature-list/feature-list.component';
import {GlobalFunctions} from '../../global/global-functions';

@Component({
    selector: 'featured-lists-module',
    templateUrl: './app/modules/featured_lists/featured_lists.module.html',
    directives: [ModuleHeader, FlipTilesComponent, FeatureComponent],
    providers: [],
    inputs:['locData']
})

export class FeaturedListsModule implements OnInit{
    public locData: any;
    public profileType: string;
    public moduleTitle: string;
    public tileData: Array<TileData>;
    public listData: Object;
    public index: number = 0;
    @Input() featuredListData: any;

    constructor(private router: Router, private _params: RouteParams){
        //Determine what page the profile header module is on
        this.profileType = this.router.hostComponent.name;
    }

    //Build Module Title
    setModuleTitle(){
        if(this.profileType === 'LocationPage'){
            //Location Featured List Module
            var paramLocation: string = this._params.get('loc');
            var paramCity: string = GlobalFunctions.toTitleCase(this.locData.city);
            paramCity = GlobalFunctions.toTitleCase(paramCity.replace(/%20/g, " "));
            var paramState: string = this.locData.state;
            this.moduleTitle = 'Featured Lists for ' + paramCity + ', ' + paramState;
        }else if(this.profileType === 'ProfilePage'){
            //Listing Crime Module
            var paramAddress = this._params.get('address').split('-');
            var paramState = paramAddress[paramAddress.length -1];
            var paramCity = paramAddress [paramAddress.length - 2];
            var tempArr = paramAddress.splice(-paramAddress.length, paramAddress.length - 2);
            var address = tempArr.join(' ');

            this.moduleTitle = 'Featured List for ' + GlobalFunctions.toTitleCase(address) + ' ' + GlobalFunctions.toTitleCase(paramCity) + ', ' + paramState;
        }
    }

    left(){
        if(this.featuredListData === null){
            return false;
        }

        var max = this.featuredListData.listData.length - 1;
        if(this.index > 0){
            this.index -= 1;
            this.transformData();
        }else{
            this.index = max;
            this.transformData();
        }


    }
    right(){
        if(this.featuredListData === null){
            return false;
        }

        var max = this.featuredListData.listData.length - 1;

        if(this.index < max){
            this.index += 1;
            this.transformData();
        }else{
            this.index = 0;
            this.transformData();
        }
    }

    //Initialization Call
    ngOnInit(){
        this.setModuleTitle();
        //Set static data - Will remove when routes further defined
    }

    transformData(){
        var data = this.featuredListData;
        // Exit function if no list data is found
        if(data.listData.length === 0){
            return false;
        }
        var listData = data.listData[this.index];
        //Build heading 2 description
        //Disabled until component can handle empty values for descriptions
        //if((listData.numBedrooms === null || listData.numBedrooms === '0') && (listData.numBathrooms === null || listData.numBedrooms === '0')){
        //    //No bedrooms or bathrooms defined
        //    var heading2 = '';
        //}else if((listData.numBedrooms !== null && listData.numBedrooms !== '0') && (listData.numBathrooms === null || listData.numBathrooms === '0')){
        //    //Bedrooms defined, bathrooms undefined
        //    var heading2 = 'Bedrooms: ' + listData.numBedrooms;
        //}else if((listData.numBedrooms === null || listData.numBedrooms === '0') && (listData.numBathrooms !== null && listData.numBathrooms !== '0')){
        //    //Bedrooms undefined, bathrooms defined
        //    var heading2 = 'Bathrooms: ' + listData.numBathrooms;
        //}else if((listData.numBedrooms !== null && listData.numBedrooms !== '0') && (listData.numBathrooms !== null && listData.numBathrooms !== '0')){
        //    //Bedrooms and bathrooms defined
        //    var heading2 = 'Bedrooms: ' + listData.numBedrooms + ' | Bathrooms: ' + listData.numBathrooms;
        //}
        var heading2 = 'Bedrooms: ' + listData.numBedrooms + ' | Bathrooms: ' + listData.numBathrooms;
        //Used for both location and listing profile
        this.listData = {
            rank: this.index + 1,
            header: 'Trending Real Estate',
            title: "",//GlobalFunctions.convertListName(data.listName),
            hding1: GlobalFunctions.toTitleCase(listData.fullStreetAddress),
            hding2: GlobalFunctions.toTitleCase(listData.city) + ', ' + listData.stateOrProvince + ' ' + listData.postalCode,
            detail1: heading2,
            detail2: listData.listPrice === null ? '' : 'Asking Price: ',
            // detail3: GlobalFunctions.formatPriceNumber(listData.listPrice),
            imageUrl: listData.photos.length === 0 ? null : listData.photos[0],
            ListUrl: 'List-page',
            listParam: {
                viewType: 'list',
            //   listname: GlobalFunctions.camelCaseToKababCase(data.listName),
              state: listData.stateOrProvince,
              city: listData.city,
              page: '1',
            },
            listingUrl1: '../../Magazine',
            listingParam: {addr: listData.addressKey},
            listingUrl2: 'PropertyOverview',
        }

        //get tiles data
        this.tileData = [{
            buttonText: 'Open Page',
            title: 'Real Estate Trending List',
            faIcon: 'fa-list-ul',
            description: '',
            routerInfo: ['List-page',
              { viewType: 'list',
                // listname: GlobalFunctions.camelCaseToKababCase(data.listName),
                state: listData.stateOrProvince,
                city: listData.city,
                page: '1',
            }],
          },
          {
            buttonText: 'Open Page',
            title: 'Top City Lists',
            faIcon: 'fa-trophy',
            description: '',
            routerInfo: ['List-of-lists-page',
              { state: listData.stateOrProvince,
                city: listData.city
              }],
          },
          {
            buttonText: 'Open Page',
            title: 'Similar Statewide Lists',
            faIcon: 'fa-th-large',
            description: '',
            routerInfo: ['List-of-lists-page-state', { state: listData.stateOrProvince }],
        }]
    }

    //On Change Call
    ngOnChanges(event){
        //Get changed input
        if(typeof event.featuredListData != 'undefined'){
          var currentFeaturedListData = event.featuredListData.currentValue;
          //If the data input is valid run transform data function
          if(currentFeaturedListData !== null && currentFeaturedListData !== false) {
            //Perform try catch to make sure module doesnt break page
            try{
              //If featured list data has no list data (length of 0) throw error to hide module
              if(this.featuredListData.listData.length === 0){
                throw 'No Data available for featured list - hiding module';
              }
              this.transformData();
            }catch(e){
              console.log('Error - Featured List Module ', e);
              this.featuredListData = undefined;
            }//end of
          }//end of null check
        }//end of event check
    }
}
