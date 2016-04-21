import {Component, OnInit} from 'angular2/core';
import {ModuleHeader} from '../../components/module-header/module-header.component';

@Component({
    selector: 'faq-module',
    templateUrl: './app/modules/faq/faq.module.html',
    directives: [ModuleHeader],
    providers: []
})

export class FAQModule{
    public moduleTitle: string = 'FAQ - [Profile Name]';
    getData(){

    }
    ngOnInit(){
      this.getData();
    }
}
