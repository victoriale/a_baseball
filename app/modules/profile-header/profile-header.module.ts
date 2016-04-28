import {Component, Input} from 'angular2/core';
import {Router} from 'angular2/router';

import {ProfileHeaderData, ProfileHeaderService} from '../../services/profile-header.service';

import {CircleImage} from '../../components/images/circle-image';
import {CircleImageData} from '../../components/images/image-data';
import {ScrollableContent} from '../../components/scrollable-content/scrollable-content.component';
import {GlobalFunctions} from '../../global/global-functions';

declare var moment: any;

@Component({
    selector: 'profile-header',
    templateUrl: './app/modules/profile-header/profile-header.module.html',    
    directives: [CircleImage, ScrollableContent],
    providers: [ProfileHeaderService]
})
export class ProfileHeaderModule {
    @Input() profileHeaderData: ProfileHeaderData;
    
    public contentTitle: string = "Quick info";
    public displayDate: string;
    
    public imageConfig: CircleImageData = {
      imageClass: "image-180",
      mainImage: {
        imageClass: "border-large",
        placeholderImageUrl: "/app/public/profile_placeholder_large.png"
      }
    }; 
    
    public logoConfig: CircleImageData = {
      imageClass: "image-40",
      mainImage: {
        imageClass: "",
        imageUrl: "/app/public/mainLogo.png",
        placeholderImageUrl: "/app/public/mainLogo.png"
      }
    }; 

    constructor(private _router: Router, private _globalFunctions: GlobalFunctions, private _service: ProfileHeaderService) {
        this._service.getProfileHeaderDefaultData().subscribe(
          data => this.setupData(data),
          err => { console.log("Error getting Profile Header data"); }
        );
    }
    
    setupData(data: ProfileHeaderData) {
      if ( data !== undefined && data !== null ) {        
        this.profileHeaderData = data;
        this.imageConfig.mainImage.imageUrl = data.profileImage;
        this.contentTitle = "Quick info about " + data.profileName;
        
        var lastUpdated = moment(data.lastUpdatedDate);
        this.displayDate = lastUpdated.format('dddd, MMMM D, YYYY');
      }
      else {
        console.log("Error setting up Profile Header data");
      }
    }
}
