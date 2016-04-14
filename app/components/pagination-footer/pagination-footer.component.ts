import {Component, Input, Output, OnInit, OnChanges, EventEmitter} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
declare var jQuery: any;

@Component({
    selector: 'pagination-footer',
    templateUrl: './app/components/pagination-footer/pagination-footer.component.html',
    
    directives:[ROUTER_DIRECTIVES],
    providers: [],
    outputs: ['newIndex']
})

/*
    Summary
        There are two types of footer pagination.
        The first type is "module". The purpose of a module pagination footer is to control the index value of pagination without changing the page.
        To accomplish this, the index value is initially set based on the inputs and is controlled by the event emitter output.
        The second type is "page". The purpose of a page pagination footer is to navigate to a new page when a new index is clicked.
        To accomplish this, navigation parameters are initially inputted to create anchor tags, which allow for page navigation.

    Input - paginationParameters
        {
            index: number, //Required - Determines what index is selected
            max: number, //Required - Determines the max index that can be selected
            paginationType: string, //Required - Determines what kind of pagination footer this is (options are module or page. modules make the pagination navigation buttons. page makes the pagination navigation anchor tags.)

            viewAllPage: string, //Optional - This is the page used for routerLink in the view all button. (Both this and viewAllParams must be defined for the view all button to show)
            viewAllParams: Object, //Optional - This is the parameters used for routerLink in the view all button. (Both this and viewAllPage must be defined for the view all button to show)

            navigationPage: string, //Required for pagination Type page - This is the page used for routerLink for the navigation anchor tags
            navigationParams: Object, //Required for pagination Type page - This is the parameters used for routerLink for the navigation anchor tags.
            indexKey: string //Required for pagination Type page - This is the key name within navigation parameters in which index will apply to. (Ex. If a routes index field is named pageNumber, input "pageNumber" through this field and it will be added to navigationParams to allow for routerLink routing.)
        }
    Output
        newIndex() //Used for pagination Type module. This event emitter returns the new index value that was clicked.

 */

export class PaginationFooter implements OnChanges{
    @Input() paginationParameters: {
        index: number,
        max: number,
        paginationType: string,
        viewAllPage: string,
        viewAllParams: Object,
        navigationPage: string,
        navigationParams: Object,
        indexKey: string
    };
    //Booleans to determine if max/min skip buttons should be shown
    public showMinSkip: boolean = false;
    public showMaxSkip: boolean = false;
    //Button (anchor tag) parameters for min, max, previous angle, and next angle buttons
    public minButtonParameters: Object;
    public maxButtonParameters: Object;
    public previousButtonParameters: Object;
    public nextButtonParameters: Object;
    //Number to determine +- range of buttons. (ex. buttonRange of 2 with an index of 6 yields buttons, 4 5 6 7 8)
    public buttonRange: number = 2;
    //Array of what indexes are displayed. paginationButtonsModule is used for paginationType module. paginationButtonsPage is used for paginationType page
    public paginationButtonsModule: Array<Number>;
    public paginationButtonsPage: Array<{
        index: number,
        page: string;
        params: Object;
    }>;
    //Output event emitter
    public newIndex: EventEmitter<number> = new EventEmitter();

    //Verifies component input. If any issues are detected console warning is thrown
    verifyInput(){
        var input = this.paginationParameters;
        try{
            //Check if input is defined at all
            if(typeof input === 'undefined'){
                throw 'No input parameters defined. Make sure input values are passed in correctly';
            }
            //Check if index parameter is defined
            if(typeof input.index === 'undefined'){
                throw 'input parameter index must be defined. Check component comments for more details';
            }
            //Check if max parameter is defined
            if(typeof input.max === 'undefined'){
                throw 'input parameter max must be defined. Check component comments for more details';
            }
            //Check if paginationType is defined
            if(typeof input.paginationType === 'undefined'){
                throw 'input parameter paginationType must be defined. Check component comments for more details';
            }
            //Do checks on required inputs if paginationType is page
            if(input.paginationType === 'page'){
                //Check if navigationPage is defined
                if(typeof input.navigationPage === 'undefined'){
                    throw 'input parameter navigationPage must be defined for paginationType page. Check component comments for more details';
                }
                //Check if navigationParams are defined
                if(typeof input.navigationParams === 'undefined'){
                    throw 'input parameter navigationParams must be defined for paginationType page. Check component comments for more details';
                }
                //Check if indexKey is defined
                if(typeof input.indexKey === 'undefined'){
                    throw 'input parameter indexKey must be defined for paginationType page. Check component comments for more details';
                }
            }

        }catch(e){
            console.error('Error - Pagination Footer: ', e);
        }
    }

    //Build button structure for pagination Type module
    buildModuleButtons(){
        var index = this.paginationParameters.index;
        var max = this.paginationParameters.max;
        var range = this.buttonRange;

        this.paginationButtonsModule = [];

        //Determine values before index that can be added to button array
        for(var p = range; p > 0; p--){
            if(index - p > 1){
                this.paginationButtonsModule.push(index - p);
            }
        }

        //Push index value to array if it is not the minimum or maximum value
        if(index !== 1 && index !== max){
            this.paginationButtonsModule.push(index);
        }

        //Determine values after index that can be added to button array
        for(var n = 1; n <= range; n++){
            if(index + n < max){
                this.paginationButtonsModule.push(index + n);
            }
        }

        //Determine if absolute first button should be shown (show ellipsis if first item in array is not 2)
        if(this.paginationButtonsModule.length !== 0 && this.paginationButtonsModule[0] !== (1 + 1)){
            this.showMinSkip = true;
        }else{
            this.showMinSkip = false;
        }

        //Determine if absolute last button should be shown (show ellipsis if the last item in the array is not max - 1)
        if(this.paginationButtonsModule.length !== 0 && this.paginationButtonsModule[this.paginationButtonsModule.length - 1] !== (max - 1)){
            this.showMaxSkip = true;
        }else{
            this.showMaxSkip = false;
        }
    }

    //Build button(anchor tag) structure for pagination Type page
    buildPageButtons(){
        var index = this.paginationParameters.index;
        var max = this.paginationParameters.max;
        var range = this.buttonRange;

        this.paginationButtonsPage = [];

        var navigationPage = this.paginationParameters.navigationPage;
        var indexKey = this.paginationParameters.indexKey;
        //Determine values before index that can be added to button array
        for(var p = range; p > 0; p--){
            if(index - p > 1){
                //Build routerLink params for index values
                var params = this.copyDynamicParams();
                params[indexKey] = index - p;
                //Push button parameters to array
                this.paginationButtonsPage.push({
                    index: (index - p),
                    page: navigationPage,
                    params: params
                });
            }
        }

        if(index !== 1 && index !== max) {
            //Build routerLink params for inputted index value
            var params = this.copyDynamicParams();
            params[indexKey] = (index);
            //Push button parameters to array
            this.paginationButtonsPage.push({
                index: index,
                page: navigationPage,
                params: params
            });
        }

        //Determine values after index that can be added to button array
        for(var n = 1; n <= range; n++){
            if(index + n < max){
                //Build routerLink params for index values
                var params = this.copyDynamicParams();
                params[indexKey] = index + n;
                //Push button parameters to array
                this.paginationButtonsPage.push({
                    index: (index + n),
                    page: navigationPage,
                    params: params
                });
            }
        }

        //Build min button parameters
        var params = this.copyDynamicParams();
        params[indexKey] = 1;
        this.minButtonParameters = params;

        //Build max button parameters
        var params = this.copyDynamicParams();
        params[indexKey] = max;
        this.maxButtonParameters = params;

        //Determine if absolute first button should be shown (show ellipsis if first item in array is not 2)
        if(this.paginationButtonsPage.length !== 0 && this.paginationButtonsPage[0].index !== (1 + 1)){
            this.showMinSkip = true;
        }else{
            this.showMinSkip = false;
        }

        //Determine if absolute last button should be shown (show ellipsis if the last item in the array is not max - 1)
        if(this.paginationButtonsPage.length !== 0 && this.paginationButtonsPage[this.paginationButtonsPage.length - 1].index !== (max - 1)){
            this.showMaxSkip = true;
        }else{
            this.showMaxSkip = false;
        }

        //Build parameters of previous angle button
        var params = this.copyDynamicParams();
        if(index - 1 >= 1){
            params[indexKey] = index - 1;
        }else{
            params[indexKey] = 1;
        }
        this.previousButtonParameters = params;

        //Build parameters of next angle button
        var params = this.copyDynamicParams();
        if(index + 1 <= max){
            params[indexKey] = index + 1;
        }else{
            params[indexKey] = max;
        }
        this.nextButtonParameters = params;
    }

    //Copy object of input navigationParameters
    copyDynamicParams(){
        var params = {};
        var navigationParameters = this.paginationParameters.navigationParams;
        for(var key in navigationParameters){
            params[key] = navigationParameters[key];
        }
        return params;
    }

    //Function to navigate number buttons for paginationType module
    indexClick(event){
        var newIndex = Number(jQuery(event.target).html());
        //Send new index to output event emitter
        this.newIndex.next(newIndex);

        this.paginationParameters.index = newIndex;
        this.buildModuleButtons();
    }

    //Function to navigate angle left button for paginationType module
    indexLeft(event){
        //If index equals 1 exit function, else set new index
        if(this.paginationParameters.index === 1){
            return false;
        }else{
            var newIndex = this.paginationParameters.index - 1;
        }
        //Send new index to output event emitter
        this.newIndex.next(newIndex);

        this.paginationParameters.index = newIndex;
        this.buildModuleButtons();
    }

    //Function to navigate angle right button for paginationType module
    indexRight(event){
        //If index equals max exit function, else set new index
        if(this.paginationParameters.index === this.paginationParameters.max){
            return false;
        }else{
            var newIndex = this.paginationParameters.index + 1;
        }
        //Send new index to output event emitter
        this.newIndex.next(newIndex);

        this.paginationParameters.index = newIndex;
        this.buildModuleButtons();
    }

    ngOnChanges(event){
        this.verifyInput();
        window.scrollTo(0, 0);
        //Call button build function based on pagination Type
        if(this.paginationParameters.paginationType === 'module') {
            this.buildModuleButtons();
        }else if(this.paginationParameters.paginationType === 'page'){
            this.buildPageButtons();
        }
    }
}
