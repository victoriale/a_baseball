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
  @Input() page: number;
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
    return moment(date, "YYYY-MM-Do, h:mm:ss").format("MMMM DD, YYYY h:mm:ss a");
  }
  ngOnInit() {
    if (this.page == null) {this.page = 1;}
    else if (this.page == 1) {this.page = this.page + 2} //skip the pages shat are being shown by the stackbot component
    else if (this.page != 1) {this.page = (this.page * 3) + this.page - 1}
    this.getDeepDiveVideoBatch(this.state ,2, this.page);
  }


}
