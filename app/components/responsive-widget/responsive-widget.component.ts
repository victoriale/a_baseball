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
    window.onresize = this.onWindowLoadOrResize;
  }
  private onWindowLoadOrResize(event) {
    var windowWidth = event.target.outerWidth;
    console.log(windowWidth);
    console.log(event);
    if(windowWidth <= 640){
      this.widgetSml = true;
    }else if(windowWidth <= 1024 && windowWidth > 640){
      this.widgetMed = true;
    }
    console.log(this.widgetMed, this.widgetSml);
  }
}
