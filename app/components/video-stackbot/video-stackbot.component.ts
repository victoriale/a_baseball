import {Component,OnInit} from '@angular/core';
import {DeepDiveService} from '../../services/deep-dive.service';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

declare var moment;

@Component({
  selector: 'video-stackbot-component',
  templateUrl: './app/components/video-stackbot/video-stackbot.component.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [DeepDiveService]

})

export class VideoStackbotComponent{
  public articleData: any;
  constructor(
    private _deepdiveservice:DeepDiveService
    ){
      this.getDeepDiveVideoBatch(4, 2);
    }
    private getDeepDiveVideoBatch(numItems, startNum){
      this._deepdiveservice.getDeepDiveVideoBatchService(numItems, startNum).subscribe(
        data => {
          this.articleData = data.data;
        }
      )
    }
  formatDate(date) {
    return moment(date, "YYYY-MM-Do, h:mm:ss").format("MMMM Do, YYYY h:mm:ss a");
  }
  ngOnInit() {

  }


}
