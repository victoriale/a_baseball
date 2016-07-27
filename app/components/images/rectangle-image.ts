import {Component, Input, OnInit} from '@angular/core';
import {RectangleImageData} from '../../components/images/image-data';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

@Component({
    selector: 'rectangle-image',
    templateUrl: './app/components/images/rectangle-image.html',
    directives: [ROUTER_DIRECTIVES]
})
export class RectangleImage implements OnInit {
    @Input() data: RectangleImageData;

    ngOnInit() {}
}
