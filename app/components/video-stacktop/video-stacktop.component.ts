import {Component,OnInit} from '@angular/core';
import {DeepDiveService} from '../../services/deep-dive.service';
import {SanitizeHtml} from "../../pipes/safe.pipe";


@Component({
  selector: 'video-stacktop-component',
  templateUrl: './app/components/video-stacktop/video-stacktop.component.html',
  directives: [],
  providers: [DeepDiveService],
  pipes: [SanitizeHtml]

})

export class VideoStacktopComponent{
  public articleData: any;
  constructor(
    private _deepdiveservice:DeepDiveService
    ){
      this.getDeepDiveVideoBatch(2, 1);
    }
    private getDeepDiveVideoBatch(numItems, startNum){
      this._deepdiveservice.getDeepDiveVideoBatchService(numItems, startNum).subscribe(
        data => {
          this.articleData = data.data;
        }
      )
    }
  ngOnInit() {

  }


}
