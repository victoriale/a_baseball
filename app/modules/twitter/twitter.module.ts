import {Component, OnInit, OnChanges, Input} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';

@Component({
    selector: 'twitter-module',
    templateUrl: './app/modules/twitter/twitter.module.html',
    directives: [ModuleHeader],
    providers: []
})

export class TwitterModule implements OnInit, OnChanges {
  
  @Input() profileName: string;
  
  public headerInfo: ModuleHeaderData = {
    moduleTitle: "Twitter Feed - [Profile Name]",
    hasIcon: false,
    iconClass: ""
  };
    
  ngOnChanges() {
    let profileName = this.profileName ? this.profileName : "[Profile Name]";
    this.headerInfo.moduleTitle = "Twitter Feed - " + profileName;
  }
  
  getData() {
  }
  
  ngOnInit() {
    this.getData();
  }
}
