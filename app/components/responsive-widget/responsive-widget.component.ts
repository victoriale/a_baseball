import {Component, Input, Output, ChangeDetectorRef, OnInit} from '@angular/core';


@Component({
  selector: 'responsive-widget',
  templateUrl: './app/components/responsive-widget/responsive-widget.component.html',
  directives: []
})

export class ResponsiveWidget implements OnInit {
    windowWidth: number = 10;
    ngOnInit() {
        window.onresize = this.onWindowLoadOrResize;
        this.onWindowLoadOrResize();
    }
    private onWindowLoadOrResize() {
      this.windowWidth = window.innerWidth;
    }

}
