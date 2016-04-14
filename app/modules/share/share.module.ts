/**
 * Created by Victoria on 2/26/2016.
 */
import {Component, OnInit, Input} from 'angular2/core';
import {Router, RouteParams} from 'angular2/router';
import {moduleHeader} from "../../components/module-header/module-header";
import {Image180} from '../../components/images/image-180.component';
import {GlobalFunctions} from '../../global/global-functions';
import {ListingProfileService} from '../../global/listing-profile.service';
import {LocationProfileService} from '../../global/location-profile.service';
import {PropertyListingInterface} from '../../global/global-interface';

@Component({
    selector: 'share-module',
    templateUrl: './app/modules/share/share.module.html',
    
    directives: [moduleHeader, Image180],
    providers: [ListingProfileService, LocationProfileService],
    inputs:['locData']
})

export class ShareModule implements OnInit{
    public main_hasSubImg: boolean;
    public profileType: string;
    public mainImageURL: string;

    locData: any;
    moduleTitle: string;
    currentUrl: any;
    image_url = '/app/public/img_bckgnd.png';
    share = 'Share This Profile Below:'; //default if profiletype is undefined
    icon1 = 'fa fa-facebook';
    icon2 = 'fa fa-twitter';
    icon3 = 'fa fa-google-plus';
    icon4 = 'fa fa-pinterest';
    shareOn1 = 'Facebook';
    shareOn2 = 'Twitter';
    shareOn3 = 'Google +';
    shareOn4 = 'Pinterest';

    @Input() propertyListingData: PropertyListingInterface;
    constructor(private router: Router, private _params: RouteParams, private globalFunctions: GlobalFunctions, private _listingService: ListingProfileService, private _locationService: LocationProfileService) {
      //Determine what page the profile header module is on
      this.profileType = this.router.hostComponent.name;
    }
    getData() {
          if(this.profileType == 'LocationPage') {
            var paramLocation: string = this._params.get('loc');
            var paramCity: string = this.globalFunctions.toTitleCase(this.locData.city);
            paramCity = paramCity.replace(/%20/g, " ");
            var paramState: string = this.locData.state;
            this.share = 'Share This Location Below:';
            this.mainImageURL = this.locData.locationImage;
          }else if(this.profileType === 'ProfilePage') {
            this.share = 'Share This Listing Below:';
            this.mainImageURL = this.locData.listingImage;
          }
    }
    ngOnInit(){
        this.getData();
        this.moduleTitle = 'Share This Profile With Your Friends';
        this.main_hasSubImg = false;
        this.currentUrl = window.location.href;
    }
}
