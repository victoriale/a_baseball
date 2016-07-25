import {Component} from '@angular/core';
import {Router,ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {ShareLinksComponent} from "../shareLinks/shareLinks.component";
import {SanitizeHtml} from "../../../pipes/safe.pipe";
import {ResponsiveWidget} from '../../../components/responsive-widget/responsive-widget.component';
import {DeepDiveService} from '../../../services/deep-dive.service';


declare var moment;
declare var jQuery: any;

@Component({
    selector: 'syndicated-trending-component',
    templateUrl: './app/components/articles/syndicated-trending/syndicated-trending.component.html',
    directives: [ShareLinksComponent, ROUTER_DIRECTIVES, ResponsiveWidget],
    inputs: ['trendingData', 'trendingImages'],
    pipes: [SanitizeHtml],
    providers: [DeepDiveService]
})

export class SyndicatedTrendingComponent {
    trending:boolean = true;
    public widgetPlace: string = "widgetForPage";

    public articleData: any;
    public trendingLength: number = 2;
    constructor(
      private _router:Router,
      private _deepdiveservice:DeepDiveService
      ){
        this.getDeepDiveArticle(2);
      }
      private getDeepDiveArticle(numItems) {
        this._deepdiveservice.getDeepDiveBatchService(numItems).subscribe(
          data => {
            this.articleData = data.data;
            if (this.trendingLength < 20) {
            this.trendingLength = this.trendingLength + 10;
            }
          }
        )
      }
      private formatDate(date) {
        return moment.unix(date/1000).format("MMMM Do, YYYY h:mm A") + " EST";
      }
      private onScroll(event) {
        if (jQuery(document).height() - window.innerHeight - jQuery("footer").height() <= jQuery(window).scrollTop()) {
          jQuery('#loadingArticles').show();
          this.getDeepDiveArticle(this.trendingLength);
          jQuery('#loadingArticles').hide();
        }
      }
}
