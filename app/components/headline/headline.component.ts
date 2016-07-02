/**
 * Created by Victoria on 2/23/2016.
 */
import {Component, Input, OnInit}  from "@angular/core";

@Component({
    selector: 'headline-component',
    templateUrl: './app/components/headline/headline.component.html'
})

export class HeadlineComponent implements OnInit {
  @Input() title: string;
  
  @Input() icon: string;
  
  ngOnInit(){
    if ( !this.title ) {
      this.title = "HEADLINE";      
    }
    
    if ( !this.icon ) {
      this.icon = "fa fa-map-marker";
    }
  }
}
