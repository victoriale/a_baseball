import {Component, OnInit} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {RouteParams, ROUTER_DIRECTIVES, RouteConfig, Router} from 'angular2/router';
import {GlobalFunctions} from '../../global/global-functions';
import {DirectoryService} from '../../global/directory.service';
import {LoadingComponent} from '../../components/loading/loading.component';
import {ErrorComponent} from '../../components/error/error.component';

declare var moment: any;
declare var lh: any;

@Component({
    selector: 'Directory-page',
    templateUrl: './app/webpages/directory-page/directory.page.html',
    
    directives: [ROUTER_DIRECTIVES, NgClass, LoadingComponent, ErrorComponent],
    providers: [DirectoryService],
})

export class DirectoryPage {
    public navigationLinks: Array<Object>;
    public listingItems: Array<Object>;

    //Boolean to determine if an error has occurred
    public isError: boolean = false;

    public listingsLimit: number = 20;
    //linkTitle determines title of the link navigation section
    //linkListDisplayed determines if the link navigation section is displayed at all
    public linkTitle: string;
    public linkListDisplayed: boolean;
    //displayListTitle is the list title without hyphens
    public displayListTitle: string;
    //Parameters
    //paramCityHyphen is the city parameter with hyphens. This is used for the url (normal paramCity is used for apis
    public paramListTitle: string;
    public paramPageNumber: string;
    public paramState: string;
    public paramCity: string;
    public paramCityHyphen: string;
    public paramZipcode: string;
    public paramCityStartsWith: string;
    //Variable to determine what type of directory page is displaying
    public pageType: string;
    //fullState is the full name for the state parameter defined in the url
    public fullState: string;
    //pageName is the name of the route
    //nextParams are parameters used by the next buttons
    //backParams are parameters used by the back buttons
    public pageName: string;
    public nextParams: Object;
    public backParams: Object;
    //Determines if active class needs to be applied to buttons
    public backHighlighted: boolean;
    public nextHighlighted: boolean;
    //maxPageCount is the maximum number of pages allowed for particular directory scope
    public maxPageCount: Object;
    //rangeDisplay is what results range is displayed (ex. 1-20)
    public rangeDisplay: string;
    //totalListings number amount of listings that are available based on parameters
    //totalListingsDisplayed display value (with commas) of total listings amount
    //totalListingsLoaded is used to determine what is displayed on the page (loading or data) through ngIfs
    public totalListings: number;
    public totalListingsDisplayed: string;
    public totalListingsDescription: string;
    public totalListingsLoaded: boolean = false;
    //Determines if more cities link should be displayed
    public moreCitiesAvailable: boolean = false;
    public metroArea: string;
    public showMetroAreaSection: boolean = false;
    public showAlphabeticalCityFilter: boolean = false;
    public isPartnerSite: boolean = false;

    //Used to format 'XX of XXX Homes' string
    public listingNameSingular = "Home";
    public listingNamePlural = "Homes";

    constructor(private router: Router, private _params: RouteParams, private globalFunctions: GlobalFunctions, private _directoryService: DirectoryService){//Grab static parameters

        this.paramListTitle = this._params.get('listTitle');
        this.paramPageNumber = this._params.get('pageNumber');

        //Determine what type of page the directory is display (options are national, state city, or zipcode)
        if(this._params.get('zipcode') !== null){
            this.pageType = 'zipcode';
            //Grab dynamic parameters
            this.paramState = this._params.get('state');
            this.paramCity = this._params.get('city').replace(/-/g, ' ');
            this.paramCityHyphen = this._params.get('city');
            this.paramZipcode = this._params.get('zipcode');
        }else if(this._params.get('city') !== null){
            this.pageType = 'city';
            //Grab dynamic parameters
            this.paramState = this._params.get('state');
            this.paramCity = this._params.get('city').replace(/-/g, ' ');
            this.paramCityHyphen = this._params.get('city');
        }else if(this._params.get('state') !== null){
            this.pageType = 'state';

            //Special Case - If query parameter allCities is defined, set page to all Cities. This lets the reset of the page know what needs to be displayed
            if(this._params.get('allCities') !== null){
                this.pageType = 'allCities';
            }

            //Grab dynamic parameters
            this.paramState = this._params.get('state');
            this.paramCityStartsWith = this._params.get("startsWith");
        }else{
            this.pageType = 'national';
        }
        // Scroll page to top to fix routerLink bug
        window.scrollTo(0, 0);
        this.router.root
          .subscribe(
          route => {
            var partnerID = route.split('/');
            this.isPartnerSite = partnerID[0] != '' ? true : false;
          }
        );

        // Scroll page to top to fix routerLink bug
        window.scrollTo(0, 0);
    }

    //Function to set static data on the page
    setStaticData(){
        //If state parameter is not undefined, get the full state name
        if(typeof this.paramState !== 'undefined'){
            this.fullState = this.globalFunctions.fullstate(this.paramState);
        }
        //Get readable list title
        this.displayListTitle = this.paramListTitle.replace(/-/g, ' ');
        this.listingNameSingular = "Home";
        this.listingNamePlural = "Homes";

        switch(this.pageType){
            case 'national':
                this.linkTitle = 'State Sub Directory';
                this.linkListDisplayed = true;
                this.pageName = 'Directory-page';
                this.showMetroAreaSection = false;
                this.showAlphabeticalCityFilter = false;
                break;
            case 'state':
                this.linkTitle = 'City Sub Directory';
                this.linkListDisplayed = true;
                this.pageName = 'Directory-page-state';
                this.showMetroAreaSection = false;
                this.showAlphabeticalCityFilter = false;
                break;
            case 'allCities':
                this.linkTitle = 'Browse cities in ' + this.fullState;
                if ( this.paramCityStartsWith !== null && this.paramCityStartsWith !== undefined ) {
                  this.linkTitle += " that start with " + this.paramCityStartsWith;
                }
                this.linkListDisplayed = true;
                this.pageName = 'Directory-page-state';
                this.showMetroAreaSection = false;
                this.showAlphabeticalCityFilter = false;
                this.listingNameSingular = "City";
                this.listingNamePlural = "Cities";
                break;
            case 'city':
                //No link list displayed
                this.linkTitle = '';
                this.linkListDisplayed = false;
                this.pageName = 'Directory-page-city';
                this.showMetroAreaSection = true;
                this.showAlphabeticalCityFilter = false;
                break;
            case 'zipcode':
                //No link list displayed
                this.linkTitle = '';
                this.linkListDisplayed = false;
                this.pageName = 'Directory-page-zipcode';
                this.showMetroAreaSection = false;
                this.showAlphabeticalCityFilter = false;
                break;
        }
    }

    //Function get data from api calls
    getDirectoryData(){
        var self = this;

        //Make data calls here
        switch(this.pageType){
            case 'national':
                //Data call to get state list for navigation
                this._directoryService.getStateList()
                    .subscribe(
                        data => self.setupStateNavigation(data),
                        err => {
                            console.log('Error - Directory National State List: ', err);
                            this.isError = true;
                        }
                    );
                //Data call to get directory list data
                this._directoryService.getDirectoryData(this.paramPageNumber, this.paramListTitle, null, null, null)
                    .subscribe(
                        data => self.setupData(data),
                        err => {
                            console.log('Error - Directory National Data: ', err);
                            this.isError = true;
                        }
                    );

                break;
            case 'state':
                //Data call to get city list for navigation
                this._directoryService.getCityList(this.paramState)
                    .subscribe(
                        data => {
                            var navigationArray = [];

                            //If there are 20 cities returned display more cities link
                            if(data.cities.length === 20){
                                this.moreCitiesAvailable = true;
                            }

                            //Build cities array for navigation links
                            data.cities.forEach(function(item, index){
                                navigationArray.push({
                                    title: item,
                                    page: 'Directory-page-city',
                                    params : {
                                        state: self.paramState,
                                        city: item.replace(/ /g, '-'),
                                        listTitle: self.paramListTitle,
                                        pageNumber: 1
                                    }
                                })
                            });

                            self.navigationLinks = navigationArray;
                        },
                        err => {
                            console.log('Error - Directory State City List: ', err);
                            this.isError = true;
                        }
                    );
                //Data call to get directory list data
                this._directoryService.getDirectoryData(this.paramPageNumber, this.paramListTitle, this.paramState, null, null)
                    .subscribe(
                        data => self.setupData(data),
                        err => {
                            console.log('Error - Directory State Data: ', err);
                            this.isError = true;
                        }
                    );

                break;
            case 'allCities':
                //Data call to get cities listings
                this._directoryService.getAllCities(this.paramPageNumber, this.paramState, this.paramCityStartsWith)
                    .subscribe(
                        data=> {
                            this.totalListings = Number(data.totalCities);
                            this.totalListingsDisplayed = this.globalFunctions.commaSeparateNumber(this.totalListings);
                            this.totalListingsDescription = this.totalListings === 1 ? this.listingNameSingular : this.listingNamePlural;
                            this.totalListingsLoaded = true;

                            this.getPaginationParameters();
                            this.setupAlphabeticalCityNavigation();

                            var returnArray = [];
                            var self = this;
                            data.cities.forEach(function(item, index){
                                returnArray.push({
                                    city: item,
                                    cityLink: item.replace(/ /g, '-'),
                                    state: self.paramState
                                })
                            });
                            this.listingItems = returnArray;
                        },
                        err => {
                            console.log('Error - Directory All Cities Data: ', err);
                            this.isError = true;
                        }
                    );
                break;
            case 'city':
                //Data call to get directory list data
                this._directoryService.getDirectoryData(this.paramPageNumber, this.paramListTitle, this.paramState, this.paramCity, null)
                    .subscribe(
                        data => self.setupData(data),
                        err => {
                            console.log('Error - Directory City Data: ', err);
                            this.isError = true;
                        }
                    );
                break;
            case 'zipcode':
                //Data call to get directory list data
                this._directoryService.getDirectoryData(this.paramPageNumber, this.paramListTitle, this.paramState, this.paramCity, this.paramZipcode)
                    .subscribe(
                        data => self.setupData(data),
                        err => {
                            console.log('Error - Directory Zipcode Data: ', err);
                            this.isError = true;
                        }
                    );
                break;
        }
    }

    //Function to format list data sent from the api for display
    formatList(data){
        var self = this;
        var listhubKeys = [];//USED TO PUSH ALL KEYS FOR LISTHUB TRACKING
        var returnArray = [];
        //If input is empty exit function
        if(data.length === 0){
            return data;
        }

        data.forEach(function(item, index){
            var listing = {};

            listing['lastUpdated'] = item.modificationTimestamp === null ? null : 'Last Updated: ' + moment(item.modificationTimestamp).format('YYYY-MM-DD');
            listing['addressKey'] = item.addressKey;
            listing['address'] = item.fullStreetAddress;
            listing['city'] = item.city;
            //City Parameter used for routing where spaces are replaced with hyphens
            listing['cityLink'] = item.city.replace(/ /g, '-');
            listing['state'] = item.stateOrProvince;
            listing['zipcode'] = item.postalCode;
            listing['squareFeet'] = item.livingArea === null ? null : self.globalFunctions.commaSeparateNumber(item.livingArea) + ' sq. ft';

            if(item.numBedrooms === null || item.numBedrooms === '0'){
                listing['bedrooms'] = null;
            }else if(item.numBedrooms === '1'){
                listing['bedrooms'] = '1 Bedroom';
            }else{
                listing['bedrooms'] = item.numBedrooms + ' Bedrooms';
            }

            if(item.numBathrooms === null || item.numBathrooms === '0'){
                listing['bathrooms'] = null;
            }else if(item.numBathrooms === '1'){
                listing['bathrooms'] = '1 Bathroom';
            }else{
                listing['bathrooms'] = item.numBedrooms + ' Bathrooms';
            }
            listhubKeys.push({lkey: item.listingKey}); //send key to listhub
            returnArray.push(listing);
        });
        //send array of keys for listhub to track
        lh('submit', 'SEARCH_DISPLAY', listhubKeys);
        
        return returnArray;
    }

    //Function to determine pagination parameters
    getPaginationParameters(){
        //Set pageNum variable to use inside function
        var pageNum = Number(this.paramPageNumber);
        //Get max page count to determine next and back button parameters
        var maxPageCount = Math.ceil(this.totalListings / this.listingsLimit);

        switch(this.pageType){
            case 'national':
                //Build back and next button parameters
                this.nextParams = {
                    listTitle: this.paramListTitle,
                    pageNumber: Number(this.paramPageNumber) + 1 <= maxPageCount ? Number(this.paramPageNumber) + 1 : this.paramPageNumber
                };
                this.backParams = {
                    listTitle: this.paramListTitle,
                    pageNumber: Number(this.paramPageNumber) - 1 > 0 ? Number(this.paramPageNumber) - 1 : 1
                };
                break;
            case 'state':
                //Build back and next button parameters
                this.nextParams = {
                    listTitle: this.paramListTitle,
                    pageNumber: Number(this.paramPageNumber) + 1 <= maxPageCount ? Number(this.paramPageNumber) + 1 : this.paramPageNumber,
                    state: this.paramState
                };
                this.backParams = {
                    listTitle: this.paramListTitle,
                    pageNumber: Number(this.paramPageNumber) - 1 > 0 ? Number(this.paramPageNumber) - 1 : 1,
                    state: this.paramState
                };
                break;
            case 'allCities':
                //Build back and next button parameters
                this.nextParams = {
                    listTitle: this.paramListTitle,
                    pageNumber: Number(this.paramPageNumber) + 1 <= maxPageCount ? Number(this.paramPageNumber) + 1 : this.paramPageNumber,
                    state: this.paramState,
                    allCities: true,
                    startsWith: this.paramCityStartsWith
                };
                this.backParams = {
                    listTitle: this.paramListTitle,
                    pageNumber: Number(this.paramPageNumber) - 1 > 0 ? Number(this.paramPageNumber) - 1 : 1,
                    state: this.paramState,
                    allCities: true,
                    startsWith: this.paramCityStartsWith
                };
                break;
            case 'city':
                //Build back and next button parameters
                this.nextParams = {
                    listTitle: this.paramListTitle,
                    pageNumber: Number(this.paramPageNumber) + 1 <= maxPageCount ? Number(this.paramPageNumber) + 1 : this.paramPageNumber,
                    state: this.paramState,
                    city: this.paramCityHyphen
                };
                this.backParams = {
                    listTitle: this.paramListTitle,
                    pageNumber: Number(this.paramPageNumber) - 1 > 0 ? Number(this.paramPageNumber) - 1 : 1,
                    state: this.paramState,
                    city: this.paramCityHyphen
                };
                break;
            case 'zipcode':
                //Build back and next button parameters
                this.nextParams = {
                    listTitle: this.paramListTitle,
                    pageNumber: Number(this.paramPageNumber) + 1 <= maxPageCount ? Number(this.paramPageNumber) + 1 : this.paramPageNumber,
                    state: this.paramState,
                    city: this.paramCityHyphen,
                    zipcode: this.paramZipcode
                };
                this.backParams = {
                    listTitle: this.paramListTitle,
                    pageNumber: Number(this.paramPageNumber) - 1 > 0 ? Number(this.paramPageNumber) - 1 : 1,
                    state: this.paramState,
                    city: this.paramCityHyphen,
                    zipcode: this.paramZipcode
                };
                break;
        }

        //Determine if next and back buttons should be highlighted
        this.nextHighlighted = Number(this.paramPageNumber) + 1 <= maxPageCount;
        this.backHighlighted = Number(this.paramPageNumber) !== 1;

        //Determine range display for directory page (ex. 1-20, 22-40, etc)
        var rangeStart = (pageNum - 1) * this.listingsLimit + 1;
        var rangeEnd = (pageNum * this.listingsLimit <= this.totalListings) ? (pageNum * this.listingsLimit) : this.totalListings;
        this.rangeDisplay = this.globalFunctions.commaSeparateNumber(rangeStart) + "-" + this.globalFunctions.commaSeparateNumber(rangeEnd);
    }

    ngOnInit(){
        this.setStaticData();
        this.getDirectoryData();
    }

    setupData(data) {
      if(typeof data !== 'undefined' && data !== null && data.length !== 0){
          this.totalListings = Number(data[0].totalListings);
          this.totalListingsDisplayed = this.globalFunctions.commaSeparateNumber(this.totalListings);
          this.totalListingsDescription = this.totalListings === 1 ? this.listingNameSingular : this.listingNamePlural;
          this.totalListingsLoaded = true;

          this.getPaginationParameters();
          this.listingItems = this.formatList(data);
      }
    }

    setupStateNavigation(data) {
      var self = this;
      var navigationArray = [];

      //Build states array for navigation links
      data.states.forEach(function(item, index){
        var itemTitle = self.isPartnerSite ? self.globalFunctions.stateToAP(item) : item;
        navigationArray.push({
            title: itemTitle,// self.globalFunctions.fullstate(item),
            page: 'Directory-page-state',
            params: {
                state: item,
                listTitle: self.paramListTitle,
                pageNumber: 1
            }
        })
      });

      self.navigationLinks = navigationArray;
    }

    setupAlphabeticalCityNavigation() {
        var navigationArray = [];
        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        var self = this;

        //Build alphabet array for navigation links
        for ( var i in alphabet ) {
            navigationArray.push({
                title: alphabet[i],
                page: 'Directory-page-state',
                params : {
                    state: self.paramState,
                    listTitle: self.paramListTitle,
                    pageNumber: 1,
                    allCities: true,
                    startsWith: alphabet[i]
                }
            });
        }

        self.navigationLinks = navigationArray;
    }
}
