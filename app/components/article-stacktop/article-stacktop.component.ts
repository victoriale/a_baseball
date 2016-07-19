import {Component,OnInit} from '@angular/core';
import {RectangleImage} from '../../components/images/rectangle-image';
import {ImageData, RectangleImageData} from '../../components/images/image-data';
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";

export interface StackTopInput{
  date: string;
  headline: string;
  provider1: string;
  provider2: string;
  description: string;
  imageConfig: RectangleImageData;
}

@Component({
  selector: 'article-stacktop-component',
  templateUrl: './app/components/article-stacktop/article-stacktop.component.html',
  directives: [RectangleImage, ROUTER_DIRECTIVES],
})

export class ArticleStacktopComponent{
  public dataPoint: StackTopInput;

  constructor(){

  }
  ngOnInit() {
    if (typeof this.dataPoint == 'undefined') {
      var sampleImage = "/app/public/placeholder_XL.png";
      this.dataPoint = {
        date: "[Keyword]",
        headline: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempo",
        provider1: "By [Columnist Name]",
        provider2: "Published By: [Domain.com]",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        imageConfig: {
          imageClass: "image-610x420",
          mainImage:{
            imageUrl: sampleImage,
            urlRouteArray: null,
            hoverText: "",
          }
        }
      }
    }
  }//ngOnInit ends
}
