import {Component, Input, OnInit} from 'angular2/core';

export interface ModuleFooterData {
  infoDesc: string, // text description that describes what is the footer going to display
  text: string, // the text that is in the mod-footer button that describes where the Route link is navigating to
  url:[any],//USED FOR ROUTER LINK
}

@Component({
    selector: 'module-footer',
    templateUrl: './app/components/module-footer/module-footer.component.html',
    directives: [],
    providers: [],
})

export class ModuleFooter implements OnInit{
  @Input() footerData: ModuleFooterData;

    ngOnInit(){
      if(typeof this.footerData == 'undefined'){
        this.footerData = {
          infoDesc:'Want to see everybody involved in this list',
          text:'VIEW THE LIST',
          url:['Disclaimer-page'],
        }
      }
    }
}
