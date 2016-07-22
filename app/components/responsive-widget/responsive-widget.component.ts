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
  ngOnInit() {
    this.displayAtRes = "_" + this.displayAtRes + "only"
    window.onresize = this.onWindowLoadOrResize;
    this.onWindowLoadOrResize();
  }
  private onWindowLoadOrResize() {
    this.windowWidth = window.innerWidth;
  }

}
