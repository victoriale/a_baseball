import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {CircleImageData} from '../images/image-data';
import {CircleImage} from '../images/circle-image';
import {DropdownComponent} from '../dropdown/dropdown.component';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {ComplexInnerHtml} from '../../components/complex-inner-html/complex-inner-html.component';
import {Link} from '../../global/global-interface';

export interface ComparisonTileInput {
    dropdownOneKey: string;
    dropdownTwoKey: string;
    imageConfig: CircleImageData;
    title: Array<Link>;
    description: Array<{
        text: Array<Link | string>;
        // itemLink?: string;
        class?: string;
    }>;
    //Currently accepts 4 data points
    data: Array<{data: string, key: string}>;
    // linkObj?: string;
}

@Component({
    selector: 'comparison-tile',
    templateUrl: './app/components/comparison-tile/comparison-tile.component.html',
    directives:[CircleImage, DropdownComponent, ROUTER_DIRECTIVES, ComplexInnerHtml]
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
