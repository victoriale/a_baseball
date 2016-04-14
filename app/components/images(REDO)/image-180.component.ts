/**
 * Created by Victoria on 3/1/2016.
 */
import {Component, Input, OnChanges, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'image-180',
    templateUrl: './app/components/images/image.html',
    directives: [ROUTER_DIRECTIVES],
    inputs: ['hasSubImg', 'imageURL', 'imageURL2', 'counterIf', 'counter', 'hasHover', 'hasBottomImg', 'imageClass', 'originalUrl']
})
export class Image180 implements OnInit {
    imageURL: string = '/app/public/placeholder-location.jpg';
    imageURL2: string = '/app/public/placeholder-location.jpg';
    size: string = "180";
    counterIf: boolean = false;
    counter: number = 1;
    hasHover:boolean = false;
    hasBottomImg: boolean = false;
    imageClass:string = '';
    originalUrl:string;
    useRouterLink:boolean = false;
    @Input() viewLocationText:string = "Profile";
    @Input() urlRouteArray: string[];

    ngOnChanges(event){
        //If an image is not undefined (Input WAS sent to component) and value passed in is null, set image to placeholder
        if(typeof event.imageURL !== 'undefined' && event.imageURL.currentValue === null){
            this.imageURL = '/app/public/placeholder-location.jpg';
        }
        if(typeof event.imageURL2 !== 'undefined' && event.imageURL2.currentValue === null){
            this.imageURL2 = '/app/public/placeholder-location.jpg';
        }
        if(typeof event.counter !== 'undefined' && event.counter.currentValue === null){
            this.counterIf = false;
        }
        if(typeof event.hasHover !== 'undefined' && event.hasHover.currentValue === null){
            this.hasHover = false;
        }
    }
    
    ngOnInit() {
        //If urlRouteArray is an array with data, then use the RouterLink <a>
        if(typeof this.urlRouteArray !== 'undefined' && this.urlRouteArray !== null && this.urlRouteArray.length > 0 ){
            this.useRouterLink = true;
        }
        
        //If viewLocationText is null or empty, then initialize to "Profile"
        if(typeof this.viewLocationText === 'undefined' || this.viewLocationText === null || this.viewLocationText.length === 0 ){
            this.viewLocationText = "Profile";
        }
    }
}
