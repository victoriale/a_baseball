import {Component, Input, OnInit} from 'angular2/core';

interface moduleHeader{
  moduleTitle:string,
  hasIcon: boolean,
  iconClass: string,
}

@Component({
    selector: 'module-header',
    templateUrl: './app/components/module-header/module-header.component.html',
    directives:[],
    providers: []
})

export class ModuleHeader{
   @Input() modHeadData: moduleHeader;

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
