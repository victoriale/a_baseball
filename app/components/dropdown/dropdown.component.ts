import {Component, OnInit, Inject, OnDestroy, Input, Output, EventEmitter, Renderer, OnChanges, AfterViewInit} from 'angular2/core';
import {BrowserDomAdapter} from 'angular2/platform/browser'
import {ElementRef} from 'angular2/src/core/linker/element_ref';
import {ScrollableContent} from '../scrollable-content/scrollable-content.component';

@Component({
  selector: 'dropdown',
  templateUrl: './app/components/dropdown/dropdown.component.html',
  directives: [ScrollableContent],
  providers: [BrowserDomAdapter]
})

export class DropdownComponent implements OnDestroy, OnChanges, AfterViewInit {  
  public isDropdownVisible: boolean = true;  
  public isDropdownEnabled: boolean = true;
  
  @Input() list: Array<{key: string, value: string}>;
      
  @Input() selectedKey: string;
  
  @Input() icon: string;
  
  dropdownVisibleIcon: string;
  
  dropdownHiddenIcon: string;
  
  selectedItem: {key: string, value: string};
  
  @Output("selectionChanged") dropdownChangedListener = new EventEmitter();
  
  @Output("dropdownVisible") dropdownVisibleListener = new EventEmitter();
  
  private hideDropdownListener: Function;  
  
  private _elementRef: ElementRef;
  private _afterViewInit: boolean = false;
  
  constructor(@Inject(ElementRef) elementRef: ElementRef, private _dom: BrowserDomAdapter, private _renderer: Renderer) { 
    this._elementRef = elementRef;
  }
  
  ngAfterViewInit() {
    if ( this.isDropdownVisible ) {
      this.setupHoverCheck();
      this._afterViewInit = true;
    }
  }
  
  displayDropdown() {
    var self = this;
    this.isDropdownVisible = !this.isDropdownVisible;
    if ( this.isDropdownVisible ) {
      this.dropdownVisibleListener.next(true);
    }
    
    if ( !this.hideDropdownListener ) {
      //timeout is needed so that click doesn't happen for click.
      setTimeout(() => {
        if ( self.hideDropdownListener ) {
          self.hideDropdownListener();
          self.hideDropdownListener = undefined;
        }
        self.hideDropdownListener = self._renderer.listenGlobal('document', 'click', (event) => {
          self.isDropdownVisible = false;
          
          if ( self.hideDropdownListener ) {
            self.hideDropdownListener(); //this removes listener
          }
          self.hideDropdownListener = undefined;
        });
      }, 1);
    }
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
    this.selectedItem = { key: "", value: " " };
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
  }  
  
  setupHoverCheck() {    
    console.log("setting up hover check");
    var document = this._dom.defaultDoc();
    var scrollContainer = this._elementRef.nativeElement.getElementsByClassName('scrollable-item')[0];
    var caretTop = this._elementRef.nativeElement.getElementsByClassName('dropdown-caret-top')[0];    
    // var scrollContentWrapper = scrollContainer.getElementsByClassName('scrollable-item-wrapper');
    // var scrollContent = scrollContainer.getElementsByClassName('scrollable-item-content');
    //dropdown-caret-top-hover
    
    scrollContainer.addEventListener('mouseover', function(evt) {
      var x = evt.clientX;
      var y = evt.clientY;
      console.log("mouse over scroll container: " + x + ", " + y);
      var element = document.elementFromPoint(x, y);
      if ( element && scrollContainer && caretTop ) {
        var elementBounds = element.getBoundingClientRect();
        //this needs to be the <div> 'dropdown-list-option' otherwise highlight doesn't quite work
        var scrollContainerBounds = scrollContainer.getBoundingClientRect();
        console.log("  element under mouse: " + element.tagName);
        console.log("  element top: " + elementBounds.top + "; height: " + elementBounds.height);
        console.log("  container top: " + scrollContainerBounds.top);
        if ( scrollContainerBounds.top >= elementBounds.top ) {
          caretTop.className = "dropdown-caret-top dropdown-caret-top-hover";
        }
        else {
          caretTop.className = "dropdown-caret-top";          
        }
      }
    });
    
    scrollContainer.addEventListener('mouseout', function(evt) {
      if ( caretTop ) {
        caretTop.className = "dropdown-caret-top"; 
      }
    });
  }
}