import {Component, Input, OnInit, OnChanges, Output, EventEmitter, ElementRef, Renderer, AfterContentChecked} from '@angular/core';
import {Search, SearchInput} from '../../components/search/search.component';
import {Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {SubHeaderComponent} from '../../components/sub-header/sub-header.component';
import {HamburgerMenuComponent, MenuData} from '../../components/hamburger-menu/hamburger-menu.component';
import {GlobalSettings} from "../../global/global-settings";
import {SanitizeHtml, SanitizeStyle} from "../../pipes/safe.pipe";

declare var stButtons: any;
declare var jQuery:any;

@Component({
    selector: 'header-component',
    templateUrl: './app/components/header/header.component.html',
    directives: [Search, ROUTER_DIRECTIVES, SubHeaderComponent, HamburgerMenuComponent],
    providers: [],
    pipes:[SanitizeHtml, SanitizeStyle]
})
export class HeaderComponent implements OnInit, OnChanges, AfterContentChecked {
    @Input('partner') partnerID:string;
    @Input() partnerScript;
    @Input() iframeMaxHeight;
    @Output() tabSelected = new EventEmitter();
    @Output() scrollPadding = new EventEmitter();

    public scope: string;
    public routeSubscription: any;
    public logoUrl:string;
    private _stickyHeader: string;
    private _stickyHeaderPartner: string;
    public searchInput: SearchInput = {
        placeholderText: "Search for a player or team",
        hasSuggestions: true
    };
    public hamburgerMenuData: Array<MenuData>;
    public hamburgerMenuInfo: Array<MenuData>;
    public titleHeader: string;
    public isOpened: boolean = false;
    public isSearchOpened: boolean = false;
    public isActive: boolean = false;
    public _sportLeagueAbbrv: string = GlobalSettings.getSportLeagueAbbrv();
    /*public _collegeDivisionAbbrv: string = GlobalSettings.getCollegeDivisionAbbrv();*/
    public _sportName: string = GlobalSettings.getSportName().toUpperCase();
    private elementRef:any;

    public scrollTopPrev: number = 0;
    public scrollMenuUp: boolean = false;
    public menuTransitionAmount: number = 0;
    public pageHeader: any;
    public pageHeaderHeight: any;

    constructor(elementRef: ElementRef, private _renderer: Renderer, private _router:Router){
        this.elementRef = elementRef;
    }



    ngAfterContentChecked() {
        this.getHeaderHeight();
    }


    getHeaderHeight() {
        this.pageHeader = document.getElementById('pageHeader');
        this.pageHeaderHeight = this.pageHeader.offsetHeight;
        this.scrollPadding.emit(this.pageHeaderHeight);
        return this.pageHeaderHeight;
    }



    onScrollStick(event) {
        var headerBottom = document.getElementById('header-bottom');
        var headerBottomHeight = headerBottom.offsetHeight;
        var scrollTop = event.srcElement ? event.srcElement.body.scrollTop : document.documentElement.scrollTop; //fallback for firefox scroll events
        var scrollPolarity = scrollTop - this.scrollTopPrev; //determines if user is scrolling up or down
        var headerHeight = this.getHeaderHeight() - headerBottomHeight;

        if (scrollPolarity > 0) {
            this.scrollMenuUp = true;
            if (this.menuTransitionAmount >= -headerHeight) {
                this.menuTransitionAmount = this.menuTransitionAmount - scrollPolarity;
                if (this.menuTransitionAmount < -headerHeight) { //if the value doesn't calculate quick enough based on scroll speed set it manually
                    this.menuTransitionAmount = -headerHeight;
                }
            }
        }
        else if (scrollPolarity < 0) {
            this.scrollMenuUp = false;
            this.menuTransitionAmount = 0;
        }
        // fix for 'page overscroll' in safari
        if (scrollTop == 0) {
            this.menuTransitionAmount = 0;
        }
        this.scrollTopPrev = scrollTop; //defines scrollPolarity
    } //onScrollStick



    openSearch(event) {
        if(event.target.parentElement.classList.contains('active') || event.target.parentElement.parentElement.classList.contains('active')){
            event.target.parentElement.classList.remove('active');
            event.target.parentElement.parentElement.classList.remove('active');
        }
        else {
            event.target.parentElement.classList.add('active');
            event.target.parentElement.parentElement.classList.add('active');
        }
    }

    // Page is being scrolled
    loadData(partnerID: string) {
        this.logoUrl = 'app/public/Home-Run-Loyal_Logo.svg';
        this.hamburgerMenuData = [{
            menuTitle: "Home",
            url: ['Home-page']
        },
            {
                menuTitle: "Pick a Team",
                url: ['Pick-team-page']
            },
            {
                menuTitle: "MLB League",
                url: ['MLB-page']
            },
            {
                menuTitle: "MLB Schedule",
                url: ['Schedules-page-league', {pageNum:1}]
            },
            {
                menuTitle: "MLB Standings",
                url: ['Standings-page-league', {type: 'mlb'}]
            }];
        this.hamburgerMenuInfo = [{
            menuTitle: "About Us",
            url: ['About-us-page']
        },
            {
                menuTitle: "Contact Us",
                url: ['Contact-us-page']
            },
            {
                menuTitle: "Disclaimer",
                url: ['Disclaimer-page']
            }];
    }

    public getMenu(event): void{
        if(this.isOpened == true){
            this.isOpened = false;
        }else{
            this.isOpened = true;
        }
    }
    ngOnInit(){
        setTimeout(() => {
            this.scope = GlobalSettings.getScopeNow();
        }, 1000);

        stButtons.locateElements();
        this._renderer.listenGlobal('document', 'click', (event) => {
            var element = document.elementFromPoint(event.clientX, event.clientY);
            let menuCheck = element.className.indexOf("menucheck");
            let searchCheck = element.className.indexOf("searchcheck");
            if(this.isOpened && menuCheck < 0){
                this.isOpened = false;
            }
            if(this.isSearchOpened && searchCheck < 0){
                this.isSearchOpened = false;
            }
        });
        this.logoUrl = 'app/public/Home-Run-Loyal_Logo.svg';
        //insert salad bar
        var v = document.createElement('script');
        v.src = 'http://w1.synapsys.us/widgets/deepdive/bar/bar.js?brandHex=234a66';
        document.getElementById('header-bottom').insertBefore(v, document.getElementById('salad-bar'));

        /*var setPlaceholder = setInterval(function(){ // keep checking for the existance of the salad bar until it loads in
            if (document.getElementById('ddb-search-desktop')) {
                //override the salad bar default placeholder text, and use the one for TDL
                document.getElementById('ddb-search-desktop')['placeholder'] = "Search for a sports team…";
                document.getElementById('ddb-small-desktop-search-input')['placeholder'] = "Search for a sports team…";
                document.getElementById('ddb-search-mobile')['placeholder'] = "Search for a sports team…";
                //override the default salad bars hamburger icon and use the scoreboard icon when on TDL
                var scoreboardIcon = document.getElementById('ddb-dropdown-boxscores-button').getElementsByClassName('ddb-icon')[0];
                scoreboardIcon.classList.add('fa','fa-box-scores');
                scoreboardIcon.classList.remove('ddb-icon-bars','ddb-icon');

                //dont need to keep running this anymore now that its all set
                clearInterval(setPlaceholder);
            }
        }, 1000);*/

    }
    ngOnChanges() {
        this.loadData(this.partnerID);
    }
}
