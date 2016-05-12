/**
 * Created by Victoria on 2/23/2016.
 */
import {Component, Input, OnInit}  from "angular2/core";

@Component({
    selector: 'headline-component',
    templateUrl: './app/components/headline/headline.component.html',
    inputs: ['data']
})

export class HeadlineComponent implements OnInit{
  data:{
    title:string,
    icon:string
  }
  ngOnInit(){
    if(typeof this.data == 'undefined'){
      this.data.title = 'HEADLINE';
      this.data.icon = 'fa fa-map-marker';
    }
  }
}
