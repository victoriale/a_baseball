import {Component} from '@angular/core';
import {Input} from "@angular/core";

@Component({
    selector: 'backtab-component',
    templateUrl: './app/components/backtab/backtab.component.html',
})

export class BackTabComponent{
    @Input() labelInput : string;
    label : string;

    goBack() {
      if(history.length <= 2){
        window.location.href = '/';
      } else {
        window.history.back();
      }
    }

    ngOnInit(){
        this.label = this.labelInput ? this.labelInput : "Go Back To Previous Page";
    }
}
