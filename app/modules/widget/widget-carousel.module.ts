import {Component, Input} from '@angular/core';
import {Http, Headers} from '@angular/http';
declare var jQuery:any;

@Component({
    selector: 'widget-carousel-module',
    templateUrl: './app/modules/widget/widget.module.html',
    inputs: ['aiSidekick']
})

export class WidgetCarouselModule {
    @Input() aiSidekick:boolean;
    sidekickHeight:number = 0;
    headerHeight:string;
    lastScrollTop:number = jQuery(window).scrollTop();

    public scrollTopPrev: number = 0;
    public scrollMenuUp: boolean = false;
    public menuTransitionAmount: number = 0;
    public pageHeader: any;
    public pageHeaderHeight: any;
    public userHasScrolledDown: boolean = false;

    ngOnInit() {
        var titleHeight = jQuery('.articles-page-title').height();

        var padding = 420;
        if( document.getElementById('pageHeader') != null){
        var padding = document.getElementById('pageHeader').offsetHeight + 420;
        }

        if( document.getElementById('partner') != null){
            var partnerHeight = document.getElementById('partner').offsetHeight;
            padding += partnerHeight;
        }

        if (!this.aiSidekick) {
            this.headerHeight = padding + 'px';
        } else {
            if (titleHeight == 40) {
                this.headerHeight = padding + 95 + 'px';
            } else if (titleHeight == 80) {
                this.headerHeight = padding + 135 + 'px';
            }
        }
    }

    ngAfterContentChecked() {
        this.getHeaderHeight();
    }

    getHeaderHeight() {
        this.pageHeader = document.getElementById('pageHeader');
        this.pageHeaderHeight = this.pageHeader.offsetHeight;
        return this.pageHeaderHeight;
    }

    onScroll(event) {
        var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        var pageWrapper = jQuery('.deep-dive-container2a');
        var pageWrapperHeight = pageWrapper.height();
        var headerBottom = document.getElementById('header-bottom');
        var headerBottomHeight = headerBottom.offsetHeight;
        var scrollTop = window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop; //fallback for firefox scroll events
        var scrollPolarity = scrollTop - this.scrollTopPrev; //determines if user is scrolling up or down
        var totalHeaderHeight = this.pageHeaderHeight; // height of entire header
        var headerHeight = this.getHeaderHeight() - headerBottomHeight; // height of header without bottom bar
        var deepDiveBar = jQuery("#deep-dive-blueBar").length ? jQuery("#deep-dive-blueBar") : null;
        var deepDiveBarHeight = deepDiveBar ? jQuery("#deep-dive-blueBar").height() : 0;
        var deepDiveBarOffsetHeight = deepDiveBar ? jQuery("#deep-dive-blueBar").offset().top - scrollTop : 0;
        var carousel = jQuery('.carousel_scroll');
        var carouselHeight = carousel.height();
        var carsouelOffsetHeight = scrollTop - carousel.offset().top;
        var widgetWrapper = jQuery('.widget_wrapper');
        var widgetWrapperHeight = widgetWrapper ? widgetWrapper.height() : 0;
        var footer = jQuery('.footer');
        var footerHeight = footer ? jQuery('.footer').height() : 0;
        var footerOffsetTop = jQuery('.footer').offset().top; // distance footer is from top
        var widgetFromTop = jQuery('.sticky').length ? jQuery('.sticky').offset().top - jQuery(window).scrollTop() : null; // distance widget is from top when it is sticky
        var footerFromTop = footerOffsetTop - (jQuery(window).scrollTop()); // distance footer is from top as the user scrolls
        var bottom_of_screen = jQuery(window).scrollTop() + jQuery(window).height(); //distance to bottom of page
        var alignmentBuffer = 20; // set for scrolling alignment of bototm of widget
        var offsetPadding = 7; // set to align bottom of widget with bottom of page content

        if (scrollPolarity > 0) {
            if (this.menuTransitionAmount >= -headerHeight) {
                if ( (carouselHeight-carsouelOffsetHeight) < headerBottomHeight ) {
                    pageWrapper.css({'padding-top':deepDiveBarHeight}); // set pagewrapper padding so when deep dive bar is sticky it doesn't jump
                    widgetWrapper.css({'position':'fixed', 'top': headerBottomHeight+deepDiveBarHeight}).addClass('sticky'); // make widget sticky
                    if ( deepDiveBar ) {
                        deepDiveBar.css({'top': headerBottomHeight, 'position':'fixed'}).addClass('sticky'); // make deep dive bar sticky
                    }
                }
                this.menuTransitionAmount = this.menuTransitionAmount - scrollPolarity;
                if (this.menuTransitionAmount < -headerHeight) { //if the value doesn't calculate quick enough based on scroll speed set it manually
                    this.menuTransitionAmount = -headerHeight;
                }
            }
            if ( this.userHasScrolledDown ) { // this check is for the scroll down animation of the header, it immediately comes into view if the user scroll down
                if ( deepDiveBar ) {
                    deepDiveBar.css({'top': totalHeaderHeight+this.menuTransitionAmount});
                }
                widgetWrapper.css({'position':'fixed', 'top': totalHeaderHeight+deepDiveBarHeight+this.menuTransitionAmount});
            }
        }
        else if (scrollPolarity < 0) {
            this.menuTransitionAmount = 0;
            if ( carsouelOffsetHeight <= carouselHeight-totalHeaderHeight ) {
                this.userHasScrolledDown = false;
                pageWrapper.css({'padding-top':0});
                widgetWrapper.css({'position':'relative', 'top': 0}).removeClass('sticky');
                if ( deepDiveBar ) {
                    deepDiveBar.css({'top': 0, 'position':'relative'}).removeClass('sticky');
                }
            }
            else {
                this.userHasScrolledDown = true;
                if ( deepDiveBar ) {
                    deepDiveBar.css({'top': totalHeaderHeight}).addClass('sticky');
                }
                widgetWrapper.css({'top': totalHeaderHeight+deepDiveBarHeight}).addClass('sticky');
            }
        }

        if ( (widgetWrapperHeight + widgetFromTop)+deepDiveBarHeight >= (footerFromTop - widgetFromTop)-alignmentBuffer ) {
                widgetWrapper.removeClass('sticky').addClass("widget-bottom");
                var diff =  deepDiveBar ?
                            pageWrapperHeight - (widgetWrapperHeight+(offsetPadding)) :
                            pageWrapperHeight - (widgetWrapperHeight+(offsetPadding+50)); //(offsetPadding)
                widgetWrapper.css({'top': diff + "px"});
        }
        else {
            widgetWrapper.removeClass("widget-bottom").addClass('sticky');
        }
        // fix for 'page overscroll' in safari
        if (scrollTop == 0) {
            this.menuTransitionAmount = 0;
        }
        this.scrollTopPrev = scrollTop; //defines scrollPolarity
    } //onScroll

    // Page is being scrolled
    // onScroll(event) {
    //     var scrollTop = jQuery(window).scrollTop();
    //     var pageHeaderHeight = document.getElementById('pageHeader').offsetHeight;
    //     var partnerHeight = document.getElementById('partner') != null ? document.getElementById('partner').offsetHeight:0;
    //     if( document.getElementById('partner') != null && scrollTop <=  (jQuery('.deep-dive-container1').height() + partnerHeight)){
    //         partnerHeight = partnerHeight + scrollTop;
    //     }
    //     var blueBar = 0;
    //     if (document.getElementById('deep-dive-blueBar') != null){
    //       blueBar = document.getElementById('deep-dive-blueBar').offsetHeight;
    //     }
    //     var headerBottomHeight = document.getElementById('header-bottom').offsetHeight;
    //     var headerBottomOffsetHeight = jQuery("#header-bottom").offset().top - scrollTop
    //     var titleHeight = 0;
    //     var padding = 0;
    //     if( document.getElementById('pageHeader') != null) {
    //         var padding = document.getElementById('pageHeader').offsetHeight;
    //     }
    //     var y_buffer = 50;
    //     var maxScroll = partnerHeight - scrollTop;
    //     var carouselTop = jQuery('.deep-dive-container1').height() - scrollTop;
    //     var scrollPolarity = scrollTop - this.scrollTopPrev; //determines if user is scrolling up or down
    //     var deepDiveBarOffsetHeight = jQuery("#deep-dive-blueBar").offset().top - scrollTop;
    //     if (!this.aiSidekick) {
    //         this.sidekickHeight = 0;
    //     } else {
    //         titleHeight = jQuery('.articles-page-title').height();
    //         if (titleHeight == 40) {//
    //             this.sidekickHeight = 95;
    //         } else if (titleHeight == 80) {
    //             this.sidekickHeight = 135;
    //         }
    //         if (maxScroll <= 0) {
    //             this.sidekickHeight += maxScroll;
    //             if (this.sidekickHeight < 0) {
    //                 this.sidekickHeight = 0
    //             }
    //         }
    //         y_buffer += this.sidekickHeight;
    //     }
    //     if(maxScroll <= 0){
    //         maxScroll = 0;
    //     }
    //     if(carouselTop <=0){
    //       carouselTop = 0;
    //     }
    //     //this.headerHeight = carouselTop + padding + maxScroll + this.sidekickHeight + 'px';
    //     //set class on blue bar and widget once user has scrolled past the carousel and top partner header
    //     if ( scrollPolarity > 0 ) {
    //         if ( deepDiveBarOffsetHeight <= headerBottomHeight ) {
    //           // Grab current scrollTop
    //           var st = jQuery(window).scrollTop();
    //           // Compare current scollTop (st) to last scrollTop to determine scrolling direction and which class to add
    //           if (st > this.lastScrollTop) {
    //             // Scrolling down
    //             jQuery("#widget").removeClass("widget-top-ddp-up");
    //             jQuery("#widget").addClass("widget-top-ddp");
    //             jQuery("#deep-dive-blueBar").addClass("deep-dive-blueBar-top").css('top', headerBottomHeight);
    //           } else {
    //             // Scrolling up
    //             jQuery("#widget").removeClass("widget-top-ddp");
    //             jQuery("#widget").addClass("widget-top-ddp-up");
    //             jQuery("#deep-dive-blueBar").addClass("deep-dive-blueBar-top").css('top', headerBottomHeight);
    //           }
    //           this.lastScrollTop = st;
    //         }
    //         else if ( deepDiveBarOffsetHeight > headerBottomHeight && deepDiveBarOffsetHeight <= pageHeaderHeight ){
    //             // jQuery("#deep-dive-blueBar").css('top', headerBottomOffsetHeight+headerBottomHeight);
    //         }
    //     }
    //     else if ( scrollPolarity < 0 ) {
    //         if ( carouselTop <= 0 ) {
    //             jQuery("#deep-dive-blueBar").css('top', pageHeaderHeight);
    //         }
    //         else if ( carouselTop > 0 ) {
    //           jQuery("#widget").removeClass("widget-top-ddp-up");
    //           jQuery("#widget").removeClass("widget-top-ddp");
    //           jQuery("#deep-dive-blueBar").removeClass("deep-dive-blueBar-top").css('top', 0);
    //         }
    //     }
    //     var $widget = jQuery("#widget");
    //     var pageWrapper = jQuery(".deep-dive-container2a");
    //     if ($widget.length > 0 && pageWrapper.length > 0) {
    //         var widgetHeight = $widget.height();
    //         var pageWrapperTop = pageWrapper.offset().top;
    //         var pageWrapperBottom = pageWrapperTop + pageWrapper.height() - padding;
    //         //logic for when user scrolls to bottom of page
    //         if ((scrollTop + widgetHeight + y_buffer) > (pageWrapperBottom  + this.sidekickHeight)) {
    //             this.headerHeight = this.sidekickHeight + 'px';
    //             $widget.addClass("widget-bottom");
    //             var diff = pageWrapper.height() - (widgetHeight + y_buffer);
    //             $widget.get(0).style.top = diff + "px";
    //         }
    //         else if (scrollTop < (pageWrapperTop + this.sidekickHeight)) {
    //             $widget.removeClass("widget-bottom");
    //             $widget.get(0).style.top = "";
    //         }
    //         else {
    //             $widget.removeClass("widget-bottom");
    //             $widget.get(0).style.top = "";
    //         }
    //     }
    //     this.scrollTopPrev = scrollTop; //defines scrollPolarity
    // }
}
