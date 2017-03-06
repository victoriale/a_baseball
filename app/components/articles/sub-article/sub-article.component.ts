import {Component, Input, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";
declare var jQuery:any;

@Component({
    selector: 'article-sub-component',
    templateUrl: './app/components/articles/sub-article/sub-article.component.html',
    styleUrls: ['./app/global/stylesheets/master.css'],
    directives: [ROUTER_DIRECTIVES]
})

export class ArticleSubComponent implements OnInit{
    @Input() league:any;
    @Input() leagueData:any
    @Input() leftColumnData:any;
    @Input() teamID:any;
    @Input() imgResize: number;
    ngOnInit() {
      if(this.leagueData){
        for(var i = 0; i <= 10; i++){
          this.leagueData[i]['images'] += "&width=" + (this.imgResize ? this.imgResize : "100&quality=90");
          this.leagueData[i]['images'] += this.imgResize && Number(this.imgResize) < 100 ? "&quality=90" : '';
        }
      }
    }
}
