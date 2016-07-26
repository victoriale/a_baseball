import {Component,OnInit, Input} from '@angular/core';
import {DeepDiveService} from '../../services/deep-dive.service';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {SanitizeHtml} from "../../pipes/safe.pipe";


declare var moment;

@Component({
  selector: 'video-stackbot-component',
  templateUrl: './app/components/video-stackbot/video-stackbot.component.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [DeepDiveService],
  pipes: [SanitizeHtml]

})

export class VideoStackbotComponent implements OnInit{
  public articleData: any;
  @Input() state: any;
  constructor(
    private _deepdiveservice:DeepDiveService
    ){
    }
    private getDeepDiveVideoBatch(region, numItems, startNum){
      this._deepdiveservice.getDeepDiveVideoBatchService(numItems, startNum, region).subscribe(
        data => {
          this.articleData = data.data;
        }
      )
    }
  formatDate(date) {
    return moment(date, "YYYY-MM-Do, h:mm:ss").format("MMMM Do, YYYY h:mm:ss a");
  }
  ngOnInit() {
    this.getDeepDiveVideoBatch(this.state, 4, 2);
  }


}
