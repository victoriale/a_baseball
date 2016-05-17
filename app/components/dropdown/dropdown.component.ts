import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, Renderer, OnChanges} from 'angular2/core';

@Component({
  selector: 'dropdown',
  templateUrl: './app/components/dropdown/dropdown.component.html',
  providers: []
})

export class DropdownComponent implements OnDestroy, OnChanges {  
  public isDropdownVisible: boolean = false;  
  public isDropdownEnabled: boolean = true;
  
  @Input() list: Array<{key: string, value: string}>;
      
  @Input() selectedKey: string;
  
  selectedItem: {key: string, value: string};
  
  @Output("selectionChanged") dropdownChangedListener = new EventEmitter();
  
  private hideDropdownListener: Function;
  
  constructor(private _renderer: Renderer) {}
  
  displayDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
    
    if ( this.hideDropdownListener === undefined ) {
      //timeout is needed so that click doesn't happen for click.
      setTimeout(() => {
        this.hideDropdownListener = this._renderer.listenGlobal('document', 'click', (event) => {
          this.isDropdownVisible = false;
          
          
          this.hideDropdownListener(); 
          this.hideDropdownListener = undefined;
        });
      }, 0);
    }
  }
  
  ngOnChanges() {
    this.selectedItem = { key: "", value: " " };
    if ( this.list ) {
      this.list.forEach(value => {
        if ( value.key == this.selectedKey ) {
          this.selectedItem = value;
        }
      });
    }
  }
  
  //TODO-CJP: setup multiple sort types
  setSelected($item) {
    this.selectedItem = $item;
    this.selectedKey = $item.key;
    this.dropdownChangedListener.next($item.key);
  }
  
  ngOnDestroy() {
    if ( this.hideDropdownListener !== undefined ) {
       this.hideDropdownListener(); 
       this.hideDropdownListener = undefined;
    }
  }  
}