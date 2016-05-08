import {Component, Input, Inject, OnChanges, AfterViewInit, AfterViewChecked} from 'angular2/core';
import {BrowserDomAdapter} from 'angular2/platform/browser'
import {ElementRef} from 'angular2/src/core/linker/element_ref';

@Component({
    selector: 'scrollable-content',
    templateUrl: './app/components/scrollable-content/scrollable-content.component.html',
    providers: [BrowserDomAdapter]
})
export class ScrollableContent implements AfterViewInit {
  @Input() content: string;
  
  private _elementRef: ElementRef;
  private _scrollerChecked: boolean = false;
  
  constructor(@Inject(ElementRef) elementRef: ElementRef, private _dom: BrowserDomAdapter) { 
    this._elementRef = elementRef;
  }
  
  ngAfterViewInit() {
    if ( this.content && this.content.length > 0 && !this._scrollerChecked ) {
      this.setupScroller();
    }
  }
  
  setupScroller() {
    var document = this._dom.defaultDoc();
    var scrollContainers = this._elementRef.nativeElement.getElementsByClassName('scrollable-item');
    
    for ( var i = 0; i < scrollContainers.length; i++ ) {
      createScrollable(scrollContainers[i]);
    };
      
    function createScrollable(scrollContainer) { 
      var scrollContentWrapper = scrollContainer.getElementsByClassName('scrollable-item-wrapper');
      var scrollContent = scrollContainer.getElementsByClassName('scrollable-item-content');
      if ( scrollContentWrapper.length == 0 || scrollContent.length == 0 ) {
        return;
      }
      else {
        scrollContentWrapper = scrollContentWrapper[0];
        scrollContent = scrollContent[0];
      }
      var normalizedPosition = 0;
      var contentPosition = 0;
      var scrollerBeingDragged = false;
              
      // Functions          
      function startDrag(evt) {
          normalizedPosition = evt.pageY;
          contentPosition = scrollContentWrapper.scrollTop;
          scrollerBeingDragged = true;
      }
      
      function stopDrag(evt) {
          scrollerBeingDragged = false;
      }

      function scrollBarScroll(evt) {
          if (scrollerBeingDragged === true) {
              var mouseDifferential = evt.pageY - normalizedPosition;
              var scrollEquivalent = mouseDifferential * (scrollContentWrapper.scrollHeight / scrollContainer.offsetHeight);
              scrollContentWrapper.scrollTop = contentPosition + scrollEquivalent;
          }
      }
      
      // Setup Scroller
      var scrollbarHeightRatio = 0.90;
      var scrollbarBaseHeight = scrollContainer.offsetHeight * scrollbarHeightRatio;
      var contentRatio = scrollContainer.offsetHeight / scrollContentWrapper.scrollHeight;
      var scrollerHeight = contentRatio * scrollbarBaseHeight;
      var scrollOffset = 5; // should be the same as offset in LESS file 
      var scrollerElement = document.createElement("div");
      scrollerElement.className = 'scrollable-item-scroller';
      
      // console.log("scrollWrapper: " + scrollContentWrapper.scrollHeight);
      // console.log("contentRatio: " + contentRatio);
      // console.log("scrollerHeight: " + scrollerHeight);
      // console.log("scrollContainer: " + scrollContainer.offsetHeight);
      // console.log("scroll content: " + scrollContentWrapper.innerHTML);

      if (contentRatio < 1) {
          scrollerElement.style.height = scrollerHeight + 'px';
          scrollerElement.style.top = scrollOffset.toString();

          // append scroller to scrollContainer div
          scrollContainer.appendChild(scrollerElement);

          // show scroll path divot
          scrollContainer.className += ' showScroll';

          // attach related draggable listeners                
          scrollerElement.addEventListener('mousedown', startDrag);
          window.addEventListener('mouseup', stopDrag);
          window.addEventListener('mousemove', scrollBarScroll)
      }
    
      scrollContentWrapper.addEventListener('scroll', function(evt) {
          // Move Scroll bar to top offset
          var scrollPercentage = evt.target.scrollTop / scrollContentWrapper.scrollHeight;
          var topPosition = (scrollPercentage * scrollbarBaseHeight);
          topPosition += scrollOffset;
          scrollerElement.style.top = topPosition + 'px';
      });
    }
      
    this._scrollerChecked = true;
  }
}
