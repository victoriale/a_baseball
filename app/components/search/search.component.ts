import {Component, Input, Output, OnInit, EventEmitter, ElementRef} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Control} from 'angular2/common';


interface searchInput {
    placeholderText: string;
}

@Component({
    selector: 'search',
    host: {
      '(document:click)': 'handleClick($event)'
    },
    templateUrl: './app/components/search/search.component.html',
    directives:[],
    providers: []
})

export class Search{
    @Input() placeholderText;

    public term: any = new Control();
    public dropdownList: Array<Object> = [
        {
            text1: 'Who are the top ranked players in the ',
            text2: '{Division}?'
        },
        {
            text1: 'Who are the top ranked players in the ',
            text2: '{5mi} {GeoLocation}?'
        }
    ];
    public elementRef;
    public showDropdown: boolean = false;
    public hasResults: boolean = true;

    constructor(_elementRef: ElementRef){
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
            console.log('down arrow');
        }else if(event.keyCode === 38){
            console.log('up arrow');
        }
    }

    ngOnInit(){

        this.term.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(data => console.log('search term', data))
    }
}
