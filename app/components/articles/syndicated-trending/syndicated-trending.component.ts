import {Component} from '@angular/core';
import {Router,ROUTER_DIRECTIVES, RouteParams} from '@angular/router-deprecated';
import {ShareLinksComponent} from "../shareLinks/shareLinks.component";
import {SanitizeHtml} from "../../../pipes/safe.pipe";
import {ResponsiveWidget} from '../../../components/responsive-widget/responsive-widget.component';
import {DeepDiveService} from '../../../services/deep-dive.service'

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
            // this.articleData.teaser = this.articleData.teaser.replace("\'", "'");
          }
        )
      }
}
