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
}
