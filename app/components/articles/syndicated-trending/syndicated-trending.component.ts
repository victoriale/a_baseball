import {Component} from '@angular/core';
import {Router,ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {ShareLinksComponent} from "../shareLinks/shareLinks.component";
import {SanitizeHtml} from "../../../pipes/safe.pipe";
import {ResponsiveWidget} from '../../../components/responsive-widget/responsive-widget.component';
import {DeepDiveService} from '../../../services/deep-dive.service';
import {GeoLocation} from "../../../global/global-service";


declare var moment;
declare var jQuery: any;

@Component({
    selector: 'syndicated-trending-component',
    templateUrl: './app/components/articles/syndicated-trending/syndicated-trending.component.html',
    directives: [ShareLinksComponent, ROUTER_DIRECTIVES, ResponsiveWidget],
    inputs: ['trendingData', 'trendingImages'],
    pipes: [SanitizeHtml],
    providers: [DeepDiveService, GeoLocation]
})

export class SyndicatedTrendingComponent {
    trending:boolean = true;
    public widgetPlace: string = "widgetForPage";

    public articleData: any;
    public trendingLength: number = 2;
    private geoLocation: string;

    constructor(
      private _router:Router,
      private _deepdiveservice:DeepDiveService,
      private _geoLocation:GeoLocation
      ){
        this._geoLocation.getGeoLocation()
            .subscribe(
                geoLocationData => {
                  this.geoLocation = geoLocationData[0].state;
                  this.geoLocation = this.geoLocation.toLowerCase();
                  this.getDeepDiveArticle(2 , this.geoLocation);
                }
            );
      }
      private getDeepDiveArticle(numItems, state) {
        this._deepdiveservice.getDeepDiveBatchService(numItems, 1, state).subscribe(
          data => {
            this.articleData = data.data;
            if (this.trendingLength < 20) {
            this.trendingLength = this.trendingLength + 10;
            }
          }
        )
      }

      //Subscribe to getGeoLocation in geo-location.service.ts. On Success call getNearByCities function.
      getGeoLocation() {


      }

      private formatDate(date) {
        return moment(date, "YYYY-MM-Do, h:mm:ss").format("MMMM Do, YYYY h:mm:ss A");
      }
      private onScroll(event) {
        if (jQuery(document).height() - window.innerHeight - jQuery("footer").height() <= jQuery(window).scrollTop()) {
          jQuery('#loadingArticles').show();
          this.getDeepDiveArticle(this.trendingLength, this.geoLocation);
          jQuery('#loadingArticles').hide();
        }
      }
}
