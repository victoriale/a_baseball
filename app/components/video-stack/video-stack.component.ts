import {Component,OnInit, Input} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {SanitizeHtml} from "../../pipes/safe.pipe";
import {GlobalFunctions} from "../../global/global-functions";

@Component({
  selector: 'video-stack-component',
  templateUrl: './app/components/video-stack/video-stack.component.html',
  directives: [ROUTER_DIRECTIVES],
  providers: [],
  pipes: [SanitizeHtml]

})

export class VideoStackComponent implements OnInit{
  public articleData: any;
  @Input() state: any;
  @Input() page: number;
  @Input() videoData: any;

  formatDate(date) {
    return GlobalFunctions.formatGlobalDate(date,'defaultDate');
  }
  ngOnInit() {
  }
}
