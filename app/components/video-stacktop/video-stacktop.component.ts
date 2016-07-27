import {Component,OnInit, Input} from '@angular/core';
import {DeepDiveService} from '../../services/deep-dive.service';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {SanitizeHtml} from "../../pipes/safe.pipe";

declare var moment;

@Component({
  selector: 'video-stacktop-component',
  templateUrl: './app/components/video-stacktop/video-stacktop.component.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [DeepDiveService],
  pipes:[SanitizeHtml]

})

export class VideoStacktopComponent implements OnInit{
  public articleData: any;
  @Input() state: string;
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
    return moment(date, "YYYY-MM-Do").format("MMMM Do, YYYY");
  }
  ngOnInit() {
    this.getDeepDiveVideoBatch(this.state ,2, 1);
  }


}
