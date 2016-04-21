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
    @Input() placeholderImageUrl: string;
    @Input() imageData: any;
    
    ngOnInit() {
      if ( this.placeholderImageUrl === undefined || this.placeholderImageUrl === null ) {
        this.placeholderImageUrl = "/app/public/placeholder-location.png";
      }
      this.placeholderJavascript = "this.src='" + this.placeholderImageUrl + "';";
    }
}
