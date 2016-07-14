import {Component,OnInit} from '@angular/core';
import {StackRowsComponent} from '../../components/stack-rows/stack-rows.component'
import {ArticleStacktopComponent} from '../../components/article-stacktop/article-stacktop.component'

@Component({
  selector: 'article-stack-module',
  templateUrl: './app/modules/article-stack/article-stack.module.html',
  directives: [StackRowsComponent,ArticleStacktopComponent],
  providers: []

})

export class ArticleStackModule{
  constructor(){

  }
  ngOnInit() {

  }


}
