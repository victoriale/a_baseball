import {Component, OnInit, OnChanges, Input} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';
export interface twitterModuleData{
  twitterUrl: string;
  twitterApi: string;
  twitterUserName: string;
}

@Component({
    selector: 'twitter-module',
    templateUrl: './app/modules/twitter/twitter.module.html',
    directives: [ModuleHeader],
})

export class TwitterModule implements OnInit, OnChanges {
  @Input() profileName: string;
  @Input() twitterData: twitterModuleData;

  public headerInfo: ModuleHeaderData = {
    moduleTitle: "Twitter Feed - [Profile Name]",
    hasIcon: false,
    iconClass: ""
  };

  ngOnChanges() {
    let profileName = this.profileName ? this.profileName : "[Profile Name]";
    this.headerInfo.moduleTitle = "Twitter Feed - " + profileName;
  }

  ngOnInit() {
    var script:any = document.createElement("script");
    script.innerHTML = !function(d,s,id){
      var js, fjs = d.getElementsByTagName(s)[0], p=/^http:/.test(d.location)?'http':'https';
      if(!d.getElementById(id)){
        js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js,fjs);
      }
    }(document,"script","twitter-wjs");
    document.body.appendChild(script);
  }
}
