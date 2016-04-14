import {Component, OnInit, Input} from 'angular2/core';
import {List} from '../../global/global-interface';
import {contentList} from "../../components/contentlist/contentlist";
import {moduleHeader} from "../../components/module-header/module-header";
import {moduleFooter} from "../../components/module-footer/module-footer";
import {PaginationFooter} from "../../components/pagination-footer/pagination-footer.component";
import {GlobalFunctions} from "../../global/global-functions";

@Component({
    selector: 'list-of-lists-module',
    templateUrl: './app/modules/listoflist/listoflist.module.html',
    
    directives: [contentList,moduleHeader, PaginationFooter],
    providers: [],
    inputs:['listOfLists']
})

export class ListOfListModule {
    public module_title: string;
    public state: string;
    public city: string;
    public lists: Array<any> = [];
    public listOfLists: Array<any>;
    public paginationParameters: Object;
    public index: number = 1;

    constructor(private _globalFunctions: GlobalFunctions){ }

    //Function to determine what lists data is displayed based on index
    transformData() {
        var self = this;
        var index = this.index;
        var displayArray = [];
        //Minus 1 for 0 based indexing
        var startIndex = ((index - 1) * 3);

        //Loop through the data the amount of items that displayed (ex. default is 3)
        for(var i = startIndex; i < startIndex + 3; i++){
            var listItem = this.listOfLists[i];
            //If data does not exist for loop iteration skip the iteration
            if(typeof listItem === 'undefined'){
                continue;
            }
            //Initialize List Item Object
            var arrayItem: any = {};

            //Determine if item is even or odd
            if(i % 2 === 0){
                arrayItem.bgClass = 'even';
            }else{
                arrayItem.bgClass = 'odd';
            }

            //Add title and original title to List Item Object
            arrayItem.listTitleOrig = this._globalFunctions.camelCaseToKababCase(listItem.listTitle);
            arrayItem.listTitle = self._globalFunctions.convertListName(arrayItem.listTitleOrig);

            //Add data for small images to listData array if it exists
            if(listItem !== null && listItem.listData.length > 0){
                var tempListData = [];

                listItem.listData.forEach(function(item, index){
                    //Add placeholder image if no image exists
                    if(item.photo === false || item.photo === null){
                        item.photo = 'app/public/no_photo_images/House_1.png';
                    }
                    //Push items with sanitized photo urls
                    tempListData.push(item);
                });

                //Assign list data to array item
                arrayItem.listData = tempListData;
            }


            displayArray.push(arrayItem);
        }

        //If first item in array has city and state use it (This fixes problems where city is multiple words)
        if(displayArray.length !== 0){
            this.city = displayArray[0].listData[0].city;
            this.state = displayArray[0].listData[0].stateOrProvince;
        }

        //Assign data to display in module
        this.lists = displayArray;
    }

    //Function that fires when a new index is clicked on pagination footer
    newIndex(index){
        this.index = index;
        this.transformData();
    }

    //Function to set up parameters for pagination footer
    setPaginationParameters(){
        var data = this.listOfLists;
        var max = Math.ceil(data.length / 3);

        //Define parameters to send to pagination footer
        this.paginationParameters = {
            index: this.index,
            max: max,
            paginationType: 'module',
            viewAllPage: 'List-of-lists-page',
            viewAllParams: {
                state: this.state,
                city: this.city
            }
        }
    }

    //Function to sanitize any list that do not have data
    sanitizeListofListData(){
        var data = this.listOfLists;
        var sanitizedArray = [];

        //Sanitize/Remove any list that do not have list data
        data.forEach(function(item, index){
            if(item.listData !== null && item.listData.length > 0){
                sanitizedArray.push(item);
            }
        });

        if(sanitizedArray.length === 0){
            //If there is no list data in the returned api call, set to undefined to hide module
            this.listOfLists = undefined;
        }else {
            //Else insert array items that have list data
            this.listOfLists = sanitizedArray;
            //Set up parameters for pagination footer
            this.setPaginationParameters();
            //Do initial data transformation for first 3 lists to be displayed
            this.transformData();
        }
    }

    ngOnInit() {
        //Sanitize list data
        this.sanitizeListofListData();
        //Build module title
        this.module_title = 'Top Lists for ' + this.city + ", " + this._globalFunctions.stateToAP(this.state);
    }
}
