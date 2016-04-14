//Created by Victoria on 2/19/2016.
import {Component, Output, EventEmitter} from 'angular2/core';

@Component({
    selector: 'carousel-button',
    templateUrl: './app/components/buttons/carousel/carousel.button.html',
    
    outputs: ['scrollRight', 'scrollLeft']
})
export class CarouselButton{
    public scrollRight: EventEmitter<boolean> = new EventEmitter();
    public scrollLeft: EventEmitter<boolean> = new EventEmitter();

    left(){
        this.scrollLeft.next(true);
    }
    right(){
        this.scrollRight.next(true);
    }
}
