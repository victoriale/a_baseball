import {Component,OnInit,Input} from '@angular/core';
import {RectangleImage} from '../../components/images/rectangle-image';
import {ImageData, RectangleImageData} from '../../components/images/image-data';
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";

export interface StackRowsInput {
  keyword: string;
  title: string;
  publishedDate: string;
  imageConfig: RectangleImageData;
}

@Component({
  selector: 'stack-rows-component',
  templateUrl: './app/components/stack-rows/stack-rows.component.html',
  directives: [RectangleImage, ROUTER_DIRECTIVES],
})

export class StackRowsComponent implements OnInit {
  @Input() stackRowsData: Array<StackRowsInput>;
  ngOnInit() {
    if (typeof this.stackRowsData == 'undefined') {
      var sampleImage = "/app/public/placeholder_XL.png";
      this.stackRowsData = [{
        keyword: "[Keyword]",
        publishedDate: "[Date]",
        title: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempo ipsum dolor sit amet, consectetur adipisicing",
        imageConfig: {
          imageClass: "image-100x75",
          mainImage:{
            imageUrl: sampleImage
          }
        }
      }];//this.dataPoint ends
    }
  }//ngOnInit ends
}
