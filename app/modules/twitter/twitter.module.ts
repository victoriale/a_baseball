import {Component, OnInit} from 'angular2/core';
import {ModuleHeader} from '../../components/module-header/module-header.component';

@Component({
    selector: 'twitter-module',
    templateUrl: './app/modules/twitter/twitter.module.html',
    directives: [ModuleHeader],
    providers: []
})

export class TwitterModule{
    public moduleTitle: string = 'Twitter Feed - [Profile Name]';
    getData(){

    }
    ngOnInit(){
      this.getData();
    }
}
