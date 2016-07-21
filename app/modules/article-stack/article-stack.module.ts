import {Component,OnInit,Input} from '@angular/core';
import {StackRowsComponent} from '../../components/stack-rows/stack-rows.component'
import {ArticleStacktopComponent} from '../../components/article-stacktop/article-stacktop.component'

@Component({
  selector: 'article-stack-module',
  templateUrl: './app/modules/article-stack/article-stack.module.html',
  directives: [StackRowsComponent,ArticleStacktopComponent]
})

export class ArticleStackModule{
  @Input() stackrowsData: any;
  @Input() articlestackData: any;
  constructor(){

  }
  ngOnInit() {
    console.log('on init', this.articlestackData);

  }


}
