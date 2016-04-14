/**
 * Created by Victoria on 2/25/2016.
 */
import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {Image180} from '../../components/images/image-180.component';
import {CarouselButton} from '../../components/buttons/carousel/carousel.button';
import {ROUTER_DIRECTIVES} from 'angular2/router';
@Component({
    selector: 'feature-component',
    templateUrl: './app/components/feature-list/feature-list.component.html',
    
    directives: [ROUTER_DIRECTIVES, Image180, CarouselButton],
    providers: [],
    inputs: ['list_data'],
    outputs: ['scrollRight', 'scrollLeft']
})

export class FeatureComponent implements OnInit{
    list_data: Object;
    counter:number = 1;
    public scrollRight: EventEmitter<boolean> = new EventEmitter();
    public scrollLeft: EventEmitter<boolean> = new EventEmitter();
    settings: any;
    left(){
        this.scrollLeft.next(true);
    }
    right(){
        this.scrollRight.next(true);
    }

    ngOnInit(){
        this.settings = {
          main_hasSubImg : true,
          hasHover : true,
          counterIf: true,
          hasBottomImg: false
        };
        if(typeof this.list_data != 'undefined'){
          this.counter = this.list_data['rank'];
        }
        if(typeof this.list_data === 'undefined'){
            this.list_data = {
                header: 'Trending Real Estate',
                title: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do.',
                hding1: '[Listing Address]',
                hding2: '[Listing Name] [Zip Code] - [Neighborhood]',
                detail1: 'Bedrooms: 3 | Bathrooms: 2',
                detail2: 'Asking Price: ',
                detail3: '$[###,###]'
            }
        }// end of list_data undefined
    }//end ngOnInit()
}
