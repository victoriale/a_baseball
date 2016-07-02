/**
 * Created by Victoria on 2/25/2016.
 */
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {CarouselButton} from '../../components/buttons/carousel/carousel.button';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
@Component({
    selector: 'feature-component',
    templateUrl: './app/components/feature-list/feature-list.component.html',
    
    directives: [ROUTER_DIRECTIVES, CarouselButton],
    providers: [],
    inputs: ['list_data'],
    outputs: ['scrollRight', 'scrollLeft']
})

export class FeatureComponent implements OnInit{
    list_data: Object;
    counter:number = 1;
    public scrollRight = new EventEmitter();
    public scrollLeft = new EventEmitter();
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
