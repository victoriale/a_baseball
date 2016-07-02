import {Component, OnChanges, Input} from '@angular/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
declare var stButtons: any;

export interface dykModuleData{
  info: string;
}
@Component({
    selector: 'dyk-module',
    templateUrl: './app/modules/dyk/dyk.module.html',
    directives: [ModuleHeader],
})

export class DYKModule implements OnChanges {
  @Input() profileName: string;
  @Input() dykData: Array<dykModuleData>;

  public locateShareThis = function(){
    stButtons.locateElements();
  };

  public headerInfo: ModuleHeaderData = {
    moduleTitle: "Did You Know - [Profile Name]",
    hasIcon: false,
    iconClass: ""
  };

  ngOnChanges(event) {
    let profileName = this.profileName ? this.profileName : "MLB";
    this.headerInfo.moduleTitle = "Did You Know - " + profileName;
  }//ngOnChanges ends
}
