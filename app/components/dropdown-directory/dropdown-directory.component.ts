import {Component, Input} from '@angular/core';
import {ScrollableContent} from '../scrollable-content/scrollable-content.component';

@Component({
  selector: 'dropdown-directory',
  templateUrl: './app/components/dropdown-directory/dropdown-directory.component.html',
  directives: [ScrollableContent]
})

export class DropdownDirectoryComponent {
  @Input() heading: string;
  @Input() width: string;

  mouseUpDropdown(event) {
    if(event.target.offsetParent.classList.contains('active') || event.target.offsetParent.offsetParent.classList.contains('active')){
      event.target.offsetParent.classList.remove('active');
      event.target.offsetParent.offsetParent.classList.remove('active');
    }
    else {
      event.target.offsetParent.classList.add('active');
      event.target.offsetParent.offsetParent.classList.add('active');
    }
  }
  blurDropdown(event) {
    setTimeout(function(){ event.target.classList.remove('active'); }, 200);
  }
  triggerMouseEvent () {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent ("mouseup", true, true);
    window.dispatchEvent (clickEvent);
  }

}
