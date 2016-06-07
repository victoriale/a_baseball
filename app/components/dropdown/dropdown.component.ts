import {Component, OnInit, Inject, OnDestroy, Input, Output, EventEmitter, Renderer, OnChanges, AfterViewInit, ViewChild} from 'angular2/core';
import {BrowserDomAdapter} from 'angular2/platform/browser'
import {ElementRef} from 'angular2/src/core/linker/element_ref';
import {ScrollableContent} from '../scrollable-content/scrollable-content.component';
import {ScrollerFunctions} from '../../global/scroller-functions';

@Component({
  selector: 'dropdown',
  templateUrl: './app/components/dropdown/dropdown.component.html',
  directives: [ScrollableContent],
  providers: [BrowserDomAdapter]
})

export class DropdownComponent implements OnDestroy, OnChanges, AfterViewInit {  
  @Input() list: Array<{key: string, value: string}>;
      
  @Input() selectedKey: string;
  
  @Input() icon: string;
  
  dropdownVisibleIcon: string;
  
  dropdownHiddenIcon: string;
  
  selectedItem: {key: string, value: string};
  
  @Output("selectionChanged") dropdownChangedListener = new EventEmitter();
  
  private hideDropdownListener: Function;  
  private keepOpenUntilMouseUp: Function;  
  
  private _elementRef: ElementRef;
  private _scrollerSetup: boolean = false;
  
  constructor(@Inject(ElementRef) elementRef: ElementRef, private _dom: BrowserDomAdapter, private _renderer: Renderer) { 
    this._elementRef = elementRef;
  }
  
  ngAfterViewInit() {
    this.dropdownSetup();
    this.hoverSetup();
  }
  
  ngOnChanges() {
    if ( !this.icon ) {
      this.dropdownVisibleIcon = "fa-sort";
      this.dropdownHiddenIcon = "fa-sort";
    }
    else if (this.icon == "fa-caret-down") {      
      this.dropdownVisibleIcon = "fa-caret-up";
      this.dropdownHiddenIcon = "fa-caret-down";
    }
    else {      
      this.dropdownVisibleIcon = this.icon;
      this.dropdownHiddenIcon = this.icon;
    }
    if ( this.list ) {
      this.list.forEach(value => {
        if ( value.key == this.selectedKey ) {
          this.selectedItem = value;
        }
      });
      if ( !this.selectedItem && this.list.length > 0 ) {
        this.setSelected(this.list[0]);
      }
    }
    if ( !this.selectedItem ) {
      this.selectedItem = {key: "", value: " "};
    }
  }
  
  //TODO-CJP: setup multiple sort types
  setSelected($item) {
    this.selectedItem = $item;
    this.selectedKey = $item.key;
    this.dropdownChangedListener.next($item.key);
  }
  
  ngOnDestroy() {
    if ( this.hideDropdownListener ) {
       this.hideDropdownListener(); 
       this.hideDropdownListener = undefined;
    }
    if ( this.keepOpenUntilMouseUp ) {
      this.keepOpenUntilMouseUp();
      this.keepOpenUntilMouseUp = undefined;
    }
  }  
  
  /**
   * Adds listeners that determine whether the 
   * dropdown should be hidden or visible.
   * 
   * Dropdown containers should appear when the header
   * element is clicked and disappear when the mouse is clicked
   * elsewhere within the document, UNLESS the mousedown 
   * event starts on the scroller element.
   */
  dropdownSetup() {    
    var document = this._dom.defaultDoc();
    // console.log("dropdown setup: " + document);
    
    var self = this;
    var mouseDownOnScrollBar = false;
    var isDropdownVisible = false;
    var nativeElement = this._elementRef.nativeElement;
    var dropdownHeader = nativeElement.getElementsByClassName('dropdown')[0];
    var dropdownContainer = nativeElement.getElementsByClassName('dropdown-wrapper')[0];    
    var dropdownIcon = nativeElement.getElementsByClassName('dropdown-hdr-button')[0];
    if ( dropdownIcon ) {
      dropdownIcon = dropdownIcon.getElementsByTagName("i")[0];
    }
    
    function toggleDropdown(showIt:boolean) {
        isDropdownVisible = showIt;
        
        var display = "none";
        var icon = self.dropdownHiddenIcon;
        var className = "dropdown";
        if ( isDropdownVisible ) {            
          display = "";
          icon = self.dropdownVisibleIcon;
          className += " dropdown-active";
        } 
        dropdownContainer.style.display = display;
        dropdownHeader.className = className;
        if ( dropdownIcon ) {
          dropdownIcon.className = "fa " + icon;
        }     
    }
    
    function closeDropdownOnClick() {
        //remove any existing listener:
        if ( self.hideDropdownListener ) {
          self.hideDropdownListener();
          self.hideDropdownListener = undefined;
        }
        
        //add new listener that checks for any click on the document
        self.hideDropdownListener = self._renderer.listenGlobal('document', 'click', (event) => {
          if ( mouseDownOnScrollBar ) {
            //ignore click if 'keepDropdownOpen' is true
            mouseDownOnScrollBar = false;
            return;
          }

          toggleDropdown(false);
          
          if ( self.hideDropdownListener ) {
            //if the listener still exists, remove it as it's not needed once
            //the dropdown is hidden again 
            self.hideDropdownListener(); 
          }
          self.hideDropdownListener = undefined;
        });
    }
    
    if ( dropdownContainer && dropdownHeader ) {
      //needed to disable selection in IE11
      dropdownContainer.onselectstart = function() { return false; }
      
      // We don't want to close dropdown when the scroller is selected.
      // So this checks to see if the mouse went down on the scroller.
      dropdownHeader.addEventListener('mousedown', function(event) {
          var element = document.elementFromPoint(event.clientX, event.clientY);
          mouseDownOnScrollBar = element.className.indexOf("scrollable-item-scroller") >= 0;
          if ( mouseDownOnScrollBar ) {
            if ( self.keepOpenUntilMouseUp ) {
              self.keepOpenUntilMouseUp(); //remove listenr
            }
            setTimeout(() => {
              self.keepOpenUntilMouseUp = self._renderer.listenGlobal('document', 'mousedown', (event) => {
                mouseDownOnScrollBar = false;
              });
            },1);
          }
      });
      
      dropdownHeader.addEventListener('click', function(event) {
          if ( mouseDownOnScrollBar ) {
            //ignore click if 'keepDropdownOpen' is true
            return;
          }
          
          //Toggle the dropdown visibility and show/hide the actual container
          toggleDropdown(!isDropdownVisible);
          
          //If this is the first time the dropdown is visible, set up the scroller
          // as the scroller can't calculate a content's height and scroll ratio
          // when it's hidden.
          if ( isDropdownVisible ) {
            ScrollerFunctions.initializeScroller(nativeElement, document);
          }

          if ( !self.hideDropdownListener && isDropdownVisible ) {
            //timeout is needed so that click doesn't happen for click.
            setTimeout(closeDropdownOnClick, 1);
          }
      });
    }
  }
  
  hoverSetup() {    
    var document = this._dom.defaultDoc();
        
    var scrollContainer = this._elementRef.nativeElement.getElementsByClassName('scrollable-item')[0];
    var caretTop = this._elementRef.nativeElement.getElementsByClassName('dropdown-caret-top')[0];
    if ( !scrollContainer || !caretTop ) {
      return;
    }
    
    //Adds a mouseover listener checks to see if the mouse
    // is over the top item visible in the scroll container    
    scrollContainer.addEventListener('mouseover', function(evt) {
      
      //Get the element under the mouse point
      var element = document.elementFromPoint(evt.clientX, evt.clientY);
            
      //Cycle through parents until the dropdown-list-option element is found
      // (loopCount limit of 10 to prevent infinite loops)
      var optionElement = null, loopCount = 0;
      while ( !optionElement && loopCount < 10 ) {
        loopCount++;
        if ( element.className.indexOf("dropdown-list-option") >= 0 ) {
          optionElement = element;
        }
        element = element.parentElement;
      }
      
      //Check to see if the bounds of the element overlaps the top edge of the scroll container
      var highlightCaret = false;
      if ( optionElement && optionElement.className.indexOf("dropdown-grp-lbl") < 0 ) {
        var elementBounds = optionElement.getBoundingClientRect();
        var scrollContainerBounds = scrollContainer.getBoundingClientRect();
        if ( scrollContainerBounds.top >= elementBounds.top ) {
          highlightCaret = true;
        }
      }
      
      //If so, add the dropdown-caret-top-hover class to highlight the caret
      if ( highlightCaret ) {
        caretTop.className = "dropdown-caret-top dropdown-caret-top-hover";
      }
      else {
        caretTop.className = "dropdown-caret-top";          
      }
    });
    
    //Removes the dropdown-caret-top-hover class when the mouse 
    //moves off the scroll container
    scrollContainer.addEventListener('mouseout', function(evt) {
      if ( caretTop ) {
        caretTop.className = "dropdown-caret-top"; 
      }
    });
  }
}