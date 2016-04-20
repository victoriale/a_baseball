import {Component, Input, OnInit} from 'angular2/core';
import {HoverImage} from '../../components/images/hover-image';
import {CircleImageData} from '../../components/images/image-data';

@Component({
    selector: 'circle-image',
    templateUrl: './app/components/images/circle-image.html',
    //styleUrls: ['./app/components/images/image.less'],
    directives: [HoverImage]
})
export class CircleImage implements OnInit {
    @Input() data: CircleImageData;
    // @Input() sizeInPixels: number;
      
    // sizeClass: string;
    // lowerRightClass: string;
    // upperLeftClass: string;
    
    ngOnInit() {
      if ( this.data.subImages === undefined || this.data.subImages === null ) {
        this.data.subImages = [];
      }
      // this.sizeClass = "image-" + this.sizeInPixels;
      // switch ( this.sizeInPixels ) {
      //   default:
      //   case 150:        
      //     this.lowerRightClass = "sub-image-50"; 
      //     this.upperLeftClass = "sub-rank-38"; 
      //     break;
          
      //   case 180:        
      //     this.lowerRightClass = "sub-image-50"; 
      //     this.upperLeftClass = "sub-rank-48"; 
      //     break;        
      // } 
    }
}
