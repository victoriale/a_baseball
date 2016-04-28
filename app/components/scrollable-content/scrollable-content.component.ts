import {Component, Input, Inject} from 'angular2/core';
// import {Ruler} from 'angular2/src/platform/browser/ruler';
// import {DomAdapter} from 'angular2/src/platform/dom/dom_adapter';
import {ElementRef} from 'angular2/src/core/linker/element_ref';

@Component({
    selector: 'scrollable-content',
    templateUrl: './app/components/scrollable-content/scrollable-content.component.html',
})

export class ScrollableContent {
  @Input() content: string;  
  @Input("height") containerHeight: number;
  
  private scrollerHeight: number = 61;
  private scrollerTop: number = 10.5;
  private showScroller: boolean = false;
  
  private _elementRef: ElementRef;
  
  private scrollbarHeightRatio:number = .90;
  
  constructor(@Inject(ElementRef) elementRef: ElementRef) { 
    this._elementRef = elementRef;
  }
}
