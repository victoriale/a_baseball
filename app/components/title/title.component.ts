import {Component, Input, OnChanges} from '@angular/core';
import {CircleImage} from '../../components/images/circle-image';
import {ImageData, CircleImageData} from '../../components/images/image-data';
import {GlobalSettings} from '../../global/global-settings';
import {SeoService} from '../../seo.service';
import {RouteParams, Router} from '@angular/router-deprecated';

export interface TitleInputData {
    imageURL  : string;
    imageRoute?: Array<any>;
    text1     : string;
    text2     : string;
    text3     : string;
    text4?     : string;
    icon      : string;
}

@Component({
    selector: 'title-component',
    templateUrl: './app/components/title/title.component.html',
    directives: [CircleImage]
})
export class TitleComponent implements OnChanges {
    @Input() titleData: TitleInputData;

    public titleImage: CircleImageData;

    constructor(private _seoService:SeoService, private _params:RouteParams, private _router:Router){

    }
    ngOnChanges() {
        if(!this.titleData){
            this.titleData =
            {
                imageURL : GlobalSettings.getSiteLogoUrl(),
                imageRoute: null,
                text1: "lorem ipsum delor",
                text2: "ipsum delor lorem",
                text3: "lorem ipsum delor",
                text4: "lorem ipsum delor",
                icon: 'fa fa-map-marker'
            };
        }else{
          //create meta description that is below 160 characters otherwise will be truncated
          let text3 = this.titleData.text3 != null ? this.titleData.text3: '';
          let text4 = this.titleData.text4 != null ? this.titleData.text4: '';
          let metaDesc = "This page's purpose is to show " + GlobalSettings.getPageTitle(text3 + '. ' + text4) + 'with the most up to date information.';
          let link = window.location.href;
          this._seoService.setCanonicalLink(this._params.params, this._router);
          this._seoService.setOgTitle(metaDesc);
          this._seoService.setOgDesc("Know more about "+metaDesc + " in baseball");
          this._seoService.setOgType('image');
          this._seoService.setOgUrl(link);
          this._seoService.setOgImage(this.titleData.imageURL);
          this._seoService.setTitle(this.titleData.imageRoute[0].replace('-',' '));
          this._seoService.setMetaDescription(metaDesc);
          this._seoService.setMetaRobots('INDEX, FOLLOW');
        }

        var hoverText = this.titleData.imageRoute ? "<p>View</p><p>Profile</p>" : "";
        this.titleImage = {
            imageClass: "page-title-titleImage",
            mainImage: {
                imageUrl: ( this.titleData.imageURL ? this.titleData.imageURL : GlobalSettings.getSiteLogoUrl() ),
                urlRouteArray: this.titleData.imageRoute,
                hoverText: hoverText,
                imageClass: "border-2"
            }
        };

        // if ( this.imageData ) {
        //     this.titleImage.mainImage = this.imageData;
        // }
    }

}
