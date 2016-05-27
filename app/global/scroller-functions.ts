export class ScrollerFunctions { 
  
  static initializeScroller(nativeElement: any, document: HTMLDocument) {
    // console.log("setting up scroller");
    var scrollContainers = nativeElement.getElementsByClassName('scrollable-item');
    
    for ( var i = 0; i < scrollContainers.length; i++ ) {
      checkForScrollable(scrollContainers[i]);
    };
    
    // if ( scrollContainers.length == 0 ) {
    //  console.log(" no scroll containers" );
    // }
      
    function checkForScrollable(scrollContainer) { 
      var scrollContentWrapper = scrollContainer.getElementsByClassName('scrollable-item-wrapper');
      var scrollContent = scrollContainer.getElementsByClassName('scrollable-item-content');
      if ( scrollContentWrapper.length == 0 || scrollContent.length == 0 ) {
        return;
      }
      else {
        scrollContentWrapper = scrollContentWrapper[0];
        scrollContent = scrollContent[0];
      }
      
      // Setup Scroller
      var scrollbarHeightRatio = 0.90;
      var scrollbarBaseHeight = scrollContainer.offsetHeight * scrollbarHeightRatio;
      var contentRatio = scrollContainer.offsetHeight / scrollContentWrapper.scrollHeight;
      var scrollerHeight = contentRatio * scrollbarBaseHeight;
      var scrollOffset = 5; // should be the same as offset in scroll-content.component.less file  
      var scrollerElement = scrollContainer.getElementsByClassName('scrollable-item-scroller');
      var scrollerAlreadyOnPage = false;
      
      if ( scrollerElement && scrollerElement.length > 0 ) {
        scrollerElement = scrollerElement[0];
        scrollerAlreadyOnPage = true;
      }
      else {
        scrollerElement = document.createElement("div");
      }
      
      scrollerElement.className = 'scrollable-item-scroller';

      if (contentRatio < 1) {
          scrollerElement.style.height = scrollerHeight + 'px';

          // append scroller to scrollContainer div
          if ( !scrollerAlreadyOnPage ) {
            scrollerElement.style.top = scrollOffset.toString();
            ScrollerFunctions.createScroller(scrollContentWrapper, scrollContainer, scrollerElement, scrollbarBaseHeight, scrollerHeight, scroll);
          }
      }
    }
  }
  
  static createScroller(wrapper, container, scroller, baseHeight, height, offset) {
    var scrollContentWrapper = wrapper;
    var scrollContainer = container;
    var scrollerElement = scroller;
    console.log("scroller: " + scroller.className);
    var scrollbarBaseHeight = baseHeight;
    var scrollOffset = offset;
    var normalizedPosition = 0;
    var contentPosition = 0;
    var scrollerBeingDragged = false;
                  
    // Functions          
    function startDrag(evt) {
      console.log("starting drag");
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
          console.log("dragging scroller: " + scrollEquivalent);
            scrollContentWrapper.scrollTop = contentPosition + scrollEquivalent;
        }
        else {
          console.log("scroller not being dragged");
        }
    }
    
    scrollContainer.appendChild(scrollerElement);

    // show scroll path divot
    scrollContainer.className += ' showScroll';

    // attach related draggable listeners
    scrollerElement.addEventListener('mousedown', startDrag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('mousemove', scrollBarScroll);
    
    scrollContentWrapper.addEventListener('scroll', function(evt) {
        // Move Scroll bar to top offset
        var scrollPercentage = evt.target.scrollTop / scrollContentWrapper.scrollHeight;
        var topPosition = (scrollPercentage * scrollbarBaseHeight);
        topPosition += scrollOffset;
        scrollerElement.style.top = topPosition + 'px';
    });
  }
}