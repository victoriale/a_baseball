import {Component,OnInit} from '@angular/core';
import {StackRowsComponent, StackRowsInput} from '../../components/stack-rows/stack-rows.component'
import {ArticleStacktopComponent, StackTopInput} from '../../components/article-stacktop/article-stacktop.component'

@Component({
  selector: 'article-stack-module',
  templateUrl: './app/modules/article-stack/article-stack.module.html',
  directives: [StackRowsComponent,ArticleStacktopComponent]
})

export class ArticleStackModule implements OnInit {
  constructor(){}
  ngOnInit() {
  
  }
}
