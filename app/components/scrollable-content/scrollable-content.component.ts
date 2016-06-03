import {Component, Input, Inject, OnChanges, AfterViewInit, AfterViewChecked} from 'angular2/core';
import {BrowserDomAdapter} from 'angular2/platform/browser'
import {ElementRef} from 'angular2/src/core/linker/element_ref';
import {ScrollerFunctions} from '../../global/scroller-functions';

@Component({
    selector: 'scrollable-content',
    templateUrl: './app/components/scrollable-content/scrollable-content.component.html',
    providers: [BrowserDomAdapter]
})
export class ScrollableContent implements AfterViewInit, OnChanges {  
  private _elementRef: ElementRef;
  private _afterViewInit: boolean = false;
  
  constructor(@Inject(ElementRef) elementRef: ElementRef, private _dom: BrowserDomAdapter) { 
    this._elementRef = elementRef;
  }
  
  ngAfterViewInit() {
    this.setupScroller();
    this._afterViewInit = true;
  }
  
  ngOnChanges() {
    if ( this._afterViewInit ) {
      this.setupScroller();
    }
  }
  
  setupScroller() {
    var document = this._dom.defaultDoc();
    var nativeElement = this._elementRef.nativeElement;
    ScrollerFunctions.initializeScroller(nativeElement, document);
  }
}
