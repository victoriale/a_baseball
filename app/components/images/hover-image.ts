import {Component, Input, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";
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
}
