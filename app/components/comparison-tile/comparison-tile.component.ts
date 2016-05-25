import {Component, Input} from 'angular2/core';
import {CircleImageData} from '../images/image-data';
import {CircleImage} from '../images/circle-image';
import {DropdownComponent} from '../dropdown/dropdown.component';

export interface ComparisonTileInput {
    dropdownOneKey: string;
    dropdownTwoKey: string;
    imageConfig: CircleImageData;
    title: string;
    description: Array<{
        text: string;
        class?: string;
    }>;
    //Currently accepts 4 data points
    data: Array<{data: string, key: string}>;
}

@Component({
    selector: 'comparison-tile',
    templateUrl: './app/components/comparison-tile/comparison-tile.component.html',
    directives:[CircleImage, DropdownComponent]
})

export class ComparisonTile {
    @Input() comparisonTileInput: ComparisonTileInput;
    
    @Input() dropdownList1: Array<{key: string, value: string}> = []
    
    @Input() dropdownList2: Array<{key: string, value: string}> = [
        {key: "1", value: "One"},
        {key: "2", value: "Iki"},
        {key: "3", value: "Drei"}
    ]
}
