import {Component,OnInit,Input} from '@angular/core';
import {RectangleImage} from '../../components/images/rectangle-image';
import {ImageData, RectangleImageData} from '../../components/images/image-data';
import {ROUTER_DIRECTIVES} from "@angular/router-deprecated";
import {SanitizeHtml} from "../../pipes/safe.pipe";


export interface StackRowsInput {
  stackRowsRoute: any;
  keyword: string;
  description: string;
  publishedDate: string;
  imageConfig: RectangleImageData;
}

@Component({
  selector: 'stack-rows-component',
  templateUrl: './app/components/stack-rows/stack-rows.component.html',
  directives: [RectangleImage, ROUTER_DIRECTIVES],
  pipes: [SanitizeHtml]
})

export class StackRowsComponent implements OnInit {
  @Input() stackRow: Array<StackRowsInput>;
  public width: number;
  public gridStackCol: string;

  ngOnInit() {}//ngOnInit ends
}
