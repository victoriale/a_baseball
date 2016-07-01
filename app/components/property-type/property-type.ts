/**
 * Created by Larry on 2/23/2016.
 */
import {Component, OnInit} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';

@Component({
    selector: 'property-type',
    templateUrl: './app/components/property-type/property-type.html',
    
    directives: [],
    providers: [],
})

export class propertyType implements OnInit{
    constructor(
        private _routeParams: RouteParams
    ){ }

    ngOnInit() {
      
    }
}
