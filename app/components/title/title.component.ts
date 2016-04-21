import {Component, Input} from 'angular2/core';
import {CircleImage} from '../../components/images/circle-image';
import {CircleImageData} from '../../components/images/image-data';

@Component({
    selector: 'title-component',
    templateUrl: './app/components/title/title.component.html',
    
    directives: [CircleImage],
    inputs: ['titleData']
})
export class TitleComponent{
    public titleData: Array<Object>;
    public titleImage: CircleImageData;

    titleComp(){
        if(typeof this.titleData == 'undefined'){
            this.titleData =
            [{
                imageURL : '/app/public/mainLogo.png',
                smallText1 : 'Monday, February 23, 2016',
                smallText2 : ' United States of America',
                heading1 : 'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet',
                heading2 : '',
                heading3 : 'Lorem ipsum dolor sit amet Lorem',
                heading4 : '',
                icon: 'fa fa-map-marker',
                hasHover: true
            }];
        }
    }

    ngOnInit(){
      this.titleImage = {
        imageClass: "page-title-titleImage",
        mainImage: {
          imageUrl: "/app/public/mainLogo.png",
          imageClass: "page-title-border2"
        }
      };
      this.titleComp();
    }

}
