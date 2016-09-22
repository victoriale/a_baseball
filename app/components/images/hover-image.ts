import {Component, Input, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {ImageData} from '../../components/images/image-data';
import {DomSanitizationService} from '@angular/platform-browser';

@Component({
    selector: 'hover-image',
    templateUrl: './app/components/images/hover-image.html',
    directives: [ROUTER_DIRECTIVES]
})
export class HoverImage {
    @Input() imageData: any;

    @Input() textOnly: boolean;

    imageUrl;

    public noImageUrl: string = "/app/public/no-image.png";

    constructor(private _sanitizer: DomSanitizationService) {}

    ngOnChanges() {
        if ( this.imageData && this.imageData.imageUrl ) {
            this.imageUrl = this._sanitizer.bypassSecurityTrustUrl(this.imageData.imageUrl);
        }
    }
}
