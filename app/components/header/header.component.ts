import {Component, Input, OnInit, OnChanges, Output, EventEmitter, ElementRef, Renderer} from '@angular/core';
import {Search, SearchInput} from '../../components/search/search.component';
import {Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {SubHeaderComponent} from '../../components/sub-header/sub-header.component';
import {HamburgerMenuComponent, MenuData} from '../../components/hamburger-menu/hamburger-menu.component';
import {GlobalSettings} from "../../global/global-settings";
declare var stButtons: any;
declare var jQuery:any;

@Component({
    selector: 'header-component',
    templateUrl: './app/components/header/header.component.html',
    directives: [Search, ROUTER_DIRECTIVES, SubHeaderComponent, HamburgerMenuComponent],
    providers: [],
})
export class HeaderComponent implements OnInit, OnChanges{
    @Input('partner') partnerID:string;
    @Output() tabSelected = new EventEmitter();
    public scope: string;
    public routeSubscription: any;
    public logoUrl:string;
    private _stickyHeader: string;
    private _stickyHeaderPartner: string;
    public searchInput: SearchInput = {
        placeholderText: "Search for anything " + GlobalSettings.getSportName(),
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
    scrollTopPrev: number = 0;

    constructor(elementRef: ElementRef, private _renderer: Renderer, private _router:Router){
        this.elementRef = elementRef;
    }
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
                menuTitle: "Disclamer",
                url: ['Disclaimer-page']
            }];
    }
    onScrollStick(event) {
        //check if partner header exist and the sticky header shall stay and not partner header
        var header = document.getElementById('pageHeader');
        var saladBar = document.getElementById('salad-bar-top');
        if( document.getElementById('partner') != null){ // partner header logic
            var partner = document.getElementById('partner');
            var partnerHeight = document.getElementById('partner').offsetHeight;
            var scrollTop = jQuery(window).scrollTop();
            let stickyHeader = partnerHeight ? partnerHeight : 0;
            let maxScroll = stickyHeader - scrollTop;
            if(maxScroll <= 0){
                maxScroll = 0;
            }
            this._stickyHeaderPartner = (maxScroll) + "px";
            if (scrollTop == 0 || scrollTop < this.scrollTopPrev || scrollTop < (header.offsetHeight + saladBar.offsetHeight)) {
                this._stickyHeader = "unset";
                header.classList.add('fixedHeader');
                partner.classList.add('fixedHeader');
            }
            else {
                this._stickyHeader = (maxScroll) + "px";
                header.classList.remove('fixedHeader');
                partner.classList.remove('fixedHeader');
            }
        }else{ // non partner header logic
            var scrollTop = jQuery(window).scrollTop();
            if (scrollTop == 0 || scrollTop < this.scrollTopPrev || scrollTop < (header.offsetHeight + saladBar.offsetHeight)) {
                this._stickyHeader = "unset";
                header.classList.add('fixedHeader');
            }
            else {
                this._stickyHeader = "0px";
                header.classList.remove('fixedHeader');
            }
        }
        this.scrollTopPrev = scrollTop;
    }//onScrollStick ends
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
        v.src = 'http://w1.synapsys.us/widgets/deepdive/bar/bar.js';
        document.getElementById('salad-bar-top').insertBefore(v, document.getElementById('salad-bar'));

        var setPlaceholder = setInterval(function(){ // keep checking for the existance of the salad bar until it loads in
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
        }, 1000);

    }
    ngOnChanges() {
        this.loadData(this.partnerID);
    }
}
