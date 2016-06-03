import {Component, Input} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';

export interface TileData {
  buttonText:string;
  routerInfo: Array<Object>;
  faIcon: string;
  title: string;
  description: string;
}

@Component({
    selector: 'flip-tiles',
    templateUrl: './app/components/flip-tiles/flip-tiles.component.html',
    directives: [ROUTER_DIRECTIVES]
})

export class FlipTilesComponent {
    @Input() tileData: Array<TileData>;
    
    constructor(private _router: Router) {}
}
