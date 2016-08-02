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
  @Input() articleData: any;
  @Input() state: any;
  @Input() page: number;
  constructor(private _deepdiveservice:DeepDiveService){}
    private getDeepDiveVideoBatch(region, numItems, startNum){
      this._deepdiveservice.getDeepDiveVideoBatchService(numItems, startNum, region).subscribe(
        data => {
          this.articleData = data.data;
        }
      )
    }
  formatDate(date) {
    return moment(date, "YYYY-MM-Do").format("MMMM DD, YYYY");
  }
  ngOnInit() {
    if (this.page == null) {this.page = 1;}
    else if (this.page != 1) {this.page = this.page + this.page % 2 | 0 + 1} //skip the pages shat are being shown by the stacktop component
    this.getDeepDiveVideoBatch(this.state, 4, this.page);
  }
}
