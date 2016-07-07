import {Component, Input, OnChanges} from '@angular/core';
import {DomSanitizationService, SafeResourceUrl} from '@angular/platform-browser';
import {Http, Headers} from '@angular/http';
declare var jQuery:any;

@Component({
    selector: 'widget-module',
    templateUrl: './app/modules/widget/widget.module.html',
    inputs: ['aiSidekick']
})

export class WidgetModule implements OnChanges{
    @Input() aiSidekick:boolean;
    //dangerousWidgetUrl:string = "http://w1.synapsys.us/widgets/realestate/standard2.html";
    dangerousWidgetUrl:string = '/app/ads/widget1.html';
    safeWidgetUrl:SafeResourceUrl;
    headerHeight:string;
    sidekickHeight:number;

    constructor(private _sanitizer:DomSanitizationService) {
        this.safeWidgetUrl = _sanitizer.bypassSecurityTrustResourceUrl(this.dangerousWidgetUrl);
    }

    ngOnChanges() {
        if (this.aiSidekick) {
            this.dangerousWidgetUrl = '/app/ads/aiSidekick.html';
            this.safeWidgetUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.dangerousWidgetUrl);
        }
        else {
            this.aiSidekick = false;
        }
    }

    ngOnInit() {
        var padding = document.getElementById('pageHeader').offsetHeight;
        if (!this.aiSidekick) {
            this.headerHeight = padding + 'px';
        } else {
            this.headerHeight = padding + 95 + 'px';
        }
    }

    // Page is being scrolled
    onScroll(event) {
        var padding = document.getElementById('pageHeader').offsetHeight;
        var y_buffer = 40;
        var scrollTop = jQuery(window).scrollTop();
        if (!this.aiSidekick) {
           this.sidekickHeight = 0;
         } else {
           console.log('top',scrollTop);
           console.log('curr',this.sidekickHeight);
             this.sidekickHeight = 95 - scrollTop; //95 is static height set for a distance from header to top of image and media. need to fix this if the title goes past two lines
             console.log('After',this.sidekickHeight);
             if(this.sidekickHeight <= 0){
               this.sidekickHeight = 0;
             }
             y_buffer += this.sidekickHeight;
         }
        this.headerHeight = padding + this.sidekickHeight + 'px';
        var $widget = jQuery("#widget");
        var $pageWrapper = jQuery(".widget-page-wrapper");
        if ($widget.length > 0 && $pageWrapper.length > 0) {
            var widgetHeight = $widget.height();
            var pageWrapperTop = $pageWrapper.offset().top;
            var pageWrapperBottom = pageWrapperTop + $pageWrapper.height() - padding;
            if ((scrollTop + widgetHeight + y_buffer) > pageWrapperBottom) {
                this.headerHeight = this.sidekickHeight + 'px';
                $widget.addClass("widget-bottom");
                var diff = $pageWrapper.height() - (widgetHeight + y_buffer);
                $widget.get(0).style.top = diff + "px";
            }
            else if (scrollTop < pageWrapperTop) {
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
