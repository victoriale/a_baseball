import {Component, OnInit} from '@angular/core';
import {DomSanitizationService, SafeResourceUrl} from '@angular/platform-browser';
import {Http, Headers} from '@angular/http';
declare var jQuery: any;

@Component({
    selector: 'widget-module',
    templateUrl: './app/modules/widget/widget.module.html'
})

export class WidgetModule {
    //dangerousWidgetUrl:string = "http://w1.synapsys.us/widgets/realestate/standard2.html";
    //dangerousWidgetUrl: string  = '/app/ads/widget1.html';
    //commented out because of iframe issue on safari with angular router
    safeWidgetUrl: SafeResourceUrl;

    headerHeight:string;
    constructor(private _sanitizer: DomSanitizationService) {
        //this.safeWidgetUrl = _sanitizer.bypassSecurityTrustResourceUrl(this.dangerousWidgetUrl);
    }

    ngOnInit(){
      var pageHeader = document.getElementById('pageHeader');
      var padding;
      if(pageHeader != null){
        padding = pageHeader.offsetHeight;
      }
      this.headerHeight = padding + 'px';
    }

    // Page is being scrolled
    onScroll(event) {
      var padding = document.getElementById('pageHeader').offsetHeight;
      this.headerHeight = padding + 'px';

        var y_buffer = 40;
        var $widget = jQuery("#widget");
        var $pageWrapper = jQuery(".widget-page-wrapper");
        if ( $widget.length > 0 && $pageWrapper.length > 0 ) {
            var scrollTop = jQuery(window).scrollTop();
            var widgetHeight = $widget.height();
            var pageWrapperTop = $pageWrapper.offset().top;
            var pageWrapperBottom = pageWrapperTop+$pageWrapper.height() - padding;
            if ( (scrollTop + widgetHeight + y_buffer) > pageWrapperBottom ) {
                this.headerHeight = '0px';
                $widget.addClass("widget-bottom");
                var diff = $pageWrapper.height() - (widgetHeight + y_buffer);
                $widget.get(0).style.top = diff + "px";
            }
            else if ( scrollTop < pageWrapperTop ) {
                $widget.removeClass("widget-bottom");
                $widget.get(0).style.top = "";
            }
            else {
                $widget.removeClass("widget-bottom");
                $widget.get(0).style.top = "";
            }
        }
    }

}
