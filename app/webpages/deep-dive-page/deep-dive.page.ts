import {Component, OnInit, Input} from '@angular/core';
import {TileStackModule} from '../../modules/tile-stack/tile-stack.module';


@Component({
    selector: 'deep-dive-page',
    templateUrl: './app/webpages/deep-dive-page/deep-dive.page.html',
    directives: [TileStackModule],
    providers: [],
})

export class DeepDivePage implements OnInit {
    constructor() {

    }

    ngOnInit(){

    }
}
