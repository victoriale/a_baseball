import {Component, OnInit} from 'angular2/core';
import {TitleComponent} from '../../components/title/title.component';
import {CircleImage} from '../../components/images/circle-image';
import {CircleImageData} from '../../components/images/image-data';

@Component({
    selector: 'title-loc-component',
    
    templateUrl: './app/components/title/title.component.html',
    directives: [TitleComponent, CircleImage],
    inputs: ['data']
})
export class TitleLocComponent implements OnInit{
    public data: Object;
    public titleImage: CircleImageData;

    name() {
        if(typeof this.data == 'undefined'){
            this.data =
            {
                titleImg : '/app/public/img_bckgnd.png',
                smallText1 : '',
                smallText2 : 'Location: United States of America',
                heading1 : '[City]',
                heading2 : '[State]',
                heading3 : '[##]',
                heading4 : 'Listings Available for Sale',
                icon : 'fa fa-map-marker',
                hasHover: true
            };
        }
        // console.log(this);
    }

    ngOnInit(){
      this.titleImage = {
        imageClass: "page-title-titleImage",
        mainImage: {
          imageUrl: "/app/public/img_bckgnd.png",
          imageClass: "page-title-border2"
        }
      };
        this.name();
    }
}
