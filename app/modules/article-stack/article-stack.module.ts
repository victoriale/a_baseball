import {Component,OnInit,Input} from '@angular/core';
import {RectangleImageData} from '../../components/images/image-data';
import {RectangleImage} from '../../components/images/rectangle-image';
import {StackRowsComponent,StackRowsInput} from '../../components/stack-rows/stack-rows.component';
import {ArticleStacktopComponent,StackTopInput} from '../../components/article-stacktop/article-stacktop.component';

@Component({
  selector: 'article-stack-module',
  templateUrl: './app/modules/article-stack/article-stack.module.html',
  directives: [RectangleImage,StackRowsComponent,ArticleStacktopComponent]
})

export class ArticleStackModule implements OnInit {
  @Input() stackTop: StackTopInput;
  @Input() stackRow: Array<StackRowsInput>;

  ngOnInit() {}
}
