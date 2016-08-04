import {Component, Input} from '@angular/core';
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
    public imageData: any;
    public articleData: any;
    public trendingLength: number = 2;
    @Input() geoLocation: string;
    @Input() currentArticleId: any;

    constructor(
      private _router:Router,
      private _deepdiveservice:DeepDiveService
      ){}

      private getDeepDiveArticle(numItems, state, currentArticleId) {
        this._deepdiveservice.getDeepDiveBatchService(numItems, 1, state).subscribe(
          data => {
            this.articleData = this._deepdiveservice.transformTrending(data.data, currentArticleId);
            if (this.trendingLength <= 20) {
            this.trendingLength = this.trendingLength + 10;
            }
          }
        )
      }

      ngOnInit(){
        this.getDeepDiveArticle(2 , this.geoLocation, this.currentArticleId);
      }
      private onScroll(event) {
        if (jQuery(document).height() - window.innerHeight - jQuery("footer").height() <= jQuery(window).scrollTop() && this.trendingLength <= 20) {
          jQuery('#loadingArticles').show();
          this.getDeepDiveArticle(this.trendingLength, this.geoLocation, this.currentArticleId);
          jQuery('#loadingArticles').hide();
        }
      }
}
