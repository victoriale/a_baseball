import {Component, OnInit, OnChanges, Input, Output, EventEmitter} from 'angular2/core';
import {ModuleHeader, ModuleHeaderData} from '../../components/module-header/module-header.component';

export interface faqModuleData{
  question: string;
  answer: string;
  active: boolean;
}
@Component({
    selector: 'faq-module',
    templateUrl: './app/modules/faq/faq.module.html',
    directives: [ModuleHeader],
})

export class FAQModule implements OnInit, OnChanges {
  @Input() profileName: string;
  @Input() faqData: Array<faqModuleData>;
  @Output() faqSelected: EventEmitter<string> = new EventEmitter();

  public headerInfo: ModuleHeaderData = {
    moduleTitle: "FAQ - [Profile Name]",
    hasIcon: false,
    iconClass: ""
  };

  constructor() { }

  isSelected(faqData){
    faqData.active = !faqData.active;
    this.faqSelected.emit(faqData.question);
  }

  ngOnChanges() {
    let profileName = this.profileName ? this.profileName : "MLB";
    this.headerInfo.moduleTitle = "FAQ - " + profileName;
  }

  ngOnInit(){ }
}
