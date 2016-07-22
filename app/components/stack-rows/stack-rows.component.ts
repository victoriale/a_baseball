import {Component,OnInit,Input} from '@angular/core';
import {RectangleImage} from '../../components/images/rectangle-image';
import {ImageData, RectangleImageData} from '../../components/images/image-data';
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";

export interface StackRowsInput {
  url: string;
  keyword: string;
  description: string;
  publishedDate: string;
  imageConfig: RectangleImageData;
}

@Component({
  selector: 'stack-rows-component',
  templateUrl: './app/components/stack-rows/stack-rows.component.html',
  directives: [RectangleImage, ROUTER_DIRECTIVES],
})

export class StackRowsComponent implements OnInit {
  @Input() stackRow: Array<StackRowsInput>;
  ngOnInit() {
    if (typeof this.stackRow == 'undefined') {
      var sampleImage = "/app/public/placeholder_XL.png";
      this.stackRow = [{
          url: "/",
          keyword: "[Keyword]",
          publishedDate: "[Date]",
          description: "Atlanta Braves interim manager Brian Snitker said he didn't worry about his young pitchers starting for the first time at Great American Ball Park, known for its homer-friendly dimensions",
          imageConfig: {
            imageClass: "image-100x75",
            mainImage:{
              imageUrl: "/app/public/placeholder_XL.png"
            }
          }
        }]
    }
  }//ngOnInit ends
}
