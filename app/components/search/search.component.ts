import {Component, Input, Output, OnInit, OnDestroy, EventEmitter, ElementRef} from 'angular2/core';
import {SearchService} from '../../services/search.service';
import {Observable} from 'rxjs/Rx';
import {Control} from 'angular2/common';


/*
 *
 *
 *  Interface for search dropdown items
 *  SearchComponentData {
 *      //Html string that is displayed in the dropdown
 *      title: string;
 *      //Value to compare against for autocomplete text
 *      value: string
 *      //Url of image to be displayed next to the dropdown item
 *      imageUrl: string;
 *      //Array for routerLink parameters
 *      routerLink: Array<any>;
 *   }
 *
 *
 */

export interface SearchComponentData {
    title: string;
    value: string;
    imageUrl: string;
    routerLink: Array<any>
}

interface SearchInput {
    placeholderText: string;
    hasSuggestions: boolean;
}

@Component({
    selector: 'search',
    host: {
      '(document:click)': 'handleClick($event)'
    },
    templateUrl: './app/components/search/search.component.html',
    directives: [],
    providers: []
})

export class Search{
    @Input() searchInput: SearchInput = {
        placeholderText: 'Enter your favorite team or player',
        hasSuggestions: true
    };
    @Input() placeholderText: string;

    public term: any = new Control();
    public dropdownList: Array<SearchComponentData> = [];
    public elementRef;
    public showDropdown: boolean = false;
    public hasResults: boolean = true;
    //Subscription objects for observables
    public subscriptionData: any;
    public subscriptionText: any;
    //Autocomplete string
    public autoCompleteText: string = '';
    //Index of a dropdown item that is been selected by arrow keys. (0 is no selection or input selected)
    public selectedIndex: number = 0;

    constructor(_elementRef: ElementRef, private _searchService: SearchService){
        this.elementRef = _elementRef;
    }

    //Function to detect if user clicks inside the component
    handleClick(event){
        var target = event.target;
        var clickedInside = false;
        do{
            if(target === this.elementRef.nativeElement){
                clickedInside = true;
                //Exit do while loop
                target = false;
            }
            target = target.parentNode;
        }while(target);
        //If the user clicks in the component, show results else hide results
        if(clickedInside){
            //Clicked inside
            this.showDropdown = true;
        }else{
            //Clicked outside
            this.showDropdown = false;
        }
    }

    searchKeydown(event){
        if(event.keyCode === 40){
            //Down Arrow Keystroke
            if(this.dropdownList.length > 0){
                //If dropdown list exists change index
                if(this.selectedIndex >= this.dropdownList.length){
                    //If index is equal or greater than last item, reset index to 0 (input is selected)
                    this.selectedIndex = 0;
                }else{
                    //Else increment index by 1
                    this.selectedIndex++;
                }
            }
        }else if(event.keyCode === 38){
            //Up Arrow Keystroke
            if(this.dropdownList.length > 0) {
                //If dropdown list exists change index
                if (this.selectedIndex === 0) {
                    //If index is 0 (input is selected), set index to last item
                    this.selectedIndex = this.dropdownList.length;
                } else {
                    //Else decrement index by 1
                    this.selectedIndex--;
                }
            }
        }
    }

    //Function to reset the dropdown item selected by arrow keys (Used throughout component)
    resetSelected(){
        this.selectedIndex = 0;
    }

    itemHovered(index){
        this.selectedIndex = index + 1;
    }

    //Function to check if autocomplete text should be displayed or hidden
    compareAutoComplete(text){
        //If dropdown suggestions exists
        if(this.dropdownList.length > 0){
            var suggestionText = this.dropdownList[0].value;
            //Sanitize values to compare. This is to match different case values
            var tempCompare = suggestionText.toLowerCase();
            var tempText = text.toLowerCase();
            //Check to see if input text is a substring of suggestion Text
            var indexOf = tempCompare.indexOf(tempText);
            //If input is a substring of the suggestion text, display suggestion text
            if(indexOf === 0 && text !== ''){
                //Rebuild auto complete text to display
                var autoCompleteText = text + suggestionText.substring(text.length);
                this.autoCompleteText = autoCompleteText;
            }else{
                this.autoCompleteText = '';
            }
        }
    }

    ngOnInit(){
        var self = this;

        //Subscription for function call to service
        this.subscriptionData = this.term.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .switchMap((term: string) => term.length > 0 ? self._searchService.getSearchDropdownData(term) : Observable.of([]))
            .subscribe(data => {
                self.resetSelected();
                self.dropdownList = data;
                self.compareAutoComplete(self.term.value);
            });

        //Subscription to run a function when search input value changes
        this.subscriptionText = this.term.valueChanges
            .subscribe(text => {
                self.compareAutoComplete(text);
            });

    }

    ngOnDestroy(){
        //Unsubscribe to observables to avoid memory leak
        this.subscriptionData.unsubscribe();
        this.subscriptionText.unsubscribe();
    }
}
