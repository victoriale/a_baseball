/**
 * Created by Victoria on 3/10/2016.
 */
import {Component, Input, OnInit} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'image-150',
    templateUrl: './app/components/images/image.html',
    directives: [ROUTER_DIRECTIVES],    
    inputs: ['hasSubImg', 'imageURL', 'hasHoverNoSubImg', 'originalUrl', 'counterIf', 'counter']
})
export class Image150 implements OnInit {
    imageURL = '/app/public/placeholder-location.png';
    size = "150";
    counterIf: boolean = false;
    counter: number = 1;
    useRouterLink:boolean = false;
    @Input() viewLocationText:string = "Profile";
    @Input() urlRouteArray: [];    
    
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
