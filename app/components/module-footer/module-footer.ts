import {Component, OnInit, Input} from 'angular2/core';

interface moduleFooter {

}

@Component({
    selector: 'module-footer',
    templateUrl: './app/components/module-footer/module-footer.html',
    directives: [],
    providers: [],
})

export class ModuleFooter implements OnInit{
  @Input() footerData: Object;

    ngOnInit(){
      if(typeof this.footerData == 'undefined'){
        this.footerData = {
          infoDesc:'Want to see everybody involved in this list',
          btn:'',
          text:'VIEW THE LIST',
          url:'',
        }
      }
    }
}
