import {Component, Input, Output, OnInit, OnDestroy, EventEmitter, ElementRef} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {SearchService} from '../../services/search.service';
import {Observable} from 'rxjs/Rx';
import {Control} from 'angular2/common';

//Interface for search dropdown items
export interface SearchComponentData {
    //Html string that is displayed in the dropdown
    title: string;
    //Value to compare against for autocomplete text
    value: string;
    //Url of image to be displayed next to the dropdown item
    imageUrl: string;
    //Array for routerLink parameters
    routerLink: Array<any>
}

//Interface for input of search component
interface SearchInput {
    //Text that goes in as the placeholder for the input
    placeholderText: string;
    //Boolean to determine if the search dropdown should be displayed
    hasSuggestions: boolean;
}

@Component({
    selector: 'search',
    host: {
      '(document:click)': 'handleClick($event)'
    },
    templateUrl: './app/components/search/search.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: []
})

export class Search{
    @Input() searchInput: SearchInput = {
        placeholderText: 'Enter your favorite team or player',
        hasSuggestions: true
    };
    @Input() placeholderText: string;

    //NgControl of input
    public term: any = new Control();
    //Array of suggestions dropdown
    public dropdownList: Array<SearchComponentData> = [];
    public elementRef;
    //Boolean to determine if dropdown should be shown
    public showDropdown: boolean = false;
    //Boolean to determine if no results message should be shown
    public hasResults: boolean = true;
    //Subscription objects for observables
    public subscriptionData: any;
    public subscriptionText: any;
    //Autocomplete string
    public autoCompleteText: string = '';
    //Index of a dropdown item that is been selected by arrow keys. (0 is no selection or input selected)
    public selectedIndex: number = 0;

    public isSuppressed: boolean = false;
    public storedSearchTerm: string;

    constructor(_elementRef: ElementRef, private _searchService: SearchService){
        this.elementRef = _elementRef;
    }

    //Function to detect if user clicks inside the component
    handleClick(event){
        let target = event.target;
        let clickedInside = false;
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
                    this.unsuppressSearch();

                }else{
                    //Else increment index by 1
                    this.selectedIndex++;
                    let value = this.getSelectedValue(this.selectedIndex);
                    this.suppressSearch(value);
                }
            }
        }else if(event.keyCode === 38){
            //Up Arrow Keystroke
            if(this.dropdownList.length > 0) {
                //If dropdown list exists change index
                if (this.selectedIndex === 0) {
                    //If index is 0 (input is selected), set index to last item
                    this.selectedIndex = this.dropdownList.length;
                    let value = this.getSelectedValue(this.selectedIndex);
                    this.suppressSearch(value);
                } else if(this.selectedIndex === 1) {
                    //Else if index is 1 (1st dropdown option is selected), set index to input and unsuppress search
                    this.selectedIndex = 0;
                    this.unsuppressSearch();
                } else {
                    //Else decrement index by 1
                    this.selectedIndex--;
                    let value = this.getSelectedValue(this.selectedIndex);
                    this.suppressSearch(value);
                }
            }
        }else{
            //If other key is pressed unsuppress search
            this.isSuppressed = false;
            this.resetSelected();
        }
    }

    //Get value that is
    getSelectedValue(index: number){
        return this.dropdownList[index - 1].value;
    }

    suppressSearch(value: string){
        this.isSuppressed = true;
        this.term.updateValue(value);
    }

    unsuppressSearch(){
        this.term.updateValue(this.storedSearchTerm);
        this.isSuppressed = false;
    }

    //Function to reset the dropdown item selected by arrow keys (Used throughout component)
    resetSelected(){
        this.selectedIndex = 0;
    }

    itemHovered(index: number){
        this.selectedIndex = index + 1;
    }

    //Function to check if autocomplete text should be displayed or hidden
    compareAutoComplete(text: string){
        //If dropdown suggestions exists
        if(this.dropdownList.length > 0){
            let suggestionText = this.dropdownList[0].value;
            //Sanitize values to compare. This is to match different case values
            let tempCompare = suggestionText.toLowerCase();
            let tempText = text.toLowerCase();
            //Check to see if input text is a substring of suggestion Text
            let indexOf = tempCompare.indexOf(tempText);
            //If input is a substring of the suggestion text, display suggestion text
            if(indexOf === 0 && text !== ''){
                //Rebuild auto complete text to display
                let autoCompleteText = text + suggestionText.substring(text.length);
                this.autoCompleteText = autoCompleteText;
            }else{
                this.autoCompleteText = '';
            }
        }
    }

    ngOnInit(){
        let self = this;

        //Subscription for function call to service
        this.subscriptionData = this.term.valueChanges
            //Only continue stream if 400 milliseconds have passed since the last iteration
            .debounceTime(400)
            //If search is not suppressed, continue rxjs stream
            .filter(data => !self.isSuppressed)
            //Only continue stream if the input value has changed from the last iteration
            .distinctUntilChanged()
            .switchMap((term: string) => term.length > 0 ? self._searchService.getSearchDropdownData(term) : Observable.of([]))
            .subscribe(data => {
                self.resetSelected();
                self.dropdownList = data;
                self.storedSearchTerm = self.term.value;
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
