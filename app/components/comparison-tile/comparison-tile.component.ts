import {Component, Input, Output, EventEmitter} from '@angular/core';
import {CircleImageData} from '../images/image-data';
import {CircleImage} from '../images/circle-image';
import {DropdownComponent} from '../dropdown/dropdown.component';
import {ComplexInnerHtml} from '../complex-inner-html/complex-inner-html.component';
import {Link} from '../../global/global-interface';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {SanitizeHtml} from '../../pipes/safe.pipe';


export interface ComparisonTileInput {
    dropdownOneKey: string;
    dropdownTwoKey: string;
    imageConfig: CircleImageData;
    title: string;
    titleUrl: Array<any>;
    description: Array<Link | string>;
    //Currently accepts 4 data points
    data: Array<{data: string, key: string}>;
}

@Component({
    selector: 'comparison-tile',
    templateUrl: './app/components/comparison-tile/comparison-tile.component.html',
    directives:[CircleImage, DropdownComponent, ComplexInnerHtml, ROUTER_DIRECTIVES],
    pipes:[SanitizeHtml],
})

export class ComparisonTile {
    @Input() comparisonTileInput: ComparisonTileInput;

    @Input() dropdownList1: Array<{key: string, value: string}> = []

    @Input() dropdownList2: Array<{key: string, value: string}> = []

    @Output() dropdownSwitched = new EventEmitter();

    dropdownOneSwitched($event) {
        this.dropdownSwitched.next({
            dropdownIndex: 0,
            key: $event
        });
    }

    dropdownTwoSwitched($event) {
        this.dropdownSwitched.next({
            dropdownIndex: 1,
            key: $event
        });
    }
}
