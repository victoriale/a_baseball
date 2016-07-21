import {Component,OnInit,Input} from '@angular/core';
import {DeepDiveService} from '../../services/deep-dive.service';


@Component({
  selector: 'article-stacktop-component',
  templateUrl: './app/components/article-stacktop/article-stacktop.component.html',
  directives: [],
  providers: [DeepDiveService]

})

export class ArticleStacktopComponent{
  @Input() articlestackData: any;
  constructor(){

  }
  ngOnInit() {

  }


}
