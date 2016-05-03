import {Component, OnInit} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';

export interface faqModuleData{
  question: string;
  answer: string;
}
@Component({
    selector: 'faq-module',
    templateUrl: './app/modules/faq/faq.module.html',
    directives: [ModuleHeader],
    providers: []
})

export class FAQModule{
    public faqData: Array<faqModuleData>;
    public headerInfo: ModuleHeaderData = {
      moduleTitle: "FAQ - [Profile Name]",
      hasIcon: false,
      iconClass: ""
    };
    getData(){
      this.faqData = [
      {
        question: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed dosit amet, consectetur adipisicing elit, sed  eiusmod tempor Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do e?",
        answer: "Ipsum dolor sit amet, consectetur adipisicing elit, dolor sit amet, consectetur adipisicing elit."
      },{
        question: "Lorem ipsum dolor sit amet, consectetur adipisicing elit?",
        answer: "Ipsum dolor sit amet, consectetur adipisicing elit."
      },{
        question: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do e?",
        answer: "Ipsum dolor."
      },{
        question: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do e?",
        answer: "Ipsum dolor sit amet, consectetur adipisicing elit."
      }]
    }
    ngOnInit(){
      this.getData();
    }
}
