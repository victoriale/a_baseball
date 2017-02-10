import {Component, Input} from '@angular/core';
import {CircleImage} from "../../images/circle-image";

@Component({
    selector: 'profile-data-component',
    templateUrl: './app/components/articles/profileData/profileData.component.html',
    directives: [CircleImage]
})

export class ProfileDataComponent{
    @Input() articleData:any;
    @Input() articleSubType:any;
    @Input() articleType:any;
    @Input() imageLinks:any;
    @Input() index:any;
}