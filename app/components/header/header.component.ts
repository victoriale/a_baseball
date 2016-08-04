import {Component, Input, OnInit, OnChanges, Output, EventEmitter, ElementRef, Renderer} from '@angular/core';
import {Search, SearchInput} from '../../components/search/search.component';
import {Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {SubHeaderComponent} from '../../components/sub-header/sub-header.component';
import {HamburgerMenuComponent, MenuData} from '../../components/hamburger-menu/hamburger-menu.component';
declare var stButtons: any;
declare var jQuery:any;

@Component({
    selector: 'header-component',
    templateUrl: './app/components/header/header.component.html',
    directives: [Search, ROUTER_DIRECTIVES, SubHeaderComponent, HamburgerMenuComponent],
    providers: [],
})
export class HeaderComponent implements OnInit,OnChanges {
  @Input('partner') partnerID:string;
  @Output() tabSelected = new EventEmitter();
  public logoUrl:string;
  private _stickyHeader: string;
  public searchInput: SearchInput = {
       placeholderText: "Search for a player or team...",
       hasSuggestions: true
  };
  public hamburgerMenuData: Array<MenuData>;
  public hamburgerMenuInfo: Array<MenuData>;
  public titleHeader: string;
  public isOpened: boolean = false;
  public isActive: boolean = false;
  private elementRef:any;
  constructor(elementRef: ElementRef, private _renderer: Renderer){
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
  }//loadData ends
  // Page is being scrolled
  onScrollStick(event) {
    //check if partner header exist and the sticky header shall stay and not partner header
    if( document.getElementById('partner') != null){
      var partnerHeight = document.getElementById('partner').offsetHeight;
      var scrollTop = jQuery(window).scrollTop();
      let stickyHeader = partnerHeight ? partnerHeight : 0;

      let maxScroll = stickyHeader - scrollTop;

      if(maxScroll <= 0){
        maxScroll = 0;
      }

      this._stickyHeader = (maxScroll) + "px";
    }else{
      this._stickyHeader = "0px"
    }
  }//onScrollStick ends
   public getMenu(event): void{
     if(this.isOpened == true){
       this.isOpened = false;
     }else{
       this.isOpened = true;
     }
   }
  ngOnInit(){
    stButtons.locateElements();
    this._renderer.listenGlobal('document', 'click', (event) => {
      var element = document.elementFromPoint(event.clientX, event.clientY);
      let menuCheck = element.className.indexOf("menucheck");
      if(this.isOpened && menuCheck < 0){
        this.isOpened = false;
      }
    });
  }

  ngOnChanges() {
    this.loadData(this.partnerID);
  }
}
