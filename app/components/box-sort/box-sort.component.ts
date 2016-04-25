import {Component, OnInit} from 'angular2/core';

@Component({
    selector: 'box-sort-component',
    templateUrl: './app/components/box-sort/box-sort.component.html',
    inputs: ['trData'],
})

export class BoxSortComponent implements OnInit{
  public trData: Object;
  public trDataList: Object;
  ngOnInit(){
    // this.trData = [
    //   {
    //     boxTitle: "PLAYER",
    //     boxWidth: "285px"
    //   },
    //   {
    //     boxTitle: "POS.",
    //     boxWidth: "60px"
    //   },
    //   {
    //     boxTitle: "HEIGHT",
    //     boxWidth: "75px"
    //   },
    //   {
    //     boxTitle: "WEIGHT",
    //     boxWidth: "75px"
    //   },
    //   {
    //     boxTitle: "AGE",
    //     boxWidth: "50px"
    //   },
    //   {
    //     boxTitle: "SALARY",
    //     boxWidth: "90px"
    //   }
    // ]
  }

}
