import {Component,OnInit,Input} from '@angular/core';
import {RectangleImageData} from '../../components/images/image-data';
import {RectangleImage} from '../../components/images/rectangle-image';
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";

export interface StackRowsInput {
  keyword: string;
  title: string;
  publishedDate: string;
  imageConfig: RectangleImageData;
}
export interface StackTopInput{
  date: string;
  headline: string;
  provider1: string;
  provider2: string;
  description: string;
  imageConfig: RectangleImageData;
}

@Component({
  selector: 'article-stack-module',
  templateUrl: './app/modules/article-stack/article-stack.module.html',
  directives: [RectangleImage,ROUTER_DIRECTIVES]
})

export class ArticleStackModule implements OnInit {
  @Input() stackTop: StackTopInput;
  @Input() stackRow: Array<StackRowsInput>;

  ngOnInit() {
      if (typeof this.stackTop == 'undefined') {
        this.stackTop = {
            date: "[Keyword]",
            headline: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempo",
            provider1: "By [Columnist Name]",
            provider2: "Published By: [Domain.com]",
            description: "Atlanta Braves interim manager Brian Snitker said he didn't worry about his young pitchers starting for the first time at Great American Ball Park, known for its homer-friendly dimensions",
            imageConfig: {
              imageClass: "image-610x420",
              mainImage:{
                imageUrl: "/app/public/placeholder_XL.png"
              }
            }
        }
      if (typeof this.stackRow == 'undefined') {
        this.stackRow = [{
            keyword: "[Keyword]",
            publishedDate: "[Date]",
            title: "Atlanta Braves interim manager Brian Snitker said he didn't worry about his young pitchers starting for the first time at Great American Ball Park, known for its homer-friendly dimensions",
            imageConfig: {
              imageClass: "image-100x75",
              mainImage:{
                imageUrl: "/app/public/placeholder_XL.png"
              }
            }
          }]
        }
      }//this.stackModule ends
    }
  }
