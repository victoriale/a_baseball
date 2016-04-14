import {Component, OnInit, Injector} from 'angular2/core';
import {RouteParams, Router, RouteData, RouteConfig, RouterOutlet, ROUTER_DIRECTIVES, LocationStrategy, RouterLink} from 'angular2/router';
import {ProfilePage} from "../webpages/profile-page/profile.page";
import {LocationPage} from "../webpages/location-page/location.page";
import {ListPage} from "../webpages/list-page/list.page";
import {ListOfListsPage} from "../webpages/list-of-lists-page/list-of-lists.page";
import {AmenitiesListPage} from "../webpages/amenities-lists/amenities-lists.page";
import {SchoolListsPage} from "../webpages/school-lists/school-lists.page";
import {HomePage} from "../webpages/home-page/home.page";
import {PartnerHomePage} from "../webpages/partner-home-page/partner-home-page";
import {ComponentPage} from "../webpages/component-page/component.page";
import {AboutUsPage} from "../webpages/aboutus-page/aboutus.page";
import {ErrorPage} from "../webpages/error-page/error-page.page";
import {ContactUsPage} from "../webpages/contactus-page/contactus.page";
import {DisclaimerPage} from "../webpages/disclaimer-page/disclaimer.page";
import {HeaderComponent} from "../components/header/header.component";
import {FooterComponent} from "../components/footer/footer.component";
import {HeroComponent} from "../components/hero/hero.component";
import {HeroSearchComponent} from "../components/hero/hero-search/hero-search.component";
import {ExploreTilesComponent} from "../components/explore-tiles/explore-tiles.component";
import {HeroBottomComponent} from "../components/hero/hero-bottom/hero-bottom.component";
import {ExploreButtonComponent} from "../components/buttons/explore-button/explore-button.component";
import {FeatureTilesComponent} from "../components/feature-tiles/feature-tiles.component";
import {DirectoryPage} from "../webpages/directory-page/directory.page";
import {SearchPage} from "../webpages/search-page/search.page";
import {DynamicListPage} from "../webpages/dynamic-list-page/dynamic-list.page";
import {NearByCitiesService} from "../global/geo-location.service";
import {GeoLocationService} from "../global/geo-location.service";

import {MyWebApp} from "../app-layout/app.mylayout";
import {PartnerHeader} from "../global/global-service";
import {GlobalFunctions} from "../global/global-functions";
import {CityViewPage} from "../webpages/city-view-page/city-view.page";

@Component({
    selector: 'my-house',
    templateUrl: './app/app-webpage/app.webpage.html',
    
    directives: [PartnerHomePage, RouterOutlet, ProfilePage, HomePage, ExploreButtonComponent, ComponentPage, HeaderComponent, FooterComponent, HeroComponent, HeroSearchComponent, ExploreTilesComponent, HeroBottomComponent, FeatureTilesComponent, ListPage, ListOfListsPage, AmenitiesListPage, ROUTER_DIRECTIVES, DirectoryPage, SchoolListsPage],
    providers: [PartnerHeader, ROUTER_DIRECTIVES, GeoLocationService, NearByCitiesService, ErrorPage],
})

@RouteConfig([
    {
       path: '/',
       name: 'Home-page',
       component: HomePage,
       useAsDefault: true,
    },
    {
        path: '/index/:address',
        name: 'Profile-page',
        component: ProfilePage,
    },
    {
        path: '/loc',
        name: 'Location-page',
        component: LocationPage,
    },
    {
        path: '/loc/:loc',
        name: 'Location-page',
        component: LocationPage,
    },
    {
        path: '/:viewType/:listname/:state/:city/page/:page',
        name: 'List-page',
        component: ListPage,
    },
    {
        path: '/:viewType/:listname/:state/:city/:priceLowerBound/:priceUpperBound/:type/:bedrooms/:bathrooms/:squareFeet/:lotSize/:limit/:page',
        name: 'List-page-filter',
        component: ListPage,
    },
    {
        path: '/lists/:state/:city',
        name: 'List-of-lists-page',
        component: ListOfListsPage,
    },
    {
        path: '/lists/:state',
        name: 'List-of-lists-page-state',
        component: ListOfListsPage,
    },
    {
        path: '/view-amenities/:listname/:state/:city',
        name: 'Amenities-lists-page',
        component: AmenitiesListPage,
    },
    {
        path: '/view-school/:listname/:state/:city',
        name: 'School-lists-page',
        component: SchoolListsPage,
    },
    {
        path: '/component',
        name: 'Component-page',
        component: ComponentPage,
    },
    {
        path: '/About',
        name: 'Aboutus-page',
        component: AboutUsPage,
    },
    {
        path: '/Contact',
        name: 'Contactus-page',
        component: ContactUsPage,
    },
    {
        path: '/Disclaimer',
        name: 'Disclaimer-page',
        component: DisclaimerPage,
    },
    //National directory page
    {
        path: '/listing_index/:listTitle/page/:pageNumber',
        name: 'Directory-page',
        component: DirectoryPage
    },
    //State directory page
    {
        path: '/listing_index/:state/:listTitle/page/:pageNumber',
        name: 'Directory-page-state',
        component: DirectoryPage
    },
    //City directory page
    {
        path: '/listing_index/:state/:city/:listTitle/page/:pageNumber',
        name: 'Directory-page-city',
        component: DirectoryPage
    },
    //All Cities directory page
    //Currently Disabled: Currently No known way to pull router name to use this route. (This route conflicts with the Directory-page-state route. We can't differentiate in the code between this route and the state route) Query parameter is used instead for now
    //{
    //    path: '/directory/:state/all-cities/:listTitle/page/:pageNumber',
    //    name: 'Directory-page-all-cities',
    //    component: DirectoryPage
    //},
    //Zipcode directory page
    {
        path: '/listing_index/:state/:city/:zipcode/:listTitle/page/:pageNumber',
        name: 'Directory-page-zipcode',
        component: DirectoryPage
    },
    {
        path: '/s/:query',
        name: 'Search-page',
        component: SearchPage
    },
    {
        path: '/wlist/:query',
        name: 'Widget-page',
        component: DynamicListPage
    },
    {
        path: '/cityview/:state/:city',
        name: 'City-view-page',
        component: CityViewPage
    },
    {
        path: '/error',
        name: 'Error-page',
        component: ErrorPage
    }
])

export class MyAppComponent implements OnInit {

    //declare variables to grab potential partner header
    public partnerID: string;
    public partnerData: Object;
    public listTitle: string = 'homes-largest';
    public pageNumber: number = 1;
    public partnerScript:string;
    public cityStateLocation: string;
    public cityLocation: string;
    public stateLocation: string;
    // address: string = "503-C-Avenue-Vinton-IA";
    nearByCities: Object;

    constructor(private _injector: Injector,private _partnerData: PartnerHeader, private _params: RouteParams, private route: Router, private routeData: RouteData, private routerLink: RouterLink, private _globalFunctions: GlobalFunctions, private _geoLocationService: GeoLocationService, private _nearByCitiesService: NearByCitiesService){
      var parentParams = this._injector.get(MyWebApp);
      if(typeof parentParams.partnerID != 'undefined'){
          this.partnerID = parentParams.partnerID;
      }
    }

    getPartnerHeader(){
        this._partnerData.getPartnerData(this.partnerID)
            .subscribe(
                partnerScript => {
                    this.partnerData = partnerScript;
                    this.partnerScript = this.partnerData['results'].header.script;
                }
            );
    }

    //Subscribe to getGeoLocation in geo-location.service.ts. On Success call getNearByCities function.
    getGeoLocation() {
        this._geoLocationService.getGeoLocation()
            .subscribe(
                geoLocationData => {
                  if(typeof this.partnerData != 'undefined' && this.partnerData['results']['location']['realestate']['location']['city'].length != 0){
                    var dataPartner = this.partnerData['results']['location']['realestate'];
                    this.cityLocation = this._globalFunctions.toTitleCase(decodeURI(dataPartner['location']['city'][0].city));
                    this.stateLocation = decodeURI(dataPartner['location']['city'][0].state);
                    this.cityStateLocation = this.cityLocation + '_' + this.stateLocation;
                  }else{
                    this.cityLocation = geoLocationData[0].city;
                    this.stateLocation = geoLocationData[0].state;
                    this.cityStateLocation = this.cityLocation + '_' + this.stateLocation;
                  }
                },
                err => this.defaultCity(),
                () => this.getNearByCities()
            );
    }

    // Subscribe to getNearByCities in geo-location.service.ts
    getNearByCities() {
        this._nearByCitiesService.getNearByCities(this.stateLocation, this.cityLocation)
            .subscribe(
                nearByCities => { this.nearByCities = nearByCities },
                err => console.log(err)
            );
    }

    defaultCity() {
        // Set default city and state if geo location call fails
        this.stateLocation = "KS";
        this.cityLocation = "Wichita";
        this.cityStateLocation = this.cityLocation + '_' + this.stateLocation;
        this.getNearByCities();
    }

    ngOnInit(){
        if (this.partnerID != null){
            this.getPartnerHeader();
        }
        // Call to get current State and City
        this.getGeoLocation();
    }
}
