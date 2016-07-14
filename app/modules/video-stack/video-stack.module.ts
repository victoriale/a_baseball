import {Component,OnInit} from '@angular/core';
import {VideoStacktopComponent} from '../../components/video-stacktop/video-stacktop.component'

@Component({
  selector: 'video-stack-module',
  templateUrl: './app/modules/video-stack/video-stack.module.html',
  directives: [VideoStacktopComponent],
  providers: []

})

export class VideoStackModule{
  constructor(){

  }
  ngOnInit() {

  }


}
