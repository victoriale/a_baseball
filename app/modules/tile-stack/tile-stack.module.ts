import {Component,OnInit,Input} from '@angular/core';

@Component({
  selector: 'tile-stack-module',
  templateUrl: './app/modules/tile-stack/tile-stack.module.html',
  directives: [],
  providers: []

})

export class TileStackModule{
  @Input() tilestackData: any;
  constructor(){

  }
  ngOnInit() {

  }


}
