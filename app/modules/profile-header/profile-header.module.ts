import {Component, Input, OnChanges} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {CircleImage} from '../../components/images/circle-image';
import {CircleImageData} from '../../components/images/image-data';
import {ScrollableContent} from '../../components/scrollable-content/scrollable-content.component';
import {GlobalFunctions} from '../../global/global-functions';

export interface DataItem {
  label: string;
  labelCont?: string;
  value: string;
  routerLink?: Array<any>;
}

export interface ProfileHeaderData {
  profileName: string;    
  profileImageUrl: string;    
  backgroundImageUrl: string;    
  profileTitleFirstPart: string;    
  profileTitleLastPart: string;    
  lastUpdatedDate: Date;
  description: string; 
  topDataPoints: Array<DataItem>
  bottomDataPoints: Array<DataItem>;
}

@Component({
    selector: 'profile-header',
    templateUrl: './app/modules/profile-header/profile-header.module.html',    
    directives: [ROUTER_DIRECTIVES, CircleImage, ScrollableContent]
})
export class ProfileHeaderModule implements OnChanges {
    @Input() profileHeaderData: ProfileHeaderData;
    
    public contentTitle: string = "Quick info";
    public displayDate: string;
    public profileTitle: string;
    public backgroundImage: string;
    
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

    constructor(private _globalFunctions: GlobalFunctions) {}
    
    ngOnChanges() {
      var data = this.profileHeaderData;
      if ( data !== undefined && data !== null ) {
        console.log("setting up profile header data");
        if ( data.backgroundImageUrl === null || data.backgroundImageUrl === undefined ) {
          data.backgroundImageUrl = "/app/public/image_placeholder.png";
        }
        this.imageConfig.mainImage.imageUrl = data.profileImageUrl;
        this.backgroundImage =  "url(" + data.backgroundImageUrl + ") no-repeat center rgba(0,0,0,.65)";
        this.contentTitle = "Quick info about " + data.profileName;
        this.profileTitle = data.profileTitleFirstPart + "<span class='text-heavy'> " + data.profileTitleLastPart + "</span>";
        this.displayDate = this._globalFunctions.formatUpdatedDate(data.lastUpdatedDate);
      }
      else {
        console.log("Error setting up Profile Header data");
      }
    }
}
