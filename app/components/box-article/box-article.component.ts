import {Component,OnInit,Input} from '@angular/core';
import {RectangleImage} from '../../components/images/rectangle-image';
import {ImageData, RectangleImageData} from '../../components/images/image-data';
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";

export interface BoxArticleData {
  keyword: string;
  description: string;
  imageConfig: RectangleImageData;
}

@Component({
  selector: 'box-article-component',
  templateUrl: './app/components/box-article/box-article.component.html',
  directives: [RectangleImage, ROUTER_DIRECTIVES],
})

export class BoxArticleComponent implements OnInit {
  @Input() boxArticleData: BoxArticleData;
  ngOnInit() {
    if (typeof this.boxArticleData == 'undefined') {
      var sampleImage = "/app/public/placeholder_XL.png";
      this.boxArticleData = {
        keyword: "[Keyword] [Date]",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempo ipsum dolor sit amet, consectetur adipisicing",
        imageConfig: {
          imageClass: "image-288x180",
          mainImage:{
            imageUrl: sampleImage
          }
        }
      };//this.dataPoint ends
    }
  }//ngOnInit ends
}
