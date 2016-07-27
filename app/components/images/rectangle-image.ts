import {Component, Input, OnInit} from '@angular/core';
import {HoverImage} from '../../components/images/hover-image';
import {RectangleImageData} from '../../components/images/image-data';

@Component({
    selector: 'rectangle-image',
    templateUrl: './app/components/images/rectangle-image.html',
    directives: [HoverImage]
})
export class RectangleImage implements OnInit {
    @Input() data: RectangleImageData;

    ngOnInit() {}
}
