import {Component, OnInit} from 'angular2/core';
import {CircleButton} from "../buttons/circle/circle.button";
import {CircleImage} from '../../components/images/circle-image';
import {ImageData,CircleImageData} from '../../components/images/image-data';
export interface TestImage {
  imageData: CircleImageData;
  description: string;
}

@Component({
    selector: 'player-detail-row-component',
    templateUrl: './app/components/player-detail-row/player-detail-row.component.html',
    directives: [CircleButton, CircleImage],
    inputs: [],
})

export class PlayerDetailRowComponent implements OnInit{
  public tableRowImg: Array<TestImage>;
  constructor() {
    this.getData();
  }
  getData(){
    var sampleImage = "./app/public/placeholder-location.jpg";
    this.tableRowImg =[
      {
        description: "",
        imageData: {
          imageClass: "image-48",
          mainImage: {
            imageUrl: sampleImage,
            hoverText: "Sample",
            imageClass: "border-1"
          }
        }
      }];

  }
  ngOnInit(){}
}
