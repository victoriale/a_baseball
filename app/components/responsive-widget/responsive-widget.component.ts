import {Component, Input, Output, ChangeDetectorRef, OnInit} from '@angular/core';


@Component({
  selector: 'responsive-widget',
  templateUrl: './app/components/responsive-widget/responsive-widget.component.html',
  directives: []
})

export class ResponsiveWidget implements OnInit {
  @Input() embedPlace: string;
  @Input() displayAtRes: string;

  windowWidth: number = 10;
  widgetMed:boolean=false;
  widgetSml:boolean=false;

  ngOnInit() {
    this.displayAtRes = "_" + this.displayAtRes + "only"
    var windowWidth = window.innerWidth;
    if(windowWidth <= 640){
      this.widgetSml = true;
      this.widgetMed = false;
    }else if(windowWidth < 1024 && windowWidth > 640){
      this.widgetSml = false;
      this.widgetMed = true;
    }
    this.windowWidth = windowWidth;
  }
  private onWindowLoadOrResize(event) {
    var windowWidth = event.target.innerWidth;
    if(windowWidth <= 640){
      this.widgetSml = true;
      this.widgetMed = false;
    }else if(windowWidth < 1024 && windowWidth > 640){
      this.widgetSml = false;
      this.widgetMed = true;
    }
    this.windowWidth = windowWidth;
  }
}
