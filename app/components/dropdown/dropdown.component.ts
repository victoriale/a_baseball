import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, Renderer, OnChanges} from 'angular2/core';
import {ScrollableContent} from '../scrollable-content/scrollable-content.component';

@Component({
  selector: 'dropdown',
  templateUrl: './app/components/dropdown/dropdown.component.html',
  directives: [ScrollableContent]
})

export class DropdownComponent implements OnDestroy, OnChanges {  
  public isDropdownVisible: boolean = false;  
  public isDropdownEnabled: boolean = true;
  
  @Input() list: Array<{key: string, value: string}>;
      
  @Input() selectedKey: string;
  
  @Input() icon: string;
  
  dropdownVisibleIcon: string;
  
  dropdownHiddenIcon: string;
  
  selectedItem: {key: string, value: string};
  
  highlightCaret: boolean = false;
  
  @Output("selectionChanged") dropdownChangedListener = new EventEmitter();
  
  @Output("dropdownVisible") dropdownVisibleListener = new EventEmitter();
  
  private hideDropdownListener: Function;
  
  constructor(private _renderer: Renderer) {}
  
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
  
  onMouseEnter(index) {
    if ( index == 0 ) {
      this.highlightCaret = true;
    }
  }
  
  onMouseLeave(index) {
    if ( index == 0 ) {
      this.highlightCaret = false;
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
}