import {Component,OnInit,Input} from '@angular/core';
import {DeepDiveService} from '../../services/deep-dive.service';


@Component({
  selector: 'stack-rows-component',
  templateUrl: './app/components/stack-rows/stack-rows.component.html',
  directives: [],
  providers: [DeepDiveService]

})

export class StackRowsComponent{
  @Input() stackrowsData: any;
  constructor(){

  }
  ngOnInit() {

  }


}
