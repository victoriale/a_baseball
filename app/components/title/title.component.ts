import {Component, Input} from 'angular2/core';
import {CircleImage} from '../../components/images/circle-image';
import {CircleImageData} from '../../components/images/image-data';

export interface TitleInputData{
    imageURL  : string;
    text1     : string;
    text2     : string;
    text3     : string;
    text4     : string;
    icon      : string;
    hasHover? : boolean;
}

@Component({
    selector: 'title-component',
    templateUrl: './app/components/title/title.component.html',
    
    directives: [CircleImage],
    inputs: ['titleData']
})
export class TitleComponent{
    public titleData: TitleInputData;
    public titleImage: CircleImageData;

    titleComp(){
        if(typeof this.titleData == 'undefined'){
            this.titleData =
            {
                imageURL : '/app/public/mainLogo.png',
                text1: "lorem ipsum delor",
                text2: "ipsum delor lorem",
                text3: "lorem ipsum delor",
                text4: "lorem ipsum delor",
                icon: 'fa fa-map-marker',
                hasHover: true
            };
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
