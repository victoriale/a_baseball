import {Component, Input, OnChanges} from '@angular/core';
import {DomSanitizationService, SafeStyle} from '@angular/platform-browser';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {LoadingComponent} from '../../components/loading/loading.component';
import {CircleImage} from '../../components/images/circle-image';
import {CircleImageData} from '../../components/images/image-data';
import {ScrollableContent} from '../../components/scrollable-content/scrollable-content.component';
import {GlobalFunctions} from '../../global/global-functions';
import {GlobalSettings} from '../../global/global-settings';
import {NaValuePipe} from '../../pipes/na.pipe';

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
  lastUpdatedDate: string;
  description: string;
  topDataPoints: Array<DataItem>
  bottomDataPoints: Array<DataItem>;
}

@Component({
    selector: 'profile-header',
    templateUrl: './app/modules/profile-header/profile-header.module.html',
    directives: [ROUTER_DIRECTIVES, CircleImage, ScrollableContent, LoadingComponent],
    pipes: [NaValuePipe]
})
export class ProfileHeaderModule implements OnChanges {
    @Input() profileHeaderData: ProfileHeaderData;

    public contentTitle: string = "Quick info";
    public displayDate: string;
    public profileTitle: string;
    public backgroundImage: SafeStyle;

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
        imageUrl: GlobalSettings.getSiteLogoUrl(),
        placeholderImageUrl: GlobalSettings.getSiteLogoUrl()
      }
    };

    constructor(private _sanitizer: DomSanitizationService) {
    }

    ngOnChanges() {
      var data = this.profileHeaderData;
      if ( data ) {
        if ( !data.backgroundImageUrl ) {
          data.backgroundImageUrl = "/app/public/no-image.png";
        }
        if ( !data.profileImageUrl ) {
          data.profileImageUrl = "/app/public/no-image.png";
        }
        this.imageConfig.mainImage.imageUrl = data.profileImageUrl;
        this.backgroundImage = this._sanitizer.bypassSecurityTrustStyle("url(" + data.backgroundImageUrl + ")");
        this.contentTitle = "Quick info about " + data.profileName;
        this.profileTitle = data.profileTitleFirstPart + "<span class='text-heavy'> " + data.profileTitleLastPart + "</span>";
        this.displayDate = GlobalFunctions.formatUpdatedDate(data.lastUpdatedDate);

        data.description = "<div class=\"ph-content-desc-border\"></div>" + data.description;
      }
    }
}
