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
    dangerousWidgetUrl: string  = '/app/ads/widget1.html';
    
    safeWidgetUrl: SafeResourceUrl;

    constructor(private _sanitizer: DomSanitizationService) {
        this.safeWidgetUrl = _sanitizer.bypassSecurityTrustResourceUrl(this.dangerousWidgetUrl);
    }

    // Page is being scrolled
    onScroll(event) {
        var y_buffer = 40;
        var $widget = jQuery("#widget");
        var $pageWrapper = jQuery(".widget-page-wrapper");
        if ( $widget.length > 0 && $pageWrapper.length > 0 ) {
            var scrollTop = jQuery(window).scrollTop();
            var widgetHeight = $widget.height();
            var pageWrapperTop = $pageWrapper.offset().top;
            var pageWrapperBottom = pageWrapperTop+$pageWrapper.height();

            if ( (scrollTop + widgetHeight + y_buffer) > pageWrapperBottom ) {
                $widget.removeClass("widget-fixed");
                $widget.addClass("widget-bottom");
                var diff = $pageWrapper.height() - (widgetHeight + y_buffer);
                $widget.get(0).style.top = diff + "px";
            }
            else if ( scrollTop < pageWrapperTop ) {
                $widget.removeClass("widget-fixed");
                $widget.removeClass("widget-bottom");
                $widget.get(0).style.top = "";
            }
            else {
                $widget.addClass("widget-fixed");
                $widget.removeClass("widget-bottom");
                $widget.get(0).style.top = "";
            }
        }
    }

}
