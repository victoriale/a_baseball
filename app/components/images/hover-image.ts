import {Component, Input, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {ImageData} from '../../components/images/image-data';

@Component({
    selector: 'hover-image',
    templateUrl: './app/components/images/hover-image.html',
    directives: [ROUTER_DIRECTIVES]
})
export class HoverImage {
    @Input() imageData: any;
    @Input() textOnly: boolean;
    
    public noImageUrl: string = "/app/public/no-image.png";

    ngOnChanges(){
        //console.log("imageD",this.imageData);
    }
}
