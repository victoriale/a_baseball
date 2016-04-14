/**
 * Created by Christopher Lynch on 2/23/2016.
 */

import {Component, OnInit} from 'angular2/core';

@Component({
    selector: 'share-component',
    templateUrl: './app/components/facebook-share/facebook-share.component.html',
    
    directives: [],
})


export class ShareComponent implements OnInit{
    url: string;
    description: string;
    image: string;

    getFacebookData(){
        this.description = "Check out my home on JoyfulHome.com!";
        this.url = encodeURIComponent("http://www.joyfulhome.com" + window.location.pathname);
        this.image = "http://images.joyfulhome.com/JoyfulHome_Logo125.png";
    }

    ngOnInit(){
        this.getFacebookData();
    }
}