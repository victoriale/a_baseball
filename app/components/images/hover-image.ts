import {Component, Input, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {ImageData} from '../../components/images/image-data';

@Component({
    selector: 'hover-image',
    templateUrl: './app/components/images/hover-image.html',
    directives: [ROUTER_DIRECTIVES]
})
export class HoverImage implements OnInit {  
    placeholderJavascript: string;
    
    //Inputs
    @Input() imageData: any;
    
    ngOnInit() {
      if ( this.imageData.placeholderImageUrl === undefined || this.imageData.placeholderImageUrl === null ) {
        this.imageData.placeholderImageUrl = "/app/public/profile_placeholder_large.png";
      }
      this.placeholderJavascript = "this.src='" + this.imageData.placeholderImageUrl + "';";
    }
}
