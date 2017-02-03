import {Component, Input, OnInit} from '@angular/core';

export interface ModuleHeaderData {
  moduleTitle:string,
  hasIcon: boolean,
  iconClass: string,
  seasonBase?:any
}

@Component({
    selector: 'module-header',
    templateUrl: './app/components/module-header/module-header.component.html',
    directives:[],
    providers: []
})

export class ModuleHeader {
   @Input() modHeadData: ModuleHeaderData;

   ngOnInit(){
     if(typeof this.modHeadData == 'undefined'){
       this.modHeadData = {
         moduleTitle: "Module Title [Here]",
         hasIcon: false,
         iconClass: '',
       }
     }// end of placeholder if statement
   }
}
