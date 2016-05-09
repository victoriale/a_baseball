import {Component} from 'angular2/core';
import {DetailedListItem, DetailListInput} from '../../components/detailed-list-item/detailed-list-item.component';
import {ModuleFooter, ModuleFooterData, FooterStyle} from '../../components/module-footer/module-footer.component';
import {SliderCarousel, SliderCarouselInput} from '../../components/carousels/slider-carousel/slider-carousel.component';
import {TitleComponent} from '../../components/title/title.component';
import {BackTabComponent} from '../../components/backtab/backtab.component';
@Component({
    selector: 'list-page',
    templateUrl: './app/webpages/list-page/list.page.html',
    directives: [BackTabComponent, TitleComponent, SliderCarousel, DetailedListItem,  ModuleFooter],
    providers: [],
    inputs:[]
})

export class ListPage{
  dataArray: any;
  detailedDataArray:any;
  carouselDataArray: any;
  footerData: Object;
  footerStyle: any;
  constructor(){
    this.footerStyle = {
      ctaBoxClass: "list-footer",
      ctaBtnClass:"list-footer-btn",
      hasIcon: true,
    };

  }


  selectedTab(event){//each time a tab is selected the carousel needs to change accordingly to the correct list being shown
    this.carouselDataArray = this.dataArray[event-2014]['carData'];
  }


}
