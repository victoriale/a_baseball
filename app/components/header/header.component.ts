import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {Search, SearchInput} from '../../components/search/search.component';
import {Router, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {SubHeaderComponent} from '../../components/sub-header/sub-header.component';
declare var stButtons: any;
declare var jQuery:any;

@Component({
    selector: 'header-component',
    templateUrl: './app/components/header/header.component.html',
    directives: [Search, ROUTER_DIRECTIVES, SubHeaderComponent],
    providers: [],
})
export class HeaderComponent implements OnInit,OnChanges {
  @Input('partner') partnerID:string;
  public logoUrl:string;
  private _stickyHeader: string;
  public searchInput: SearchInput = {
       placeholderText: "Search for a player or team...",
       hasSuggestions: true
  };
  loadData(partnerID: string) {
    if(partnerID != null && partnerID !== undefined && partnerID != "") {
      this.logoUrl = 'app/public/Logo_My-Home-Run-Zone.svg';
    } else {
      this.logoUrl = 'app/public/Home-Run-Loyal_Logo.svg';
    }
    console.log(this.logoUrl);
  }
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
  }

  ngOnInit(){
    stButtons.locateElements();
  }
  ngOnChanges() {
    this.loadData(this.partnerID);
  }


}
