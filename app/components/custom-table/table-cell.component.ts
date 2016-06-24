import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {TableColumn, CellData} from '../../components/custom-table/table-data.component';
import {CircleImage} from '../../components/images/circle-image';

@Component({
  selector: 'table-cell',
  templateUrl: './app/components/custom-table/table-cell.component.html',
  directives: [CircleImage, ROUTER_DIRECTIVES]
})

export class TableCell {  
  @Input() cell: CellData;
  
  @Input() index: string;
}