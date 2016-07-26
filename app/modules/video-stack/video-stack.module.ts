import {Component,OnInit, Input} from '@angular/core';
import {VideoStacktopComponent} from '../../components/video-stacktop/video-stacktop.component';
import {VideoStackbotComponent} from '../../components/video-stackbot/video-stackbot.component'


@Component({
  selector: 'video-stack-module',
  templateUrl: './app/modules/video-stack/video-stack.module.html',
  directives: [VideoStacktopComponent,VideoStackbotComponent],
  providers: []

})

export class VideoStackModule{
  @Input() state: any;
  constructor(){

  }
  ngOnInit() {

  }


}
